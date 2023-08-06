---
title: 从零开始写一个RPC框架
date: 2023-08-06
excerpt: "本文基于netty和springboot实现了一个基础的RPC框架服务，提供寻址、自动注入、远程调用等功能"
tags:
   - RPC
   - Spring
   - Netty
   - Java
---

# 从零开始写一个RPC框架

> 一直以来都对RPC框架的实现很感兴趣，因此占用了几个下班时间，写出了这篇文章，希望能让读者对RPC框架的原理有个深刻的认识
>
> **说明**：本文所有代码均可在[我的github仓库](https://github.com/YangQuan666/demo/tree/functional)中找到

![rpc](/post/rpc/rpc.svg)

## 开始之前

想象一下，如果要自己实现一个远程调用的框架，我们需要哪些轮子呢，
首先对于Java开发人员来说`Spring框架`是不可避免的；
其次RPC框架涉及到服务的发现和治理，因此我们需要一个注册中心；同时RPC的通信方式我们也要考虑到；
最后网络通信的过程中也离不开字节的序列化工具 ，因此本次的技术栈选型如下：

| 类型    | 技术选型          |
|-------|---------------|
| 开发框架  | Spring Boot 3 |
| 注册中心  | Zookeeper     |
| 网络通信  | Netty         |
| 序列化工具 | Protostuff    |

## 整体流程

一次完成的rpc的流程一般如下：

1. 服务提供方(provider)将自己的服务信息发布到注册中心，比如：服务名称、版本、ip、端口等信息
2. 服务提供方(provider)提供facade包给服务消费方(consumer)，facade包中已经包含请求需要的对象信息、方法名称等
3. 服务消费方(consumer)引入facade包，通过RPC方式调用到服务提供方(provider)，并拿到返回结果

因此我们可以分成三步去实现

## 服务注册

### 服务方注解

1. 我们可以通过`Spring AOP`的功能，定义一个注解`@RpcProvider`

```java

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RpcConsumer {

   // 服务类型（被暴露的实现类的接口类型）
   Class<?> interfaceName();

   // 服务版本（默认为空）
   String version() default "";
}
```

2. 这样我们就能批量的拿到所有加了这个注解的RPC服务， 并将其注册到`Zookeeper`中

```java
public class RpcProviderBeanPostProcessor implements BeanPostProcessor {

   @Resource
   private RpcServiceManager rpcServiceManager;
   @Resource
   private ZookeeperRegistryService zookeeperRegistryService;

   @Override
   public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      RpcProvider rpcProvider = AnnotationUtils.findAnnotation(bean.getClass(), RpcProvider.class);
      if (rpcProvider != null) {
         // 获取服务名称
         String name = rpcProvider.interfaceName().getName();
         // 获取服务版本
         String version = rpcProvider.version();
         // 保存服务到map中
         rpcServiceManager.addService(String.join("-", name, version), bean);
         // 注册服务
         zookeeperRegistryService.register(name + "-" + version);
      }
      return bean;
   }
}
```

### 服务监听

我们使用`Netty`来监听RPC服务的请求，因此就要新增一个`ChannelHandlerAdapter`来处理相应的逻辑，核心代码如下：

```java
public class NettyRpcServerHandler extends SimpleChannelInboundHandler<RpcRequest> {

   // 存储服务名称及服务对象之间的映射关系
   private final Map<String, Object> handlerMap;

   private Object handle(RpcRequest rpcRequest) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
      String name = rpcRequest.getInterfaceName();
      String version = rpcRequest.getVersion();

      // 获取服务对象
      Object serviceBean = handlerMap.get(String.join("-", name, version));
      if (serviceBean == null) {
         throw new RuntimeException(String.format("can not find service bean by key: %s", name));
      }
      // 获取反射调用所需的参数
      Class<?> serviceClass = serviceBean.getClass();
      String methodName = rpcRequest.getMethodName();
      Object[] parameters = rpcRequest.getParameters();
      Class<?>[] parameterTypes = rpcRequest.getParameterTypes();
      // 通过反射调用客户端请求的方法
      Method method = serviceClass.getMethod(methodName, parameterTypes);
      method.setAccessible(true);
      return method.invoke(serviceBean, parameters);
   }
}
```

## 服务消费

### 消费者注解

和之前类似，我们依旧通过自定义注解的方式获取到所有的RPC引用

```java

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RpcConsumer {

   // 服务类型（被暴露的实现类的接口类型）
   Class<?> interfaceName();

   // 服务版本（默认为空）
   String version() default "";
}
```

### 动态代理

但是这样就有一个问题：因为消费者当前引用的这个RPC服务只是个空接口，并不是一个具体的类，
因此我们需要通过`Spring AOP`将其替换为代理类，代理类负责将请求参数包装，然后发送给RPC服务方，然后拿到返回结果。

具体实现方式如下：

1. 通过`BeanPostProcessor`拿到bean，遍历其所有字段，如果有`@RpcConsumer`注解，则将该字段的替换相应的的动态代理类

```java
public class RpcConsumerBeanPostProcessor implements BeanPostProcessor {

   @Autowired
   private ServiceDiscovery<ZookeeperInstance> serviceDiscovery;

   @Override
   public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {

      Class<?> clazz = bean.getClass();
      Field[] declaredFields = clazz.getDeclaredFields();
      for (Field field : declaredFields) {
         RpcConsumer annotation = field.getAnnotation(RpcConsumer.class);
         if (annotation == null) {
            continue;
         }
         Class<?> interfaceClass = annotation.interfaceName();
         String version = annotation.version();

         RpcProxy rpcProxy = new RpcProxy(serviceDiscovery);
         Object proxy = rpcProxy.create(interfaceClass, version);
         field.setAccessible(true);
         try {
            field.set(bean, proxy);
         } catch (IllegalAccessException e) {
            e.printStackTrace();
         }
      }
      return bean;
   }
}
```

2. 动态代理实现方式：
   1. 拿到注解的参数：接口名称、版本号，以便查询`Zookeeper`获取相应的服务信息
   2. 拿到请求参数，使用`Netty`进行远程调用

```java
public class RpcProxy {

   private ServiceDiscovery<ZookeeperInstance> serviceDiscovery;

   /**
    * 该构造函数用于提供给用户通过配置文件注入服务发现组件
    */
   public RpcProxy(ServiceDiscovery<ZookeeperInstance> serviceDiscovery) {
      this.serviceDiscovery = serviceDiscovery;
   }

   public Object create(Class<?> interfaceClass, String version) {
      // 使用 CGLIB 动态代理机制
      Enhancer enhancer = new Enhancer();
      enhancer.setClassLoader(interfaceClass.getClassLoader());
      enhancer.setSuperclass(interfaceClass);
      enhancer.setCallback(
              (MethodInterceptor) (obj, method, args, proxy) -> {
                 // 创建 RPC 请求并设置属性
                 RpcRequest rpcRequest = new RpcRequest();
                 rpcRequest.setRequestId(UUID.randomUUID().toString());
                 rpcRequest.setMethodName(method.getName());
                 rpcRequest.setParameterTypes(method.getParameterTypes());
                 rpcRequest.setParameters(args);
                 rpcRequest.setInterfaceName(interfaceClass.getName());
                 rpcRequest.setVersion(version);

                 //查询zookeeper
                 ServiceInstance<ZookeeperInstance> instance = getInstance(rpcRequest.getInterfaceName(), rpcRequest.getVersion());
                 if (instance == null) {
                    throw new RuntimeException("server address is empty");
                 }
                 // 创建 RPC 客户端对象，建立连接/发送请求/接收请求
                 NettyRpcClientHandler handler = new NettyRpcClientHandler(instance.getAddress(), instance.getPort());
                 RpcResponse rpcResponse = handler.send(rpcRequest);
                 if (rpcResponse == null) {
                    throw new RuntimeException("response is null");
                 }
                 return rpcResponse.getData();
              });
      return enhancer.create();
   }


   private ServiceInstance<ZookeeperInstance> getInstance(String interfaceName, String version) throws Exception {
      String name = String.join("-", interfaceName, version);
      Collection<ServiceInstance<ZookeeperInstance>> serviceInstances = serviceDiscovery.queryForInstances(name);
      Optional<ServiceInstance<ZookeeperInstance>> first = serviceInstances.stream().findFirst();
      return first.orElse(null);
   }
}
```

## 编解码

这一块比较简单，就是继承`Netty`提供的ByteToMessageDecoder、MessageToByteEncoder就可以了，完整代码如下：

```java
// 编码
public class RpcMessageEncoder extends MessageToByteEncoder<Object> {

   private Class<?> clazz;

   public RpcMessageEncoder(Class<?> clazz) {
      this.clazz = clazz;
   }

   @Override
   protected void encode(ChannelHandlerContext ctx, Object msg, ByteBuf out) throws Exception {
      byte[] data = ProtostuffSerializer.serialize(msg, clazz); // 将对象序列化为字节数组
      out.writeInt(data.length); // 将消息体长度写入消息头
      out.writeBytes(data); // 将数据写入消息体
   }
}
```

```java
// 解码
public class RpcMessageDecoder extends ByteToMessageDecoder {

   private Class<?> clazz;

   public RpcMessageDecoder(Class<?> clazz) {
      this.clazz = clazz;
   }

   @Override
   protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {

      // 标记当前readIndex的位置，以便后面重置 readIndex 的时候使用
      in.markReaderIndex();
      // 读取消息体（消息的长度）. readInt 操作会增加 readerIndex
      int length = in.readInt();
      // 如果可读字节数小于消息长度，说明是不完整的消息
      if (in.readableBytes() < length) {
         in.resetReaderIndex();
         return;
      }
      // 开始反序列化
      byte[] body = new byte[length];
      in.readBytes(body);
      Object obj = ProtostuffSerializer.deserialize(body, clazz);
      out.add(obj);
   }
}
```

## 自动装配

至此整体的流程已经全部实现好了，但是我们一般希望把RPC框架作为一个依赖包提供出去的，
因此可以基于Spring的自动装配功能来提供开箱即用的便利性。

以rpc-provider模块为例，首先定义一个配置类`RpcProviderConfiguration`用来装配我们需要的bean

```java

@Configuration
public class RpcProviderConfiguration {

   @Bean
   @ConditionalOnMissingBean
   public NettyServerListener nettyServerListener() {
      return new NettyServerListener();
   }

   @Bean
   @ConditionalOnMissingBean
   public RpcProviderBeanPostProcessor rpcProviderBeanPostProcessor() {
      return new RpcProviderBeanPostProcessor();
   }

   @Bean
   @ConditionalOnMissingBean
   public ZookeeperRegistryService zookeeperRegistryService() {
      return new ZookeeperRegistryService();
   }

   @Bean
   @ConditionalOnMissingBean
   public RpcServiceManager rpcServiceManager() {
      return new RpcServiceManager();
   }
}
```

然后我们需要在`META-INF/spring/`目录创建文件`org.springframework.boot.autoconfigure.AutoConfiguration.imports`（这是Spring
Boot 3.0的新规定），
文件内容填写配置类的包路径即可

```
config.RpcProviderConfiguration
```

## 参考

- [《手写 RPC 框架》](https://github.com/Snailclimb/guide-rpc-framework)
- [从零开始设计一个轻量级分布式 RPC 框架](https://github.com/Veal98/RPC-FromScratch/blob/master/rpc-sample-server/src/main/java/com/cswiki/rpc/sample/server/HelloServiceImpl1.java)
