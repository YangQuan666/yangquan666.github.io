---
title: Java函数式编程入门
date: 2020-09-01
excerpt: "本文介绍了Java函数式编程的基础知识和入门要点，读者将了解函数式编程的核心概念：Lambda表达式的使用、函数接口和Stream API等关键技术。帮助读者初步掌握Java函数式编程的基本原理和应用，为进一步深入学习提供基础。"
tags:
  - java
  - lambda
  - stream
  - 函数式编程
---

# Java 函数式编程入门

> **说明**：本文是自己当时刚工作时做的一次分享，现整理并发表到个人博客中，所有代码均可在[我的github仓库](https://github.com/YangQuan666/demo/tree/functional)中找到

![lambda.jpg](/post/java-stream/lambda.jpg)

## 简介

- 「函数式编程」是一种编程范式，比起「命令式编程」，其更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推到复杂的运算，而不是设计一个复杂的执行过程
- 在函数时编程中，函数是第一公民，意思是说函数既可以作为其他函数的参数，也可以从其他函数中返回
- 典型的函数式编程语言：Haskell，Scala，Erlang，支持函数式编程的语言：JavaScript，Python，C#，Java1.8+

## 区别

| 面向对象编程   | 函数式编程     |
|----------|-----------|
| 一切皆对象    | 函数是第一公民   |
| 封装、继承、多态 | lambda表达式 |
| 数据的抽象    | 行为的抽象     |

## 初步认识

> 下面通过一个创建线程的demo来初步领略下函数式编程的魅力

- 传统方式
  ```java
  // FunctionalTest.java
  
  /**
   * 使用匿名类实现Runnable接口来创建一个线程
   */
  public void createThread() {
    new Thread(new Runnable() {
        @Override
        public void run() {
            System.out.println("thread running...");
        }
    }).start();
  }
  ```
- lambda表达式
  ```java
  // FunctionalTest.java
  
  /**
   * 传入lambda表达式来代替匿名类
   */
  public void createThreadLambda() {
      new Thread(() -> System.out.println("thread running...")).start();
  }
  ```
- 方法引用
  ```java
  // FunctionalTest.java
  
  /**
   * 使用方法引用代替匿名内部类
   */
  public void createThreadMethodReference() {
      new Thread(FunctionalTest::go).start();
  }

  /**
   * FunctionalTest#go()和Runnable#run()具有同样的入参和返回值
   */
  static void go() {
      System.out.println("Go::go()");
  }
  ```

## lambda表达式

### 基本概念

1. lambda表达式是定义函数的最简语法
2. lambda表达式产生的是函数
3. 在JVM中，lambda比匿名类更高效
4. 将lambda表达式作为函数而不是类去看待

### 常见的lambda表达式

#### Runnable

特点：无入参，无返回

```java
// LambdaTest.java

void runnableTest() {
    Runnable runnable = () -> System.out.println("Runnable#run");
    
    runnable.run();
}
```

#### Supplier

特点：无入参，有返回

```java
// LambdaTest.java

void supplierTest() {
    Supplier<String> supplier = () -> "Supplier#get";
    
    String str = supplier.get();
}
```

#### Consumer

特点：有入参，无返回

```java
// LambdaTest.java

void consumerTest() {
    Consumer<String> consumer = (s) -> System.out.println("Consumer#accept: " + s);

    consumer.accept("hello");
}
```

#### Function

特点：有入参，有返回

```java
// LambdaTest.java

void functionalTest() {
    Function<String, String> function = str -> "Function#apply: " + str;

    String res = function.apply("hello");
}
```

`java.util.function`包中有更多自带的lambda表达式，推荐各位去阅读下源码

### 自定义函数

- java规定如果一个`interface`接口类中只包含一个方法，则这个类可以作为函数类型去使用
- 手动添加`@FunctionalInterface`可以帮助编译器静态检查「可选」

比如如下的函数表示入参有三种不同类型，同时也有返回值：

```java
// TriFunction.java

/**
 * 接收三个参数并带有返回值
 */
@FunctionalInterface
interface TriFunction<T, U, V, R> { 
    R apply(T t, U u, V v);
}
```

使用自定义的函数类型来创建lambda函数

```java
// CustomFunctionalTest.java

void test(){
    TriFunction<Integer, Boolean, Double, String> triFunction=(i,b,d) -> String.format("i=%d, b=%b, d=%.2f", i, b, d);
    
    String str=triFunction.apply(1,true,3.14);
    System.out.println(str);
}
```

## 方法引用

**作用**: 如果两个方法具有相同的「方法签名」，则可以使用方法引用来相互代替

**格式**：「类名或对象名」+`::`+「方法名」

**支持的形式**: 静态方法、实例化对象方法、构造方法

### 示例

1. 假设我们有如下的函数接口
   ```java
   // Callable.java
   
   @FunctionalInterface
   interface Callable { 
        void call(String s);
   }
   ```
2. 有如下的User类
   ```java
   // User.java
   
   class User {
   
        private String name;
        
        public User() {
           name = "quan";
        }
   
        public User(String name) {
           this.name = name;
        }
        
        static void play(String game) {
            System.out.println("playing: " + game);
        }
        
        static String sleep() {
            return "sleep good";
        }

        void eat(String food) {
            System.out.println("eating: " + food);
        }
   }
   ```

#### 静态方法引用

```java
// MethodReferenceTest.java

void staticMethodReferenceTest() {
    // 静态方法引用
    Callable callable = User::play;

    // 注意这里是call而不是play
    callable.call("GTA");

}
```

##### 错误的方式

```java
// MethodReferenceTest.java

void staticMethodReferenceErrorTest() {

    // 方法签名不一致，编译不通过
    Callable callable = User::sleep;
    callable.call("Hamburger");
}
```

#### 实例方法引用

```java
// MethodReferenceTest.java

void instanceMethodReferenceTest() {
    // 实例方法引用
    User user = new User();
    Callable callable = user::eat;

    // 注意这里是call而不是play
    callable.call("Hamburger");
}
```

#### 构造方法引用

- 无参构造方法引用
  ```java
  // MethodReferenceTest.java
  
  void noArgConstructMethodReferenceTest(){
    Supplier<User> supplier=User::new;
  User user = supplier.get();
  }
  ```

- 有参构造方法引用
  ```java
  // MethodReferenceTest.java
  
  void allArgConstructMethodReferenceTest() {
      Function<String, User> function = User::new;
      User bob = function.apply("bob");
  }
  ```

## 函数组合

> 函数组合（Function Composition）意为“多个函数组合成新函数”。它通常是函数式编程的基本组成部分

> 注意: 函数组合的返回值仍然是一个函数！！！

### 常见的函数组合方法

| 方法名          | 含义            | 支持的函数类型                        |
|--------------|---------------|--------------------------------|
| andThen(arg) | 先执行自身再执行传入的函数 | Function, Consumer, BiConsumer |
| compose(arg) | 先执行传入的函数再执行自身 | Function                       |
| and(arg)     | 自身和传入函数「逻辑与」  | Predicate                      |
| or(arg)      | 自身和传入函数「逻辑或」  | Predicate                      |
| negate       | 自身「逻辑非」       | Predicate                      |

### 用法演示

```java
// FunctionalComposeTest.java

public class FunctionalComposeTest {

    @Test
    void andThenTest() {
        // 定义原函数
        Function<String, String> function = str -> str + " apply";

        // 传入andThen函数并执行原函数
        String res = function.andThen(s -> s + " andThen").apply("hello");
    }

    @Test
    void composeTest() {
        // 定义原函数
        Function<String, String> function = str -> str + " apply";

        // 传入compose函数并执行原函数
        String res = function.compose(s -> "compose " + s).apply("hello");
    }

    @Test
    void andTest() {
        // 定义原函数
        Predicate<Integer> predicate = i -> i > 0;

        // 传入and函数并执行原函数
        boolean res = predicate.and(i -> i % 2 == 1).test(3);
    }

    @Test
    void orTest() {
        // 定义原函数
        Predicate<Integer> predicate = i -> i > 0;

        // 传入or函数并执行原函数
        boolean res = predicate.or(i -> i % 2 == 0).test(-4);
    }

    @Test
    void negateTest() {
        // 定义原函数
        Predicate<Integer> predicate = i -> i > 0;

        // 调用negate方法并执行原函数
        boolean res = predicate.negate().test(-4);
    }
}
```

## 流式编程

![stream.png](/post/java-stream/stream.png)

### 特点

- **无存储**：stream不是一种数据结构，它只是某种数据源的一个视图，数据源可以是数组、Java容器或者I/O通道
- **为函数而成**：对stream的任何修改都不会影响原本的数据源，比如对stream的过滤操作并不会删除被过滤的元素，而是会产生一个不包含被过滤元素的新stream
- **惰性执行**：stream的操作并不会立即执行，只有用户执行结束操作才会真正执行
- **可消费性**：stream只能被消费一次，一旦遍历过就会失效，就像容器的迭代器那样，想要再次遍历必须重新生成

### 代码阅读

> 阅读如下的两段代码

代码1:
```java
// StreamTest.java

void randomNumber() {
    SortedSet<Integer> sortedSet = new TreeSet<>();
    Random rand = new Random(47);
    while (sortedSet.size() < 7) {
        int r = rand.nextInt(20);
        if (r < 5) {
            continue;
        }
        sortedSet.add(r);
    }
    System.out.println(sortedSet);
}
```

代码2:
```java
// StreamTest.java

void randomNumberStream() {
    int[] array = new Random(47)
            .ints(5, 20)
            .distinct()
            .limit(7)
            .sorted()
            .toArray();

    System.out.println(Arrays.toString(array));
}
```

其实两段代码的功能都是一样的，就是创建一个长度为7的随机有序并且不重复的集合，但是你会发现「代码2」明显可阅读行更强，这就是流式编程的优点之一：易读性好

### 创建流

#### Stream.of

> 你可以通过`Stream.of()`很容易地将一组元素转化成为流

```java
// CreateStreamTest.java

void streamOfTest() {

    // int
    IntStream intStream = IntStream.of(1, 2, 3, 4, 5);

    // double
    DoubleStream doubleStream=DoubleStream.of(3.14159,2.718,1.618);

    // String
    Stream<String> stringStream=Stream.of("hello","world");

    // 对象
    Stream<User> userStream=Stream.of(new User("yang"),new User("quan"));

}
```

#### Stream.generate

> 传入一个`Supplier`函数来告诉它怎么去生成stream中的元素

```java
// CreateStreamTest.java

void streamGenerateTest(){

    Supplier<String> supplier= () -> LocalDateTime.now().toString();

    // 将supplier传给generate方法
    Stream<String> stream = Stream.generate(supplier);
    stream.limit(5).forEach(System.out::println);
}
```

#### 使用Stream.iterate

> iterate方法提供两种重载形式，起作用类似while或者for循环

```java
// CreateStreamTest.java

void streamIterateTest() {

    // 如下的逻辑相当于 for(int i = 1; ; i++)
    Stream<Integer> stream1 = Stream.iterate(1, i -> i + 1);
    stream1.limit(10).forEach(System.out::println);

    // 如下的逻辑相当于 for(int i = 1; i < 10; i +=2 )
    Stream<Integer> stream2 = Stream.iterate(1, i -> i < 10, i -> i + 2);
    stream2.forEach(System.out::println);
}
```

#### 将集合转化为流

> Java8对集合接口类新增了许多`default`方法，可以方便的将集合转为stream，图中实心的接口表示加入了新的stream方法

![collection.png](/post/java-stream/collection.png)

示例代码：

```java
// CreateStreamTest.java

void collectionToStreamTest(){
    // List 转 Stream
    List<User> list = List.of(new User("yang"),new User("quan"));
    Stream<User> listStream = list.stream();
    
    // Set 转 Stream
    Set<String> set = Set.of("hello","world");
    Stream<String> setStream = set.stream();
    
    // Map 转 Stream
    Map<String, Double> map = Map.of("pi",3.14159,"e",2.718);
    Stream<Map.Entry<String, Double>> mapStream = map.entrySet().stream();
}
```

### 中间操作

> 「中间操作」总是会惰性执行，调用「中间操作」只会生成一个标记了该操作的新的stream，仅此而已

#### map

**解释说明**：用于将流中的元素映射成新的元素

**参数类型**：Function函数

![map.png](/post/java-stream/map.png)

#### filter

**解释说明**：用于过滤流中的元素

**参数类型**：Predicate函数

![filter.png](/post/java-stream/filter.png)

#### sort

**解释说明**：对流中的元素进行排序

**参数类型**：Comparator函数

![sort.png](/post/java-stream/sort.png)

#### 其他

| 方法                         | 作用                     |
|----------------------------|------------------------|
| peek(Comparator action)    | 查看流中的元素，帮助调试           |
| limit(long maxSize)        | 限制流中元素数量不超过maxSize个    |
| skip(long n)               | 跳过前n个元素                |
| concat(Stream a, Stream b) | 将a,b两个流合并为一个新的流        |
| distinct()                 | 将流中元素进行去重，基于equals方法判断 |
| parallel()                 | 启用并行流                  |

### 结束操作

> 结束操作会触发实际的计算，计算发生时会把所有「中间操作」以pipline的方式执行，这样就可以减少迭代次数
>
> 计算完成后流就会失效

#### forEach

**解释说明**：遍历流中的所有元素

**参数类型**：Consumer函数

**冷知识**: 你知道java的for循环有几种写法吗？其实不同的写法会有不一样的性能哦

如下的代码，我们分别测试了`for`，`forIn`，`forEach`三种写法的循环遍历，你会发现`forTest`
方法耗时明显比其他两个方法多，原因就是因为我们这里使用多态的思想将`List`引用到了其子类`LinkedList`，众所周知`LinkedList`
底层数据结构是链表，这就导致`list.get(i)`操作时间复杂度上升为`O(n)`

_因此平时在迭代集合的时候，最好使用`forIn`或者`forEach`，因为他们底层都是使用集合的迭代器`Iterator`进行遍历的，这样才是最优的方式_

```java
// ForLoopTest.java

public class ForLoopTest {

    private static List<String> list;
    private static final int size = 30000;

    @BeforeAll
    static void setList() {

        list = new LinkedList<>();

        for (int i = 0; i < size; i++) {
            list.add("str" + i);
        }
    }

    @Test
    void forTest() {
        for (int i = 0; i < list.size(); i++) {
            String str = list.get(i);
            System.out.println(str);
        }
    }

    @Test
    void forInTest() {
        for (String str : list) {
            System.out.println(str);
        }
    }

    @Test
    void forEachTest() {
        list.forEach(System.out::println);
    }
}
```

#### reduce

> 对流中的元素进行规约操作，最终合成为一个值

reduce有三种重载形式，本次主要介绍第三种，学会后前两种也就自然理解了

1. `Optional<T> reduce(BinaryOperator<T> accumulator)`
2. `T reduce(T identity, BinaryOperator<T> accumulator)`
3. `<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner)`

方法3等价于如下代码：

```java
// 初始值为 identity 对流种的元素进行累计操作
U result = identity;

// 使用 accumulator 函数
for (T element : this stream)
    result = accumulator.apply(result, element)

// 并行流会将任务拆分，combiner函数用来合并多个子任务结果，需要满足如下的条件，即使用combiner和不使用combiner最终的计算结果一致：
combiner.apply(u, accumulator.apply(identity, t)) == accumulator.apply(u, t)

return result;
```

示例代码：

```java
// OperatorTest.java

void reduceTest3() {
    // 求流中单词长度之和
    Integer value = strStream.reduce(0, // 初始值
            (result, element) -> result + element.length(), // 累加器
            (integer, integer2) -> integer + integer2); // 如果在并行流的情况下，多个部分如何进行合并
    System.out.println(value);
}
```

#### collect

> 用于收集流中元素
> 
> 不夸张的讲，如果你发现某个功能在Stream接口中没找到，十有八九可以通过`Stream.collect()`方法实现

> 本次主要分享如何使用Collectors收集器进行元素收集

常用方法：

| 方法                                             | 作用           |
|------------------------------------------------|--------------|
| toList()                                       | 收集为ArrayList |
| toSet()                                        | 收集为HashSet   |
| toMap(Function keyMapper,Function valueMapper) | 收集为HashMap   |
| joining()                                      | 收集为字符串       |
| groupingBy(Function classifier)                | 分组为map       |
| counting()                                     | 统计元素数量       |
| minBy(Comparator comparator)                   | 获取最小元素       |
| maxBy(Comparator comparator)                   | 获取最大元素       |

示例代码：
```java
// CollectTest.java

// 收集所有用户名，结果为ArrayList
List<String> list = users.stream()
        .map(User::getName)
        .collect(Collectors.toList());

// 收集所有用户名，结果为TreeSet
Set<String> set = users.stream()
        .map(User::getName)
        .collect(Collectors.toCollection(TreeSet::new));

// 将用户名收集为String
String name = users.stream()
        .map(User::getName)
        .collect(Collectors.joining(", "));

// 计算所有user的年龄之和
int total = users.stream()
        .collect(Collectors.summingInt(User::getAge));

// 根据用户名分组
Map<String, List<User>> map = users.stream()
        .collect(Collectors.groupingBy(User::getName));

// 根据用户名统计年龄之和
Map<String, Integer> map = users.stream()
        .collect(Collectors.groupingBy(User::getName, Collectors.summingInt(User::getAge)));

// 根据年龄阈值分组用户
Map<Boolean, List<User>> map = users.stream()
        .collect(Collectors.partitioningBy(u -> u.getAge() >= 30));
```

### 调试流

> 由于流只能使用一次，因此必须在流结束前才能对其进行调试

具体步骤：
1. 在代码中加上断点
   ![debug.png](/post/java-stream/debug.png)
2. 在调试栏找到「Trace Current Stream Chain」
   ![trace.png](/post/java-stream/trace.png)
3. 查看流的追踪链
   ![stream_trace.png](/post/java-stream/stream_trace.png)

## 参考资料

- 《On Java 8》中文版
- 《Effective Java 中文版》（第3版）