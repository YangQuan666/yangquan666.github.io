import{_ as t,o as d,b as a,k as o}from"./app.4787d829.js";const r="/post/message-queue/intro.png",i="/post/message-queue/pull&push.png",c="/post/message-queue/shiwu.png",s="/post/message-queue/shijianlun1.png",l="/post/message-queue/shijianlun2.gif",n="/post/message-queue/shijianlun3.gif",p="/post/message-queue/shijianlun4.gif",m="/post/message-queue/shijianlun5.gif",h="/post/message-queue/shijianlun6.png",u="/post/message-queue/shijianlun7.gif",g="/post/message-queue/shijianlun8.gif",b="/post/message-queue/shijianlun9.png",e="/post/message-queue/r_shijianlun1.png",k="/post/message-queue/shunxu.png",f="/post/message-queue/guiji.png",y="/post/message-queue/guiji1.png",_="/post/message-queue/guiji2.png",D=JSON.parse('{"title":"你真的了解消息队列吗","description":"","frontmatter":{"title":"你真的了解消息队列吗","date":"2022-11-11T00:00:00.000Z","excerpt":"一篇文章带你探寻消息队列的几个基础功能的原理","tags":["mq","消息队列","kafka","time wheel"]},"headers":[{"level":2,"title":"介绍","slug":"介绍","link":"#介绍","children":[]},{"level":2,"title":"术语","slug":"术语","link":"#术语","children":[{"level":3,"title":"基础","slug":"基础","link":"#基础","children":[]},{"level":3,"title":"消息类型","slug":"消息类型","link":"#消息类型","children":[]},{"level":3,"title":"其他","slug":"其他","link":"#其他","children":[]}]},{"level":2,"title":"消费模式","slug":"消费模式","link":"#消费模式","children":[{"level":3,"title":"推模式（push）","slug":"推模式-push","link":"#推模式-push","children":[]},{"level":3,"title":"拉模式（pull）","slug":"拉模式-pull","link":"#拉模式-pull","children":[]}]},{"level":2,"title":"常见MQ比对","slug":"常见mq比对","link":"#常见mq比对","children":[]},{"level":2,"title":"投递&消费语义","slug":"投递-消费语义","link":"#投递-消费语义","children":[{"level":3,"title":"投递语义","slug":"投递语义","link":"#投递语义","children":[]},{"level":3,"title":"消费语义","slug":"消费语义","link":"#消费语义","children":[]}]},{"level":2,"title":"功能特性","slug":"功能特性","link":"#功能特性","children":[{"level":3,"title":"事务消息","slug":"事务消息","link":"#事务消息","children":[]},{"level":3,"title":"延迟消息","slug":"延迟消息","link":"#延迟消息","children":[]},{"level":3,"title":"顺序消息","slug":"顺序消息","link":"#顺序消息","children":[]},{"level":3,"title":"消息轨迹","slug":"消息轨迹","link":"#消息轨迹","children":[]}]},{"level":2,"title":"稳定性&性能","slug":"稳定性-性能","link":"#稳定性-性能","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"参考文档","slug":"参考文档","link":"#参考文档","children":[]}],"relativePath":"post/message-queue.md","lastUpdated":1675086350000}'),x={name:"post/message-queue.md"},v=o('<h1 id="你真的了解消息队列吗" tabindex="-1">你真的了解消息队列吗 <a class="header-anchor" href="#你真的了解消息队列吗" aria-hidden="true">#</a></h1><p><div><img src="'+r+'" alt="" style="max-height:400px;" loading="lazy"></div></p><h2 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-hidden="true">#</a></h2><p>消息队列（Message Queue），是分布式系统中重要的组件，能够帮助业务系统解构提升开发效率和系统稳定性。</p><p>消息队列主要具有以下优势： <strong>异步</strong>，<strong>解耦</strong>，<strong>削峰填谷</strong>（蓄洪）。</p><p>与此同时消息队列也可能带来如下的问题： <strong>数据丢失</strong>，<strong>数据重复</strong>，<strong>运维成本增加</strong></p><h2 id="术语" tabindex="-1">术语 <a class="header-anchor" href="#术语" aria-hidden="true">#</a></h2><h3 id="基础" tabindex="-1">基础 <a class="header-anchor" href="#基础" aria-hidden="true">#</a></h3><table><thead><tr><th><strong>中文</strong></th><th><strong>英文</strong></th><th><strong>释义</strong></th></tr></thead><tbody><tr><td>消息</td><td>Message</td><td>消息系统中信息传递的载体</td></tr><tr><td>消息主题</td><td>Topic</td><td>消息主题，一级消息类型，通过 Topic 对消息进行分类</td></tr><tr><td>消息标签</td><td>Tag</td><td>基于Topic下更细维度的区分</td></tr><tr><td>分区</td><td>Queue / Partition</td><td>每个 Topic 下会由一到多个队列来存储消息</td></tr><tr><td>消息生产者</td><td>Producer</td><td>负责生产并发送消息</td></tr><tr><td>消息消费者</td><td>Consumer</td><td>负责消息的消费</td></tr><tr><td>消费者分组</td><td>ConsumerGroup</td><td>由一类Consumer组成，共同消费同一个Topic的消息</td></tr><tr><td>订阅关系</td><td>Subscription</td><td>订阅关系，表示Consumer和Topic的映射关系，是消息中心投递消息给下游消费方的唯一依据</td></tr></tbody></table><h3 id="消息类型" tabindex="-1">消息类型 <a class="header-anchor" href="#消息类型" aria-hidden="true">#</a></h3><table><thead><tr><th>中文</th><th>英文</th><th>释义</th></tr></thead><tbody><tr><td>定时消息</td><td>Timer message</td><td>Producer 将消息发送到消息队列服务端，但并不期望这条消息立马投递，而是推迟到在当前时间点之后的某一个时间投递到 Consumer 进行消费，该消息即定时消息。</td></tr><tr><td>延时消息</td><td>Delayed message</td><td>Producer 将消息发送到消息队列服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到 Consumer 进行消费，该消息即延时消息。</td></tr><tr><td>事务消息</td><td>Transactional message</td><td>消息队列提供类似 X/Open XA 的分布事务功能，通过消息队列的事务消息能达到分布式事务的最终一致。</td></tr><tr><td>顺序消息</td><td>Ordered message</td><td>消息队列提供的一种按照顺序进行发布和消费的消息类型，分为全局顺序消息和分区顺序消息，当前仅支持分区顺序消息。</td></tr></tbody></table><h3 id="其他" tabindex="-1">其他 <a class="header-anchor" href="#其他" aria-hidden="true">#</a></h3><table><thead><tr><th>中文</th><th>英文</th><th>释义</th></tr></thead><tbody><tr><td>消息堆积</td><td>Message accumulation</td><td>Producer 已经将消息发送到消息队列的服务端，但由于 Consumer 消费能力有限，未能在短时间内将所有消息正确消费掉，此时在消息队列的服务端保存着未被消费的消息，该状态即消息堆积 。</td></tr><tr><td>消息轨迹</td><td>Message trace</td><td>在一条消息从 Producer 发出到 Consumer 消费处理过程中，由各个相关节点的时间、地点等数据汇聚而成的完整链路信息。</td></tr><tr><td>重置消费位点</td><td>Reset consumption offset</td><td>以时间轴为坐标，在消息持久化存储的时间范围内，重新设置 Consumer 对已订阅的 Topic 的消费进度，设置完成后 Consumer 将接收设定时间点之后由 Producer 发送到消息队列服务端的消息。</td></tr></tbody></table><h2 id="消费模式" tabindex="-1">消费模式 <a class="header-anchor" href="#消费模式" aria-hidden="true">#</a></h2><p><div><img src="'+i+'" alt="" style="max-height:400px;" loading="lazy"></div></p><h3 id="推模式-push" tabindex="-1">推模式（push） <a class="header-anchor" href="#推模式-push" aria-hidden="true">#</a></h3><p><strong>解释</strong>：当 Producer 发出的消息到达后，服务端马上将这条消息投递给 Consumer</p><p><strong>适用场景</strong></p><ol><li><strong>消息实时性要求较高</strong>：采用推模式，消息一到broker就会立刻发送给 Consumer，而拉模式则需要消费者主动去轮训，需要自己控制时间间隔</li><li><strong>实现简单</strong>：消费者使用来说更简单，就等着，反正有消息来了就会推过来</li></ol><h3 id="拉模式-pull" tabindex="-1">拉模式（pull） <a class="header-anchor" href="#拉模式-pull" aria-hidden="true">#</a></h3><p><strong>解释</strong>：当服务端收到这条消息后什么也不做，只是等着 Consumer 主动到自己这里来读，即 Consumer 这里有一个&quot;拉取&quot;的动作</p><p><strong>适用场景</strong></p><ol><li><strong>消费速率可控</strong>：采用拉模式，消费者可以根据自己的消费速率，动态的调整拉取的频率，很难出现消息积压</li><li><strong>部分或全部 Consumer 不在线</strong>：如果采用推模式，因为无法预知 Consumer 的宕机或下线是短暂的还是持久的，如果一直为该 Consumer 保留自宕机开始的所有历史消息，那么即便其他所有的 Consumer 都已经消费完成，数据也无法清理掉，随着时间的积累，队列的长度会越来越大，此时无论消息是暂存于内存还是持久化到磁盘上（采用 Push 模型的系统，一般都是将消息队列维护于内存中，以保证推送的性能和实时性），都将对 CMQ 服务端造成巨大压力，甚至可能影响到其他 Consumer 的正常消费，尤其当消息的生产速率非常快时更是如此；但是如果不保留数据，那么等该 Consumer 再次起来时，则要面对丢失数据的问题。 折中的方案是：CMQ 给数据设定一个超时时间，当 Consumer 宕机时间超过这个阈值时，则清理数据；但这个时间阈值也并不太容易确定。 采用拉模式，情况会有所改善；服务端不再关心 Consumer 的状态，而是采取“你来了我才服务”的方式，Consumer 是否能够及时消费数据，服务端不会做任何保证（也有超时清理时间）。</li></ol><h2 id="常见mq比对" tabindex="-1">常见MQ比对 <a class="header-anchor" href="#常见mq比对" aria-hidden="true">#</a></h2><table><thead><tr><th><strong>功能特性</strong></th><th><strong>RocketMQ</strong></th><th><strong>MsgBroker（蚂蚁内部）</strong></th><th><strong>Kafka</strong></th><th><strong>RabbitMQ</strong></th></tr></thead><tbody><tr><td>事务消息</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr><tr><td>延迟消息</td><td>✅</td><td>✅</td><td>✅</td><td>🚫</td></tr><tr><td>优先级消息</td><td>🚫</td><td>🚫</td><td>🚫</td><td>✅</td></tr><tr><td>顺序消息</td><td>✅</td><td>🚫</td><td>✅</td><td>✅</td></tr><tr><td>消息轨迹</td><td>✅</td><td>✅</td><td>🚫</td><td>✅</td></tr><tr><td>消息过滤</td><td>✅</td><td>✅</td><td>🚫</td><td>🚫</td></tr><tr><td>消费模式</td><td>拉</td><td>推</td><td>拉</td><td>推、拉</td></tr><tr><td>积压能力</td><td>强（亿级）</td><td>弱（百万级）</td><td>强</td><td>弱</td></tr><tr><td>存储模式</td><td>磁盘</td><td>DB</td><td>磁盘</td><td>磁盘</td></tr><tr><td>可靠性</td><td>中</td><td>高</td><td>中</td><td>中</td></tr></tbody></table><h2 id="投递-消费语义" tabindex="-1">投递&amp;消费语义 <a class="header-anchor" href="#投递-消费语义" aria-hidden="true">#</a></h2><h3 id="投递语义" tabindex="-1">投递语义 <a class="header-anchor" href="#投递语义" aria-hidden="true">#</a></h3><p><strong>最多一次</strong>：<code>Producer</code>不等待<code>Broker</code>确认，只管发出即可；最可能丢失消息。如果丢了消息，就是投递0次。如果没丢，就是投递1次。</p><p><strong>最少一次</strong>：<code>Producer</code>发送给<code>Broker</code>并等待返回<code>ACK</code>确认消息，如果未收到<code>ACK</code>，则会重新发送，这样就会出现大于1次的投递情况。</p><p><strong>恰好一次</strong>：<code>Producer</code>每条消息有唯一的编号，<code>Broker</code>也会检查<code>Producer</code>的编号，如果编号已存在则会丢弃，可以实现恰好投递1次。</p><h3 id="消费语义" tabindex="-1">消费语义 <a class="header-anchor" href="#消费语义" aria-hidden="true">#</a></h3><p><strong>最多一次</strong>：<code>Broker</code>投递完消息即认为是消费成功，无需等待<code>Comsumer</code>返回<code>ACK</code>确认，有可能<code>Comsumer</code>消费的时候宕机导致消息丢失，因此最多消费一次</p><p><strong>最少一次</strong>：<code>Broker</code>投递完消息会需要<code>Comsumer</code>返回<code>ACK</code>确认，如果在指定时间内没有收到<code>ACK</code>，则会重新发送</p><p><strong>恰好一次</strong>：<code>Broker</code>投递完消息会需要<code>Comsumer</code>返回<code>ACK</code>确认，如果在指定时间内没有收到<code>ACK</code>，则会重新发送，同时<code>Comsumer</code>需要实现幂等逻辑，保证消息不重复消费</p><h2 id="功能特性" tabindex="-1">功能特性 <a class="header-anchor" href="#功能特性" aria-hidden="true">#</a></h2><h3 id="事务消息" tabindex="-1">事务消息 <a class="header-anchor" href="#事务消息" aria-hidden="true">#</a></h3><blockquote><p>以RocketMQ为例</p></blockquote><h4 id="使用场景" tabindex="-1">使用场景 <a class="header-anchor" href="#使用场景" aria-hidden="true">#</a></h4><p>用户发起订单，支付100块钱操作完成后，能得到100积分，账户服务和会员服务是两个独立的微服务模块，有各自的数据库，按照上文提及的问题可能性，将会出现这些情况：</p><ul><li>如果先扣款，再发消息，可能钱刚扣完，消息没发失败了，结果积分没增加。</li><li>如果先发消息，再扣款，可能积分增加了，但钱没扣掉，白送了100积分</li><li>钱正常扣了，消息也发送成功了，但会员服务实例消费消息出现问题，结果积分没增加</li></ul><p><strong>事务消息就是保证本地事务操作和mq消息的发送是一致的，即本地事务成功，消息一定发送出去，本地事务失败，消息一定未被消费</strong></p><h5 id="整体流程" tabindex="-1">整体流程 <a class="header-anchor" href="#整体流程" aria-hidden="true">#</a></h5><p><div><img src="'+c+'" alt="" style="max-height:400px;" loading="lazy"></div></p><h5 id="异常情况" tabindex="-1">异常情况 <a class="header-anchor" href="#异常情况" aria-hidden="true">#</a></h5><ol><li><p><code>Producer</code>发送半消息失败</p><p>可能由于网络或者mq故障，导致<code>Producer</code>发送半消息(prepare)失败，这时候<code>Producer</code>直接回滚本地事务就可以了</p></li><li><p>半消息发送成功，本地事务执行失败</p><p>发送方执行<code>rollback</code>给<code>MQ</code>，<code>MQ</code>会删除之前发送的半消息，消费端也就收不到这条消息</p></li><li><p>半消息发送成功，本地事务执行过程宕机</p><p><code>Broker</code>一直接受不到<code>Producer</code>的确认结果，因此就会调<code>Producer</code>提供的查询接口来判断本地事务的最终执行结果</p></li></ol><p><strong>思考1</strong>： 事务回查时，业务逻辑都需要做些什么？</p><details class="details custom-block"><summary>答案</summary><p>事务消息的 Check 方法里面，应该写一些检查事务一致性的逻辑。消息队列发送事务消息时需要实现<code>LocalTransactionChecker</code>接口，用来处理<code>Broker</code>主动发起的本地事务状态回查请求；因此需要完成两件事情：</p><ol><li>检查该半事务消息对应的本地事务的状态（committed or rollback）。</li><li>向 Broker 提交该半事务消息本地事务的状态。</li></ol></details><p><strong>思考2</strong>： <code>RocketMQ</code>是怎么保证半消息(prepare)不被消费者消费呢？</p><details class="details custom-block"><summary>答案</summary><ol><li><code>Broker</code>端收到消息后，根据<code>TRAN_MSG</code>值判断是否事务消息。则将消息转存到<code>topic: RMQ_SYS_TRANS_HALF_TOPIC</code>，<code>queueId: 0</code></li><li>如果本地事务状态是<code>commit</code>，<code>Broker</code>恢复原 <code>topic</code>，<code>queueId</code>, <code>Consumer</code>可以正常消费事务消息</li><li>如果本地事务状态是<code>rollback</code>，把消息放入<code>RMQ_SYS_TRANS_OP_HALF_TOPIC</code> 并通过设置<code>tags = d</code>标识该消息已被删除</li></ol></details><h3 id="延迟消息" tabindex="-1">延迟消息 <a class="header-anchor" href="#延迟消息" aria-hidden="true">#</a></h3><p>使用场景：用户下单未付款，30分钟后需要关闭订单</p><p>常见做法：使用<code>redis</code>的<code>zset</code>集合，将延迟任务按照过期时间排序，然后定时器不断的去轮训 优点：简单方便 缺点：占用的存储空间较大，定时轮询会造成不必要的请求</p><p>问：直接用<code>DelayQueue</code>怎么样？ 答：<code>DelayQueue</code>是<code>JDK</code>提供的延迟队列，对于有延迟需求的场景，直接用<code>DelayQueue</code>是可以的，但是不支持对延迟任务进行修改或删除操作，同时如果任务过多，会造成<code>DelayQueue</code>空间占用过大</p><h4 id="kafka时间轮" tabindex="-1">Kafka时间轮 <a class="header-anchor" href="#kafka时间轮" aria-hidden="true">#</a></h4><ol><li><p><code>Kafka</code>中一个时间轮(TimingWheel)默认是由20个时间格组成，每格的时间跨度是<code>1ms</code>，时间轮底层采用数组实现，数组中的每个元素可以存放一个定时任务列表（TimerTaskList）。<code>TimerTaskList</code>是一个环形的双向链表，链表中的每一项表示的都是定时任务项（TimerTaskEntry），其中封装了真正的定时任务<code>TimerTask</code><div><img src="'+s+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>假设初始的时候一个格子一秒，时间轮的指针定格在<code>0</code>。此时添加一个超时时间为<code>2ms</code>的任务, 那么这个任务将会插入到第二个时间格中 <div><img src="'+l+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>时间轮的指针到达第二个时间格时, 会处理该时间格上对应的任务 <div><img src="'+n+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>如果这个时候又插入一个延时时间为<code>8ms</code>的任务进来, 这个任务的过期时间就是在当前时间<code>2ms</code>的基础上加<code>8ms</code>, 也就是<code>10ms</code>, 那么这个任务将会插入到过期时间为<code>10ms</code>的时间格中。 <div><img src="'+p+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>如果在当前时间是<code>2ms</code>的时候, 插入一个延时时间为<code>19ms</code>的任务时, 这个任务的过期时间就是在当前时间<code>2ms</code>的基础上加<code>19ms</code>, 也就是<code>21ms</code>，那么这个任务就会插入到过期时间为<code>21ms</code>的时间格中 <div><img src="'+m+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>如果在当前时间是<code>2ms</code>的时候, 插入一个延时时间为<code>22ms</code>的任务, 这个任务的过期时间就是在<code>2ms</code>的基础上加<code>22ms</code>，也就是<code>24ms</code>，但是显然没有<code>24ms</code>的格子 <div><img src="'+h+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>第一层的时间轮装不下的时候，任务就会放入第二层的时间轮格子中 <div><img src="'+u+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>当第二层时间轮上的任务到期后，就会执行时间轮的降级，原本超时时间为<code>24ms</code>的任务会被从第二层取出来，放入第一层到期时间为<code>24ms</code>的格子中 <div><img src="'+g+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li><li><p>从这里可以看出时间轮的巧妙之处，两层时间轮只用了<code>40</code>个数组元素，却可以承载<code>[0-399s]</code>的定时任务。而三层时间轮用<code>60</code>个数组元素，就可以承载<code>[0-7999s]</code>的定时任务 <div><img src="'+b+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li></ol><p><strong>总结</strong></p><ul><li>Kafka 使用时间轮来实现延时队列，因为其底层是任务的添加和删除是基于链表实现的，是 O(1) 的时间复杂度，满足高性能的要求</li><li>DelayQueue 只存放了 TimerTaskList，并不是所有的 TimerTask，数量并不多，相比空推进带来的影响是利大于弊的</li><li>对于时间跨度大的延时任务，Kafka 引入了层级时间轮，能更好控制时间粒度，可以应对更加复杂的定时任务处理场景</li></ul><p><strong>思考</strong>： 插入一个延时时间<code>400ms</code>的任务, 指针就要执行<code>399</code>次&quot;空推进&quot;吗？</p><details class="details custom-block"><summary>答案</summary><pre><code>Kafka通过一个`DelayQueue`保存了所有的`TimerTaskList`对象，然后通过一个叫做`ExpiredOperationReaper`的线程从 `DelayQueue`\n中获取超时的任务列表 `TimerTaskList`，然后根据`TimerTaskList` 的过期时间来精确推进时间轮的时间，这样就不会存在空推进的问题，\n</code></pre></details><h4 id="rocketmq内部版" tabindex="-1">rocketmq内部版 <a class="header-anchor" href="#rocketmq内部版" aria-hidden="true">#</a></h4><p>rocketmq在kafka的时间轮基础上提供了延迟消息可靠的存储方式</p><ol><li><p>时间轮的每一格设计如下</p><table><thead><tr><th>delay_time(8B) 延迟时间</th><th>first_pos 首条位置</th><th>last_pos(8B) 最后位置</th><th>num(4B) 消息条数</th></tr></thead></table></li><li><p><code>TimerLog</code>：定时消息的记录文件，Append Only。每条记录包含一个<code>prev_pos</code>，指向前一条定时到同样时刻的记录</p></li><li><p><code>TimerLog</code>与<code>TimerWheel</code>的协作如下图所示： <div><img src="'+e+'" alt="" style="max-height:400px;" loading="lazy"></div></p></li></ol><h5 id="工作流程" tabindex="-1">工作流程 <a class="header-anchor" href="#工作流程" aria-hidden="true">#</a></h5><p><div><img src="'+e+'" alt="" style="max-height:400px;" loading="lazy"></div></p><ol><li>针对放置定时消息的<code>service</code>，每<code>50ms</code>从<code>commitLog</code>读取指定<code>topic</code>的定时消息 <ol><li><code>TimerEnqueueGetService</code>从<code>commitLog</code>读取得到定时主题的消息，并先将其放入<code>enqueuePutQueue</code></li><li>另一个线程<code>TimerEnqueuePutService</code>将其放入<code>timerLog</code>，更新时间轮的存储内容。将该任务放进时间轮的指定位置</li></ol></li><li>针对取出定时消息的<code>service</code>，每<code>50ms</code>读取下一秒的<code>slot</code>。有三个线程将读取到的消息重新放回<code>commitLog</code><ol><li>首先，<code>TimerDequeueGetService</code>每<code>50ms</code>读取下一秒的<code>slot</code>，从<code>timerLog</code>中得到指定的<code>msgs</code>，并放进<code>dequeueGetQueue</code></li><li>而后<code>TimerDequeueGetMessageService</code>从<code>dequeueGetQueue</code>中取出<code>msg</code>，并将其放入队列中。该队列为待写入<code>commitLog</code>的队列<code>dequeuePutQueue</code></li><li>最后<code>TimerDequeuePutMessageService</code>将这个<code>queue</code>中的消息取出，若已到期则修改<code>topic</code>，放回<code>commitlog</code>，否则继续按原<code>topic</code>写回<code>commitLog</code>滚动日志</li></ol></li></ol><p>缺点</p><ul><li>只能精确到秒级</li><li>顺序的写会带来随机的读，导致读取性能较低</li></ul><h4 id="rocketmq社区版" tabindex="-1">rocketmq社区版 <a class="header-anchor" href="#rocketmq社区版" aria-hidden="true">#</a></h4><p>RocketMQ社区版支持延迟消息，但是不支持任意时间精度的延迟消息，只支持特定级别的延迟消息 消息延迟级别分别为<code>1s</code>, <code>5s</code>, <code>10s</code>, <code>30s</code>, <code>1min</code>, <code>2min</code>, <code>3min</code>, <code>4min</code>, <code>5min</code>, <code>6min</code>, <code>7min</code>, <code>8min</code>, <code>9min</code>, <code>10min</code>, <code>20min</code>, <code>30min</code>, <code>1h</code>, <code>2h</code> 共18个级别。在发送消息时，设置消息延迟级别即可，设置消息延迟级别时有以下3种情况：</p><ol><li>设置消息延迟级别等于0时，则该消息为非延迟消息。</li><li>设置消息延迟级别大于等于1并且小于等于18时，消息延迟特定时间，如：设置消息延迟级别等于1，则延迟1s；设置消息延迟级别等于2，则延迟5s，以此类推。</li><li>设置消息延迟级别大于18时，则该消息延迟级别为18，如：设置消息延迟级别等于20，则延迟2h。</li></ol><p><strong>原理</strong> RocketMQ发送延时消息时先把消息按照延迟时间段发送到指定的队列中，然后通过一个定时器进行轮训这些队列，查看消息是否到期，如果到期就把这个消息发送到指定topic的队列中，这样的好处是同一队列中的消息延时时间是一致的，还有一个好处是这个队列中的消息时按照消息到期时间进行递增排序的，说的简单直白就是队列中消息越靠前的到期时间越早。</p><h3 id="顺序消息" tabindex="-1">顺序消息 <a class="header-anchor" href="#顺序消息" aria-hidden="true">#</a></h3><blockquote><p>以Kafka为例</p></blockquote><p><code>Kafka</code>通过<code>key</code>，将某类消息写入同一个<code>partition</code>，一个<code>partition</code>只能对应一个<code>Consumer</code>，以保证数据有序。</p><p><strong>思考1</strong>：<code>Producer</code>先后两条消息发送时，前一条消息发送失败，后一条消息发送成功，然后失败的消息重试后发送成功，会不会造成消息乱序？</p><details class="details custom-block"><summary>答案1</summary><p>为了解决重试机制引起的消息乱序，<code>Kafka</code>引入了<code>Producer ID</code>（即PID）和 <code>Sequence Number</code></p><ul><li>在<code>Producer</code>端，每个<code>Producer</code>都被<code>Broker</code>自动分配了一个<code>PID</code>，<code>Producer</code>向<code>Broker</code>发送的每条消息，在内部都附带着该<code>PID</code>和一个递增的<code>Sequence Number</code></li><li>在<code>Broker</code>端，为每个<code>Topic</code>的每个<code>Partition</code>都维护了一个当前写成功的消息的最大<code>&lt;PID, Sequence Number&gt;</code>元组，如果<code>Sequence Number</code>比<code>Broker</code>维护的序号差值大于<code>1</code>，说明中间有数据尚未写入，即乱序，此时<code>Broker</code>拒绝该消息，如果<code>Sequence Number</code>小于等于<code>Broker</code>维护的序号，说明该消息已被保存，即为重复消息，<code>Broker</code>直接丢弃该消息，这样可以保证每个消息都被发送到<code>Broker</code></li></ul></details><p><strong>思考2</strong>：只有一个<code>Partition</code>会导致消费者的吞吐量变低，如果消费者启用多线程消费，则消息重新变得无序，如何解决？</p><details class="details custom-block"><summary>答案2</summary><p>答：消费者端创建多个内存队列，具有相同<code>key</code>的数据都路由到同一个内存队列；然后每个线程分别消费一个内存队列即可，这样可以保证多个顺序的同时尽可能提高吞吐量 <div><img src="'+k+'" alt="" style="max-height:400px;" loading="lazy"></div></p></details><h3 id="消息轨迹" tabindex="-1">消息轨迹 <a class="header-anchor" href="#消息轨迹" aria-hidden="true">#</a></h3><blockquote><p>以蚂蚁的MagBroker为例</p></blockquote><p>一条消息的生命周期包含多个阶段：发送端发送，服务端收到消息、写入消息、投递消息等。而用户在使用MQ时，有时会想知道消息的发送、投递、消费情况，以及消费耗时、消费节点、是否重投等信息。这些信息都属于消息轨迹。 在没有可视化的消息轨迹界面时，轨迹信息都是通过原始的翻日志的方式来查询。需要根据机器节点的日志信息找到链路，一步一步溯源查找。</p><p><div><img src="'+f+'" alt="" style="max-height:400px;" loading="lazy"></div></p><p>轨迹数据和消息数据不同。消息不能丢失，要保证高可靠性，而轨迹信息一般则用于问题的排查，并且往往是写远大于读，因此在轨迹功能的设计上不仅要考虑成本，还要考虑对消息链路是否有影响。因此采用了独立集群存储轨迹信息（PS：图中的<code>AntKV</code>可以理解为<code>HBase</code>）</p><h4 id="轨迹写入" tabindex="-1">轨迹写入 <a class="header-anchor" href="#轨迹写入" aria-hidden="true">#</a></h4><p>MsgBroker消息服务端在处理消息时会进行埋点，轨迹数据就在埋点时产生，处理消息主要包括以下几个阶段：</p><ol><li>消息存储DB时</li><li>消息的消费结果回调</li><li>事务消息的提交/回滚</li><li>定时消息的触发/修改/删除</li></ol><p>轨迹数据生产好以后会被推入至队列当中。线程定时捞取收集轨迹数据，处理组装后发送给轨迹集群服务。轨迹数据会以消息的形式从MsgBroker发送至轨迹集群服务，轨迹集群服务收到发送的轨迹数据时会进行存储。</p><p><div><img src="'+y+'" alt="" style="max-height:400px;" loading="lazy"></div></p><h4 id="读取轨迹" tabindex="-1">读取轨迹 <a class="header-anchor" href="#读取轨迹" aria-hidden="true">#</a></h4><p>当用户登录消息控制台创建查询任务，消息控制台会向轨迹集群内的各个服务发送请求，轨迹数据存储在轨迹集群下各服务的本地<code>AntKV</code>中。因为消息服务发送轨迹信息消息至轨迹服务时的节点选取是随机的，所以数据会散落在集群内各服务上。因此控制台服务在查询轨迹时需要遍历轨迹集群下的所有轨迹服务，才能获得完整的轨迹信息。</p><p><div><img src="'+_+'" alt="" style="max-height:400px;" loading="lazy"></div></p><h2 id="稳定性-性能" tabindex="-1">稳定性&amp;性能 <a class="header-anchor" href="#稳定性-性能" aria-hidden="true">#</a></h2><h4 id="高可用" tabindex="-1">高可用 <a class="header-anchor" href="#高可用" aria-hidden="true">#</a></h4><p>数据备份和故障转移 <div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666871933931-97904c34-ab95-4778-9266-8a724d652213.png#clientId=uecce1891-4c1f-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=242&amp;id=ue475ed04&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=483&amp;originWidth=1037&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=59699&amp;status=done&amp;style=none&amp;taskId=u85dd854e-7f54-4fe9-8d6c-addca350b18&amp;title=&amp;width=518.5" alt="" style="max-height:400px;" loading="lazy"></div></p><h5 id="消费一致性" tabindex="-1">消费一致性 <a class="header-anchor" href="#消费一致性" aria-hidden="true">#</a></h5><p><div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666873658825-a41e31e0-f7dd-44e7-910c-f1a497841dd2.png#clientId=uecce1891-4c1f-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=153&amp;id=ubf45f24c&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=306&amp;originWidth=1080&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=155906&amp;status=done&amp;style=none&amp;taskId=ud3f002cb-af85-4049-9add-af69a19790c&amp;title=&amp;width=540" alt="" style="max-height:400px;" loading="lazy"></div> LogEndOffset：每个partition的log最后一条Message的位置。 HighWatermark：取最小LEO，consumer能够看到的此partition的位置。</p><h4 id="高性能" tabindex="-1">高性能 <a class="header-anchor" href="#高性能" aria-hidden="true">#</a></h4><h5 id="零拷贝" tabindex="-1">零拷贝 <a class="header-anchor" href="#零拷贝" aria-hidden="true">#</a></h5><h5 id="磁盘顺序读写" tabindex="-1">磁盘顺序读写 <a class="header-anchor" href="#磁盘顺序读写" aria-hidden="true">#</a></h5><h4 id="rocketmq" tabindex="-1">rocketmq <a class="header-anchor" href="#rocketmq" aria-hidden="true">#</a></h4><p><div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667303564561-2f07e1f6-7659-42fd-af1c-e6158b2b660d.png#clientId=ub92ab98a-bea2-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=540&amp;id=u0afcf2aa&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=540&amp;originWidth=750&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=151090&amp;status=done&amp;style=none&amp;taskId=u69fe3af1-8ba5-496f-b9cd-2e6f00ec9b2&amp;title=&amp;width=750" alt="" style="max-height:400px;" loading="lazy"></div></p><h5 id="_1-逻辑分区" tabindex="-1">1. 逻辑分区 <a class="header-anchor" href="#_1-逻辑分区" aria-hidden="true">#</a></h5><p>为了提升整体的吞吐量与提供跨副本组的高可用能力，RocketMQ 服务端一般会为单个 Topic 创建多个逻辑分区，即在多个副本组上各自维护部分分区 ( Partition)，我们把它称为队列 (MessageQueue)。同一个副本组上同一个 Topic 的队列数相同并从 0 开始连续编号，不同副本组上的 MessageQueue 数量可以不同。 <div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667211128802-1ebe1226-c430-4b6b-a95b-64ae84602146.png#clientId=u732f2838-f0ad-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=610&amp;id=u13a63bf6&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=610&amp;originWidth=750&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=217091&amp;status=done&amp;style=none&amp;taskId=u1a163547-d3c6-45a3-bacb-68c9b9605a3&amp;title=&amp;width=750" alt="" style="max-height:400px;" loading="lazy"></div> 每个Topic在Broker上会划分成几个逻辑队列，每个逻辑队列保存一部分消息数据。从上面模型可以看出，要解决消费并发，就是要利用Queue,一个Topic可以分出更多的queue,每一个queue可以存放在不同的硬件上来提高并发。</p><h5 id="_2-持久化" tabindex="-1">2. 持久化 <a class="header-anchor" href="#_2-持久化" aria-hidden="true">#</a></h5><p>在RocketMQ中消息刷盘主要可以分为同步刷盘和异步刷盘两种。 <div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667301973880-fbab5567-a642-42b6-8ead-7fa8e666e23d.png#clientId=ub92ab98a-bea2-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=540&amp;id=u5e5e4647&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=908&amp;originWidth=583&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=48292&amp;status=done&amp;style=none&amp;taskId=u1e3a47a0-19e3-4baa-b8f2-559591abd3e&amp;title=&amp;width=347" alt="" style="max-height:400px;" loading="lazy"></div> 消息写入内存的PAGECACHE后，立刻通知刷盘线程刷盘，然后等待刷盘完成，刷盘线程执行完成后唤醒等待的线程，返回消息写成功的状态。</p><p><div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667302024113-a2ca21dc-b78c-4e84-a005-2a84c19c0f75.png#clientId=ub92ab98a-bea2-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=592&amp;id=ud39bf6fa&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=906&amp;originWidth=542&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=49898&amp;status=done&amp;style=none&amp;taskId=uc5830126-bfa6-4900-9880-40955d7f100&amp;title=&amp;width=354" alt="" style="max-height:400px;" loading="lazy"></div> 在返回写成功状态时，消息可能只是被写入了内存的PAGECACHE，写操作的返回快，吞吐量大；当内存里的消息量积累到一定程度时，统一触发写磁盘操作，快速写入。</p><h5 id="_3-消息发送" tabindex="-1">3. 消息发送 <a class="header-anchor" href="#_3-消息发送" aria-hidden="true">#</a></h5><p>三种发送方式：同步/异步/单向</p><p>消息发送的返回状态有如下四种 : FLUSH_DISK_TIMEOUT 、 FLUSH_SLAVE_TIMEOUT 、SLAVE_NOT_AVAILABLE 、SEND_OK，不同状态在不同的刷盘策略和同步策略的配置下含义是不同的 。 <strong>FLUSH_DISK_TIMEOUT</strong> : 表示没有在规定时间内完成刷盘(需要 Broker 的刷盘策被设置成 SYNC_FLUSH 才会报这个错误) 。 <strong>FLUSH_SLAVE_TIMEOUT</strong> :表示在主备方式下，并且 Broker被设 置 成 SYNC_MASTER 方式，没有在设定时间内完成 主从同步 。 <strong>SLAVE_NOT_AVAILABLE</strong> : 这个状态 产生的场景和 FLUSH_SLAVE_TIMEOUT 类似， 表示在主备 方式下，并且 Broker被设置成 SYNC_MASTER，但是没有找到被配置成 Slave 的 Broker。 <strong>SEND_ OK</strong> :表示发送成功，发送成功的具体含义，比如消息是否已经 被存储到融盘?消息是否被同步到了 Slave上?消息在 Slave上是否被 写人磁盘?需要结合所配置的刷盘策略、主从策略来定 。 这个状态还可 以简单理解为，没有发生上面列出的 三个问题状态就是 SEND OK。</p><h5 id="_4-批量生产-消费" tabindex="-1">4. 批量生产/消费 <a class="header-anchor" href="#_4-批量生产-消费" aria-hidden="true">#</a></h5><p>批量消息是指将多条小的消息合并成一个批量消息，一次发送出去。这样的好处是可以减少网络IO，提升吞吐量。 比如说原本我有三条消息,如果三条消息分三次发的话,会走三次网络IO,如果我给三条消息整成一起发送,这样就走一次网络了。 <div><img src="https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667304196521-865cb3ee-ab0d-4c62-90e5-7b6cf5bff2f4.png#clientId=ub92ab98a-bea2-4&amp;crop=0&amp;crop=0&amp;crop=1&amp;crop=1&amp;from=paste&amp;height=846&amp;id=uec728440&amp;margin=%5Bobject%20Object%5D&amp;name=image.png&amp;originHeight=846&amp;originWidth=1402&amp;originalType=binary&amp;ratio=1&amp;rotation=0&amp;showTitle=false&amp;size=220474&amp;status=done&amp;style=none&amp;taskId=u2ccac6c3-73d4-409a-9418-120c3c6ec4c&amp;title=&amp;width=1402" alt="" style="max-height:400px;" loading="lazy"></div></p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-hidden="true">#</a></h2><p>目前团队使用消息队列的典型例子：</p><table><thead><tr><th></th><th>SOFAMQ特性</th><th>Msgbroker特性</th></tr></thead><tbody><tr><td>infosec-&gt;infosectask事件消息</td><td>堆积</td><td></td></tr><tr><td>infosectask-&gt;itask流审消息</td><td>失败重试、堆积</td><td></td></tr><tr><td>infosectask-&gt;infostudio能力异步结果轮询</td><td>延迟消息</td><td></td></tr><tr><td>infosec高保场景接入</td><td></td><td>事务消息、存储高可靠</td></tr><tr><td>infosec事件异步结果</td><td></td><td>异步、解耦、存储高可靠、推模式实时强</td></tr></tbody></table><h2 id="参考文档" tabindex="-1">参考文档 <a class="header-anchor" href="#参考文档" aria-hidden="true">#</a></h2><ul><li>消息队列的消费语义和投递语义：<a href="https://juejin.cn/post/6844903872029278215" target="_blank" rel="noreferrer">https://juejin.cn/post/6844903872029278215</a></li><li>Msgbroker：<a href="https://yuque.antfin.com/middleware/msgbroker/pubsub" target="_blank" rel="noreferrer">https://yuque.antfin.com/middleware/msgbroker/pubsub</a></li><li>SOFAMQ：<a href="https://yuque.antfin.com/middleware/sofamq/common_msg" target="_blank" rel="noreferrer">https://yuque.antfin.com/middleware/sofamq/common_msg</a></li><li>消息幂等：<a href="https://help.aliyun.com/document_detail/177412.html" target="_blank" rel="noreferrer">https://help.aliyun.com/document_detail/177412.html</a></li><li>kafka时间轮：<a href="https://mp.weixin.qq.com/s/l5Kpg45-4MkOq_xfUczPPA" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s/l5Kpg45-4MkOq_xfUczPPA</a></li><li>msgbroker 消息轨迹：<a href="https://developer.alipay.com/post/496000358?inviterWorkNo=322773" target="_blank" rel="noreferrer">https://developer.alipay.com/post/496000358?inviterWorkNo=322773</a></li><li>rocketmq延迟消息：<a href="https://mp.weixin.qq.com/s/iZL8M88gF7s5NmW7DYyYDQ" target="_blank" rel="noreferrer">https://mp.weixin.qq.com/s/iZL8M88gF7s5NmW7DYyYDQ</a></li></ul>',116),T=[v];function q(C,S,P,M,B,A){return d(),a("div",null,T)}const L=t(x,[["render",q]]);export{D as __pageData,L as default};
