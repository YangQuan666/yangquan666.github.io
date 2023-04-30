---
title: Java函数式编程入门
date: 2020-09-01
excerpt: "Java函数式编程入门"
tags:
  - java
  - lambda
  - stream
  - 函数式编程
---

# Java 函数式编程入门

> 本文是自己当时刚工作时做的一次分享，现整理并发表到个人博客中

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
  $ FunctionalTest.java
  
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
  $ FunctionalTest.java
  
  /**
   * 传入lambda表达式来代替匿名类
   */
  public void createThreadLambda() {
      new Thread(() -> System.out.println("thread running...")).start();
  }
  ```
- 方法引用
  ```java
  $ FunctionalTest.java
  
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
$ LambdaTest.java

void runnableTest() {
    Runnable runnable = () -> System.out.println("Runnable#run");
    
    runnable.run();
}
```

#### Supplier

特点：无入参，有返回

```java
$ LambdaTest.java

void supplierTest() {
    Supplier<String> supplier = () -> "Supplier#get";
    
    String str = supplier.get();
}
```

#### Consumer

特点：有入参，无返回

```java
$ LambdaTest.java

void consumerTest() {
    Consumer<String> consumer = (s) -> System.out.println("Consumer#accept: " + s);

    consumer.accept("hello");
}
```

#### Function

特点：有入参，有返回

```java
$ LambdaTest.java

void functionalTest() {
    Function<String, String> function = str -> "Function#apply: " + str;

    String res = function.apply("hello");
}
```

`java.util.function`包中有更多自带的lambda表达式，推荐各位去阅读下源码

### 自定义函数

- java规定如果一个interface类中只包含一个方法，则这个类可以作为函数类型去使用
- 手动添加`@FunctionalInterface`可以帮助编译器静态检查「可选」

比如如下的函数表示入参有三种不同类型，同时也有返回值：

```java
$ TriFunction.java

/**
 * 接收三个参数并带有返回值
 */
@FunctionalInterface
interface TriFunction<T, U, V, R> { 
    R apply(T t, U u, V v);
}
```

调用自定义的lambda函数

```java
$ CustomFunctionalTest.java

void test(){
    TriFunction<Integer, Boolean, Double, String> triFunction=(i,b,d)->String.format("i=%d, b=%b, d=%.2f", i, b, d);
    
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
   $ Callable.java
   
   @FunctionalInterface
   interface Callable { 
        void call(String s);
   }
   ```
2. 有如下的User类
   ```java
   $ User.java
   
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
$ MethodReferenceTest.java

void staticMethodReferenceTest() {
    // 静态方法引用
    Callable callable = User::play;

    // 注意这里是call而不是play
    callable.call("GTA");

}
```

##### 错误的方式

```java
$ MethodReferenceTest.java

void staticMethodReferenceErrorTest() {

    // 方法签名不一致，编译不通过
    Callable callable = User::sleep;
    callable.call("Hamburger");
}
```

#### 实例方法引用

```java
$ MethodReferenceTest.java

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
  $ MethodReferenceTest.java
  
  void noArgConstructMethodReferenceTest(){
    Supplier<User> supplier=User::new;
  User user = supplier.get();
  }
  ```

- 有参构造方法引用
  ```java
  $ MethodReferenceTest.java
  
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
$ FunctionalComposeTest.java

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

### Java集合类

> 图中实心的接口表示加入了新的stream方法

![collection.png](..%2Fpublic%2Fpost%2Fjava-stream%2Fcollection.png)

#### 代码阅读

> 阅读如下的两段代码

代码1:
```java
$ StreamTest.java

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
$ StreamTest.java

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

#### 使用Stream.of

> 你可以通过 Stream.of() 很容易地将一组元素转化成为流

```java
$ CreateStreamTest.java

void streamOfTest() {

    // int
    IntStream intStream = IntStream.of(1, 2, 3, 4, 5);
    intStream.forEach(System.out::print);

    // double
    DoubleStream doubleStream = DoubleStream.of(3.14159, 2.718, 1.618);
    doubleStream.forEach(System.out::println);

    // String
    Stream<String> stringStream = Stream.of("hello", "world");
    stringStream.forEach(System.out::println);

    // 对象
    Stream<User> userStream = Stream.of(new User("yang"), new User("quan"));
    userStream.forEach(System.out::println);

}
```

### 中间操作

### 结束操作

#### forEach

#### reduce

#### collect

### 思考

#### 流的性能如何

#### 如何调试

## 参考资料

- 《On Java 8》中文版
- 《Effective Java 中文版》（第3版）