---
title: 你真的了解消息队列吗
date: 2022-11-11
excerpt: "一篇文章带你探寻消息队列的几个基础功能的原理"
tags:

- mq
- 消息队列
- kafka
- time wheel

---

# 你真的了解消息队列吗

![intro.png](/post/message-queue/intro.png)

## 介绍

消息队列（Message Queue），是分布式系统中重要的组件，能够帮助业务系统解构提升开发效率和系统稳定性。

消息队列主要具有以下优势： **异步**，**解耦**，**削峰填谷**（蓄洪）。

与此同时消息队列也可能带来如下的问题： **数据丢失**，**数据重复**，**运维成本增加**

## 术语

### 基础

| **中文** | **英文**            | **释义**                                          |
|--------|-------------------|-------------------------------------------------|
| 消息     | Message           | 消息系统中信息传递的载体                                    |
| 消息主题   | Topic             | 消息主题，一级消息类型，通过 Topic 对消息进行分类                    |
| 消息标签   | Tag               | 基于Topic下更细维度的区分                                 |
| 分区     | Queue / Partition | 每个 Topic 下会由一到多个队列来存储消息                         |
| 消息生产者  | Producer          | 负责生产并发送消息                                       |
| 消息消费者  | Consumer          | 负责消息的消费                                         |
| 消费者分组  | ConsumerGroup     | 由一类Consumer组成，共同消费同一个Topic的消息                   |
| 订阅关系   | Subscription      | 订阅关系，表示Consumer和Topic的映射关系，是消息中心投递消息给下游消费方的唯一依据 |

### 消息类型

| 中文   | 英文                    | 释义                                                                                  |
|------|-----------------------|-------------------------------------------------------------------------------------|
| 定时消息 | Timer message         | Producer 将消息发送到消息队列服务端，但并不期望这条消息立马投递，而是推迟到在当前时间点之后的某一个时间投递到 Consumer 进行消费，该消息即定时消息。 |
| 延时消息 | Delayed message       | Producer 将消息发送到消息队列服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到 Consumer 进行消费，该消息即延时消息。          |
| 事务消息 | Transactional message | 消息队列提供类似 X/Open XA 的分布事务功能，通过消息队列的事务消息能达到分布式事务的最终一致。                                |
| 顺序消息 | Ordered message       | 消息队列提供的一种按照顺序进行发布和消费的消息类型，分为全局顺序消息和分区顺序消息，当前仅支持分区顺序消息。                              |

### 其他

| 中文     | 英文                       | 释义                                                                                                        |
|--------|--------------------------|-----------------------------------------------------------------------------------------------------------|
| 消息堆积   | Message accumulation     | Producer 已经将消息发送到消息队列的服务端，但由于 Consumer 消费能力有限，未能在短时间内将所有消息正确消费掉，此时在消息队列的服务端保存着未被消费的消息，该状态即消息堆积 。          |
| 消息轨迹   | Message trace            | 在一条消息从 Producer 发出到 Consumer 消费处理过程中，由各个相关节点的时间、地点等数据汇聚而成的完整链路信息。                                         |
| 重置消费位点 | Reset consumption offset | 以时间轴为坐标，在消息持久化存储的时间范围内，重新设置 Consumer 对已订阅的 Topic 的消费进度，设置完成后 Consumer 将接收设定时间点之后由 Producer 发送到消息队列服务端的消息。 |

## 消费模式

![pull&push.png](/post/message-queue/pull&push.png)

### 拉模式（pull）

**解释**：当 Producer 发出的消息到达后，服务端马上将这条消息投递给 Consumer

**使用场景**
1. **Producer 速率大于 Consumer 速率**：如果采用推模式，则消费者的压力会逐渐扩大，而如果使用拉模式，消费是需要根据自己的消费速率去拉取即可
2. **消息实时性要求较高**：采用推模式，消息一到broker就会立刻发送给 Consumer，而拉模式则需要消费者主动去轮训，需要自己控制时间间隔
### 推模式（push）

**解释**：当服务端收到这条消息后什么也不做，只是等着 Consumer 主动到自己这里来读，即 Consumer 这里有一个"拉取"的动作

**使用场景**

1. **消费速率可控**：采用拉模式，消费者可以根据自己的消费速率，动态的调整拉取的频率，一般很难出现消息的积压
2. **部分或全部 Consumer 不在线**：如果采用推模式，因为无法预知 Consumer 的宕机或下线是短暂的还是持久的，如果一直为该 Consumer
   保留自宕机开始的所有历史消息，那么即便其他所有的 Consumer 都已经消费完成，数据也无法清理掉，随着时间的积累，队列的长度会越来越大，此时无论消息是暂存于内存还是持久化到磁盘上（采用
   Push 模型的系统，一般都是将消息队列维护于内存中，以保证推送的性能和实时性），都将对 CMQ 服务端造成巨大压力，甚至可能影响到其他
   Consumer 的正常消费，尤其当消息的生产速率非常快时更是如此；但是如果不保留数据，那么等该 Consumer 再次起来时，则要面对丢失数据的问题。
   折中的方案是：CMQ 给数据设定一个超时时间，当 Consumer 宕机时间超过这个阈值时，则清理数据；但这个时间阈值也并不太容易确定。
   采用拉模式，情况会有所改善；服务端不再关心 Consumer 的状态，而是采取“你来了我才服务”的方式，Consumer 是否能够及时消费数据，服务端不会做任何保证（也有超时清理时间）。


## 消息队列选型速览

| **功能特性** | **RocketMQ** | **MsgBroker（蚂蚁内部）** | **Kafka** | **RabbitMQ** |
|----------|--------------|---------------------|-----------|--------------|
| 事务消息     | ✅            | ✅                   | ✅         | ✅            |
| 延迟消息     | ✅            | ✅                   | ✅         | 🚫           |
| 优先级消息    | 🚫           | 🚫                  | 🚫        | ✅            |
| 顺序消息     | ✅            | 🚫                  | ✅         | ✅            |
| 消息轨迹     | ✅            | ✅                   | 🚫        | ✅            |
| 消息过滤     | ✅            | ✅                   | 🚫        | 🚫           |
| 消费模式     | 拉            | 推                   | 拉         | 推、拉          |
| 积压能力     | 强（亿级）        | 弱（百万级）              | 强         | 弱            |
| 存储模式     | 磁盘           | DB                  | 磁盘        | 磁盘           |
| 可靠性      | 中            | 高                   | 中         | 中            |

## 投递&消费语义

### 投递语义

**最多一次**：Producer不等待Broker确认，只管发出即可；最可能丢失消息。如果丢了消息，就是投递0次。如果没丢，就是投递1次。

**最少一次**：Producer发送给Broker并等待返回ACK确认消息，如果未收到ack，则会重新发送，这样就会出现大于1次的投递情况。

**恰好一次**：Producer每条消息有唯一的编号，Broker也会检查Producer的编号，如果编号已存在则会丢弃，可以实现恰好投递1次。

### 消费语义

**最多一次**：

**最少一次**：

**恰好一次**：


| 消费语义   | 消息     | 生产者              | 消息队列           | 消费者                                   | 特点        | 例子      |
|--------|--------|------------------|----------------|---------------------------------------|-----------|---------|
| 最多消费一次 | 无需唯一编码 | 最多投递一次           | 分发->不等ACK      | 消费->无需ACK                             | 可靠性低，吞吐最高 | 非核心日志采集 |
| 至少消费一次 | 无需唯一编码 | 至少投递一次 or 恰好投递一次 | 分发->等ACK->失败重发 | 消费->ACK                               | 可靠性高      | 事件全量    |
| 恰好消费一次 | 唯一编码   | 至少投递一次 or 恰好投递一次 | 分发->等ACK->失败重发 | 【幂等检查消息唯一性 1.非重复消息-持久化-ACK 2.重复消息-ACK | 可靠性高      |         |

## 功能特性

### 事务消息

使用场景
用户发起订单，支付100块钱操作完成后，能得到100积分，账户服务和会员服务是两个独立的微服务模块，有各自的数据库，按照上文提及的问题可能性，将会出现这些情况：

- 如果先扣款，再发消息，可能钱刚扣完，消息没发失败了，结果积分没增加。
- 如果先发消息，再扣款，可能积分增加了，但钱没扣掉，白送了100积分
- 钱正常扣了，消息也发送成功了，但会员服务实例消费消息出现问题，结果积分没增加

**事务消息就是保证本地事务操作和mq消息的发送是一致的，即本地事务成功，消息一定发送出去，本地事务失败，消息一定未被消费**

###### 整体流程

![shiwu.png](/post/message-queue/shiwu.png)

###### 异常情况

1. Producer发送半消息失败
   可能由于网络或者mq故障，导致 Producer 发送半消息(prepare)失败，这时候发送方直接回滚本地事务就可以了
2. 半消息发送成功，本地事务执行失败
   发送方执行rollback给MQ，MQ会删除之前发送的半消息，消费端也就收不到这条消息
3. 半消息发送成功，没收到MQ返回的响应
   Check 被回调时，业务逻辑都需要做些什么？事务消息的 Check 方法里面，应该写一些检查事务一致性的逻辑。消息队列发送事务消息时需要实现
   LocalTransactionChecker 接口，用来处理 Broker 主动发起的本地事务状态回查请求；因此在事务消息的 Check 方法中，需要完成两件事情：
    1. 检查该半事务消息对应的本地事务的状态（committed or rollback）。
    2. 向 Broker 提交该半事务消息本地事务的状态。

**思考**： RocketMQ是怎么保证半消息(prepare)不被消费者消费呢？
::: details 答案

1. broker 端收到消息后，根据 TRAN_MSG 值判断是事务消息。则将消息转存到 topic: `RMQ_SYS_TRANS_HALF_TOPIC`，`queueId: 0`
2. 如果本地事务状态是`commit`，broker恢复原 `topic`，`queueId`, consumer 可以正常消费事务消息
3. 如果本地事务状态是`rollback`，把消息放入`RMQ_SYS_TRANS_OP_HALF_TOPIC` 并通过设置`tags = d`标识该消息已被删除
   :::

### 延迟消息

使用场景：用户下单未付款，30分钟后需要关闭订单

常见做法：使用redis的zset集合，将延迟任务按照过期时间排序，然后通过定时器去不断的轮训
优点：简单方便
缺点：占用的存储空间较大，定时轮询会造成不必要的请求

问：直接用DelayQueue怎么样？
答：DelayQueue是JDK提供的延迟队列，对于有延迟需求的场景，直接用DelayQueue是可以的，但是不支持对延迟任务进行修改或删除操作，同时如果任务过多，会造成DelayQueue空间占用过大

#### 时间轮

1.

Kafka中一个时间轮TimingWheel默认是由20个时间格组成，每格的时间跨度是1ms，时间轮底层采用数组实现，数组中的每个元素可以存放一个定时任务列表（TimerTaskList）。TimerTaskList是一个环形的双向链表，链表中的每一项表示的都是定时任务项（TimerTaskEntry），其中封装了真正的定时任务TimerTask

![shijianlun1.png](/post/message-queue/shijianlun1.png)

2. 假设初始的时候一个格子一秒，时间轮的指针定格在0。此时添加一个超时时间为2ms的任务, 那么这个任务将会插入到第二个时间格中
   ![shijianlun2.gif](/post/message-queue/shijianlun2.gif)
4. 时间轮的指针到达第二个时间格时, 会处理该时间格上对应的任务
   ![shijianlun3.gif](/post/message-queue/shijianlun3.gif)
5. 如果这个时候又插入一个延时时间为8ms的任务进来, 这个任务的过期时间就是在当前时间2ms的基础上加8ms, 也就是10ms, 那么这个任务将会插入到过期时间为10ms的时间格中。
   ![shijianlun4.gif](/post/message-queue/shijianlun4.gif)
6. 如果在当前时间是2ms的时候, 插入一个延时时间为19ms的任务时, 这个任务的过期时间就是在当前时间2s的基础上加19ms,
   也就是21ms，那么这个任务就会插入到过期时间为21ms的时间格中
   ![shijianlun5.gif](/post/message-queue/shijianlun5.gif)
6. 如果在当前时间是2ms的时候, 插入一个延时时间为22ms的任务, 这个任务的过期时间就是在2ms的基础上加22ms，也就是24ms，但是显然没有24ms的格子
   ![shijianlun6.png](/post/message-queue/shijianlun6.png)
8. 第一层的时间轮装不下的时候，任务就会放入第二层的时间轮格子中
   ![shijianlun7.gif](/post/message-queue/shijianlun7.gif)
9. 当第二层时间轮上的任务到期后，就会执行时间轮的降级，原本超时时间为24ms的任务会被从第二层取出来，放入第一层到期时间为24ms的格子中
   ![shijianlun8.gif](/post/message-queue/shijianlun8.gif)
10. 从这里可以看出时间轮的巧妙之处，两层时间轮只用了40个数组元素，却可以承载[0-399s]的定时任务。而三层时间轮用60个数组元素，就可以承载[0-7999s]
    的定时任务
    ![shijianlun9.png](/post/message-queue/shijianlun9.png)
11. 插入一个延时时间400ms的任务, 指针就要执行399次"空推进"吗？
    Kafka通过一个`DelayQueue`保存了所有的`TimerTaskList`对象，然后通过一个叫做`ExpiredOperationReaper`的线程从 `DelayQueue`
    中获取超时的任务列表 `TimerTaskList`，然后根据`TimerTaskList` 的过期时间来精确推进时间轮的时间，这样就不会存在空推进的问题，

**总结**

- Kafka 使用时间轮来实现延时队列，因为其底层是任务的添加和删除是基于链表实现的，是 O(1) 的时间复杂度，满足高性能的要求
- DelayQueue 只存放了 TimerTaskList，并不是所有的 TimerTask，数量并不多，相比空推进带来的影响是利大于弊的
- 对于时间跨度大的延时任务，Kafka 引入了层级时间轮，能更好控制时间粒度，可以应对更加复杂的定时任务处理场景

###### rocketmq内部版

rocketmq在kafka的时间轮基础上提供了延迟消息可靠的存储方式

1. 时间轮的每一格设计如下

   | delay_time(8B) 延迟时间 | first_pos 首条位置 | last_pos(8B) 最后位置 | num(4B) 消息条数 |
   |---------------------|----------------|-------------------|--------------|

2. TimerLog，定时消息的记录文件，Append Only。每条记录包含一个prev_pos，指向前一条定时到同样时刻的记录
3. TimerLog与TimerWheel的协作如下图所示
   ![r_shijianlun1.png](/post/message-queue/r_shijianlun1.png)
4. 消息的存储工作流程如下：
   ![r_shijianlun1.png](/post/message-queue/r_shijianlun1.png)
    1. 针对放置定时消息的service，每50ms从commitLog读取指定topic的定时消息
        1. TimerEnqueueGetService从commitLog读取得到定时主题的消息，并先将其放入enqueuePutQueue
        2. 另一个线程TimerEnqueuePutService将其放入timerLog,更新时间轮的存储内容。将该任务放进时间轮的指定位置
    2. 针对取出定时消息的service，每50ms读取下一秒的slot。有三个线程将读取到的消息重新放回commitLog
        1. 首先，TimerDequeueGetService每50ms读一次下一秒的slot，从timerLog中得到指定的msgs，并放进dequeueGetQueue
        2. 而后TimerDequeueGetMessageService从dequeueGetQueue中取出msg，并将其放入队列中。该队列为待写入commitLog的队列，dequeuePutQueue
        3. 最后TimerDequeuePutMessageService将这个queue中的消息取出，若已到期则修改topic，放回commitlog，否则继续按原topic写回CommitLog滚动

缺点

- 只能精确到秒级
- 顺序的写会带来随机的读，导致读取性能较低

###### rocketmq社区版

RocketMQ社区版支持延迟消息，但是不支持任意时间精度的延迟消息，只支持特定级别的延迟消息
消息延迟级别分别为**1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h**，共18个级别。在发送消息时，设置消息延迟级别即可，设置消息延迟级别时有以下3种情况：

1. 设置消息延迟级别等于0时，则该消息为非延迟消息。
2. 设置消息延迟级别大于等于1并且小于等于18时，消息延迟特定时间，如：设置消息延迟级别等于1，则延迟1s；设置消息延迟级别等于2，则延迟5s，以此类推。
3. 设置消息延迟级别大于18时，则该消息延迟级别为18，如：设置消息延迟级别等于20，则延迟2h。

**原理**
RocketMQ发送延时消息时先把消息按照延迟时间段发送到指定的队列中，然后通过一个定时器进行轮训这些队列，查看消息是否到期，如果到期就把这个消息发送到指定topic的队列中，这样的好处是同一队列中的消息延时时间是一致的，还有一个好处是这个队列中的消息时按照消息到期时间进行递增排序的，说的简单直白就是队列中消息越靠前的到期时间越早。

### 顺序消息

###### kafka

kafka可以通过key，将某类消息写入同一个partition，一个partition只能对应一个消费者，以保证数据有序。
问：生产者先后两条消息发送时，前一条消息发送失败，后一条消息发送成功，然后失败的消息重试后发送成功，会不会造成消息乱序？
答：为了解决重试机制引起的消息乱序，Kafka引入了Producer ID（即PID）和 Sequence Number

- 在 producer 端，每个 producer 都被 broker 自动分配了一个 PID， producer 向 broker 发送的每条消息，在内部都附带着该 PID 和一个递增的 Sequence
  Number
- 在 broker 端，broker 为每个 topic 的每个 partition 都维护了一个当前写成功的消息的最大 `<PID, Sequence Number>`元组

如果消息序号比Broker维护的序号差值大于1，说明中间有数据尚未写入，即乱序，此时Broker拒绝该消息，如果消息序号小于等于Broker维护的序号，说明该消息已被保存，即为重复消息，Broker直接丢弃该消息，发送失败后会重试，这样可以保证每个消息都被发送到broker

问：只有一个partation会导致消费者的吞吐量变低，如果消费者启用多线程消费，则消息重新变得无序，如何解决？
答：消费者端创建多个内存队列，具有相同 key 的数据都路由到同一个内存 队列；然后每个线程分别消费一个内存队列即可，这样就能保证顺序性。如下图：

![shunxu.png](/post/message-queue/shunxu.png)
### 消息轨迹

一条消息的生命周期包含多个阶段：发送端发送，服务端收到消息、写入消息、投递消息等。而用户在使用MQ时，有时会想知道消息的发送、投递、消费情况，以及消费耗时、消费节点、是否重投等信息。这些信息都属于消息轨迹。
在没有可视化的消息轨迹界面时，轨迹信息都是通过原始的翻日志的方式来查询。需要根据机器节点的日志信息找到链路，一步一步溯源查找。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667220447378-24e397ad-a285-40dd-9047-88803459af4a.png#clientId=ud471318f-e47b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1455&id=u7ee5a91b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1455&originWidth=2971&originalType=binary&ratio=1&rotation=0&showTitle=false&size=149879&status=done&style=none&taskId=u3841ca9f-2858-4740-8fd8-585f899378c&title=&width=2971)
既然把消息轨迹当成消息存储在Broker服务器，那存储消息轨迹的Topic如何确定呢？RocketMQ提供了两种方法来定义消息轨迹的Topic。

- 系统默认Topic

如果Broker的traceTopicEnable配置设置为true，表示在该Broker上创建topic名为：
RMQ_SYS_TRACE_TOPIC，队列个数为1，默认该值为false，表示该Broker不承载系统自定义用于存储消息轨迹的topic。

- 自定义Topic

在创建消息生产者或消息消费者时，可以通过参数自定义用于记录消息轨迹的Topic名称，不过要注意的是，rokcetmq控制台(rocketmq-console)
中只支持配置一个消息轨迹Topic，故自定义Topic，在目前这个阶段或许还不是一个最佳实践，建议使用系统默认的Topic即可。
通常为了避免消息轨迹的数据与正常的业务数据混合在一起，官方建议，在Broker集群中，新增加一台机器，只在这台机器上开启消息轨迹跟踪，这样该集群内的消息轨迹数据只会发送到这一台Broker服务器上，并不会增加集群内原先业务Broker的负载压力。

## 稳定性&性能

#### 高可用

##### ACK机制

![](https://intranetproxy.alipay.com/skylark/lark/__puml/e43f0a1abf02d76ab7097deea0187b2d.svg#lake_card_v2=eyJ0eXBlIjoicHVtbCIsImNvZGUiOiJzZW5kZXIgLT4gYnJva2VyXG5icm9rZXIgLT4gZGIgOiBzYXZlIG1zZ1xuYnJva2VyIC0tPiBzZW5kZXIgOiBhY2svbmFja1xuYnJva2VyIC0-IHJlY2VpdmVyXG5yZWNlaXZlciAtLT4gYnJva2VyIDogYWNrL25hY2tcbmJyb2tlciAtPiBkYiA6IGRlbGV0ZSBtc2ciLCJ1cmwiOiJodHRwczovL2ludHJhbmV0cHJveHkuYWxpcGF5LmNvbS9za3lsYXJrL2xhcmsvX19wdW1sL2U0M2YwYTFhYmYwMmQ3NmFiNzA5N2RlZWEwMTg3YjJkLnN2ZyIsImlkIjoiYm1QU0IiLCJtYXJnaW4iOnsidG9wIjp0cnVlLCJib3R0b20iOnRydWV9LCJjYXJkIjoiZGlhZ3JhbSJ9)#####
数据备份和故障转移
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666871933931-97904c34-ab95-4778-9266-8a724d652213.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=242&id=ue475ed04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=483&originWidth=1037&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59699&status=done&style=none&taskId=u85dd854e-7f54-4fe9-8d6c-addca350b18&title=&width=518.5)

##### 消费一致性

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666873658825-a41e31e0-f7dd-44e7-910c-f1a497841dd2.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=153&id=ubf45f24c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=306&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=155906&status=done&style=none&taskId=ud3f002cb-af85-4049-9add-af69a19790c&title=&width=540)
LogEndOffset：每个partition的log最后一条Message的位置。
HighWatermark：取最小LEO，consumer能够看到的此partition的位置。

#### 高性能

##### 零拷贝

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874105184-a225b43d-bbc7-4cea-8f4f-cb05291be5c7.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=432&id=ucafb9bc6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=863&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=189782&status=done&style=none&taskId=uac12c40c-6569-448a-8259-d74addcb9f2&title=&width=750)
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874115020-9996005b-36a2-4f0a-8051-824c5dd11908.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=427&id=u415102c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=853&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=183715&status=done&style=none&taskId=u05425056-2410-46d7-81fa-5cea881538c&title=&width=750)

##### 磁盘顺序读写

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874264460-8cbf0497-6148-4bea-bf87-49a800ef3d51.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=264&id=u655e9fe8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=528&originWidth=646&originalType=binary&ratio=1&rotation=0&showTitle=false&size=113276&status=done&style=none&taskId=u89e9f7da-7792-4ca4-b578-3412e933ab6&title=&width=323)

#### msgbroker

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1666927224363-d5f358d6-4c94-4714-999a-d247de701a1b.png#clientId=ue9277cdc-a3a4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=357&id=u919d22b6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=357&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74259&status=done&style=none&taskId=u7baec6c9-8d01-4648-8a19-0f428f8915e&title=&width=750)
在2.0的模型中将normal message table拆分为了多个表，并且在逻辑上组成了一个环，按照时间进行写入表的切换，并且定期批量的进行过期表中的数据删除。消息投递之后只会记录
checkpoint，标记哪些消息已经可以删除了，而不会真正执行 normal message table 中的数据删除，从而避免了频繁的插入和删除操作。可以简单的理解为2.0的模型写入就是不断的
Append 消息（checkpoint 可以理解为 offset），投递就是不断的推进checkpoint，删除是批量的对过期的表（不再进行读写）进行删除。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1666755832767-cae32c00-2718-4c29-b71e-1ef860b3eb73.png#clientId=u33216851-4002-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=606&id=u16911af2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=757&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=314793&status=done&style=none&taskId=u5872799b-7230-4dd4-b8c1-db8cc3cd08e&title=&width=1200)
MsgBroker 2.0的计算模型设计中采用了全异步的模型，对各个开销较高的操作都做了异步化，比如msg-write-threads（消息写入线程池）仅负责消息写入时的业务逻辑，并不处理持久化操作。持久化操作是耗时的，由msg-flush-threads批量进行持久化，这样能使
msg-write-threads 更快的去处理更多的写入请求。基于这样的设计，能对各个阶段不同的线程池做精细化的配置，提升资源利用率和整体的性能。

#### rocketmq

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667303564561-2f07e1f6-7659-42fd-af1c-e6158b2b660d.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u0afcf2aa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=540&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=151090&status=done&style=none&taskId=u69fe3af1-8ba5-496f-b9cd-2e6f00ec9b2&title=&width=750)

##### 1. 逻辑分区

为了提升整体的吞吐量与提供跨副本组的高可用能力，RocketMQ 服务端一般会为单个 Topic 创建多个逻辑分区，即在多个副本组上各自维护部分分区 (
Partition)，我们把它称为队列 (MessageQueue)。同一个副本组上同一个 Topic 的队列数相同并从 0 开始连续编号，不同副本组上的 MessageQueue 数量可以不同。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667211128802-1ebe1226-c430-4b6b-a95b-64ae84602146.png#clientId=u732f2838-f0ad-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=610&id=u13a63bf6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=610&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=217091&status=done&style=none&taskId=u1a163547-d3c6-45a3-bacb-68c9b9605a3&title=&width=750)
每个Topic在Broker上会划分成几个逻辑队列，每个逻辑队列保存一部分消息数据。从上面模型可以看出，要解决消费并发，就是要利用Queue,一个Topic可以分出更多的queue,每一个queue可以存放在不同的硬件上来提高并发。

##### 2. 持久化

在RocketMQ中消息刷盘主要可以分为同步刷盘和异步刷盘两种。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667301973880-fbab5567-a642-42b6-8ead-7fa8e666e23d.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u5e5e4647&margin=%5Bobject%20Object%5D&name=image.png&originHeight=908&originWidth=583&originalType=binary&ratio=1&rotation=0&showTitle=false&size=48292&status=done&style=none&taskId=u1e3a47a0-19e3-4baa-b8f2-559591abd3e&title=&width=347)
消息写入内存的PAGECACHE后，立刻通知刷盘线程刷盘，然后等待刷盘完成，刷盘线程执行完成后唤醒等待的线程，返回消息写成功的状态。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667302024113-a2ca21dc-b78c-4e84-a005-2a84c19c0f75.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=592&id=ud39bf6fa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=906&originWidth=542&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49898&status=done&style=none&taskId=uc5830126-bfa6-4900-9880-40955d7f100&title=&width=354)
在返回写成功状态时，消息可能只是被写入了内存的PAGECACHE，写操作的返回快，吞吐量大；当内存里的消息量积累到一定程度时，统一触发写磁盘操作，快速写入。

##### 3. 消息发送

三种发送方式：同步/异步/单向

消息发送的返回状态有如下四种 : FLUSH_DISK_TIMEOUT 、 FLUSH_SLAVE_TIMEOUT 、SLAVE_NOT_AVAILABLE
、SEND_OK，不同状态在不同的刷盘策略和同步策略的配置下含义是不同的 。
**FLUSH_DISK_TIMEOUT** : 表示没有在规定时间内完成刷盘(需要 Broker 的刷盘策被设置成 SYNC_FLUSH 才会报这个错误) 。
**FLUSH_SLAVE_TIMEOUT** :表示在主备方式下，并且 Broker被设 置 成 SYNC_MASTER 方式，没有在设定时间内完成 主从同步 。
**SLAVE_NOT_AVAILABLE** : 这个状态 产生的场景和 FLUSH_SLAVE_TIMEOUT 类似， 表示在主备 方式下，并且 Broker被设置成 SYNC_MASTER，但是没有找到被配置成
Slave 的 Broker。
**SEND_ OK** :表示发送成功，发送成功的具体含义，比如消息是否已经 被存储到融盘?消息是否被同步到了 Slave上?消息在 Slave上是否被
写人磁盘?需要结合所配置的刷盘策略、主从策略来定 。 这个状态还可 以简单理解为，没有发生上面列出的 三个问题状态就是 SEND OK。

##### 4. 批量生产/消费

批量消息是指将多条小的消息合并成一个批量消息，一次发送出去。这样的好处是可以减少网络IO，提升吞吐量。
比如说原本我有三条消息,如果三条消息分三次发的话,会走三次网络IO,如果我给三条消息整成一起发送,这样就走一次网络了。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667304196521-865cb3ee-ab0d-4c62-90e5-7b6cf5bff2f4.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=846&id=uec728440&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1402&originalType=binary&ratio=1&rotation=0&showTitle=false&size=220474&status=done&style=none&taskId=u2ccac6c3-73d4-409a-9418-120c3c6ec4c&title=&width=1402)

## 总结

目前团队使用消息队列的典型例子：

|                                 | SOFAMQ特性 | Msgbroker特性        |
|---------------------------------|----------|--------------------|
| infosec->infosectask事件消息        | 堆积       |                    |
| infosectask->itask流审消息          | 失败重试、堆积  |                    |
| infosectask->infostudio能力异步结果轮询 | 延迟消息     |                    |
| infosec高保场景接入                   |          | 事务消息、存储高可靠         |
| infosec事件异步结果                   |          | 异步、解耦、存储高可靠、推模式实时强 |

## 参考文档

- 消息队列的消费语义和投递语义：[https://juejin.cn/post/6844903872029278215](https://juejin.cn/post/6844903872029278215)
- Msgbroker：[https://yuque.antfin.com/middleware/msgbroker/pubsub](https://yuque.antfin.com/middleware/msgbroker/pubsub)
- SOFAMQ：[https://yuque.antfin.com/middleware/sofamq/common_msg](https://yuque.antfin.com/middleware/sofamq/common_msg)
- 消息幂等：[https://help.aliyun.com/document_detail/177412.html](https://help.aliyun.com/document_detail/177412.html)
- kafka时间轮：[https://mp.weixin.qq.com/s/l5Kpg45-4MkOq_xfUczPPA](https://mp.weixin.qq.com/s/l5Kpg45-4MkOq_xfUczPPA)
- msgbroker
  消息轨迹：[https://developer.alipay.com/post/496000358?inviterWorkNo=322773](https://developer.alipay.com/post/496000358?inviterWorkNo=322773)
- rocketmq延迟消息：[https://mp.weixin.qq.com/s/iZL8M88gF7s5NmW7DYyYDQ](https://mp.weixin.qq.com/s/iZL8M88gF7s5NmW7DYyYDQ)
