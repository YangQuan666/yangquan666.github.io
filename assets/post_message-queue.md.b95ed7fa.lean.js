import{_ as o,c as d,b as t,e as i,d as e,a as r,r as n,o as l}from"./app.0503c94e.js";const Z=JSON.parse('{"title":"你真的了解消息队列吗","description":"","frontmatter":{"title":"你真的了解消息队列吗","date":"2022-11-11T00:00:00.000Z","excerpt":"一篇文章带你探寻消息队列的几个基础功能的原理","tags":["mq","消息队列","kafka","time wheel"]},"headers":[{"level":2,"title":"介绍","slug":"介绍","link":"#介绍","children":[]},{"level":2,"title":"术语","slug":"术语","link":"#术语","children":[{"level":3,"title":"基础","slug":"基础","link":"#基础","children":[]},{"level":3,"title":"消息类型","slug":"消息类型","link":"#消息类型","children":[]},{"level":3,"title":"其他","slug":"其他","link":"#其他","children":[]}]},{"level":2,"title":"消费模式","slug":"消费模式","link":"#消费模式","children":[{"level":3,"title":"拉模式","slug":"拉模式","link":"#拉模式","children":[]},{"level":3,"title":"推模式","slug":"推模式","link":"#推模式","children":[]}]},{"level":2,"title":"消息队列选型速览","slug":"消息队列选型速览","link":"#消息队列选型速览","children":[]},{"level":2,"title":"投递&消费语义","slug":"投递-消费语义","link":"#投递-消费语义","children":[]},{"level":2,"title":"功能特性","slug":"功能特性","link":"#功能特性","children":[{"level":3,"title":"事务消息","slug":"事务消息","link":"#事务消息","children":[]},{"level":3,"title":"延迟消息","slug":"延迟消息","link":"#延迟消息","children":[]},{"level":3,"title":"稳定性&性能","slug":"稳定性-性能","link":"#稳定性-性能","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]},{"level":2,"title":"参考文档","slug":"参考文档","link":"#参考文档","children":[]}],"relativePath":"post/message-queue.md","lastUpdated":1673192680000}'),c={name:"post/message-queue.md"},s=t("h1",{id:"你真的了解消息队列吗",tabindex:"-1"},[e("你真的了解消息队列吗 "),t("a",{class:"header-anchor",href:"#你真的了解消息队列吗","aria-hidden":"true"},"#")],-1),h=r("",14),p=r("",2),g=r("",6),u=r("",2),m=r("",6),b=r("",9),f=t("p",null,"Kafka中一个时间轮TimingWheel默认是由20个时间格组成，每格的时间跨度是1ms，时间轮底层采用数组实现，数组中的每个元素可以存放一个定时任务列表（TimerTaskList）。TimerTaskList是一个环形的双向链表，链表中的每一项表示的都是定时任务项（TimerTaskEntry），其中封装了真正的定时任务TimerTask",-1),y=t("li",null,[t("p",null,"如果在当前时间是2ms的时候, 插入一个延时时间为19ms的任务时, 这个任务的过期时间就是在当前时间2s的基础上加19ms, 也就是21ms，那么这个任务就会插入到过期时间为21ms的时间格中")],-1),k={start:"6"},_=r("",1),T=t("p",null,[t("strong",null,"总结")],-1),x=t("ul",null,[t("li",null,"Kafka 使用时间轮来实现延时队列，因为其底层是任务的添加和删除是基于链表实现的，是 O(1) 的时间复杂度，满足高性能的要求"),t("li",null,"DelayQueue 只存放了 TimerTaskList，并不是所有的 TimerTask，数量并不多，相比空推进带来的影响是利大于弊的"),t("li",null,"对于时间跨度大的延时任务，Kafka 引入了层级时间轮，能更好控制时间粒度，可以应对更加复杂的定时任务处理场景")],-1),I=t("h6",{id:"rocketmq内部版",tabindex:"-1"},[e("rocketmq内部版 "),t("a",{class:"header-anchor",href:"#rocketmq内部版","aria-hidden":"true"},"#")],-1),A=t("p",null,"rocketmq在kafka的时间轮基础上提供了延迟消息可靠的存储方式",-1),S=t("li",null,[t("p",null,"时间轮的每一格设计如下"),t("p",null,"| delay_time(8B) 延迟时间 | first_pos 首条位置 | last_pos(8B) 最后位置 | num(4B) 消息条数 | |---------------------|----------------|-------------------|--------------|")],-1),w=t("li",null,[t("p",null,"TimerLog，定时消息的记录文件，Append Only。每条记录包含一个prev_pos，指向前一条定时到同样时刻的记录")],-1),z=t("ol",null,[t("li",null,[e("针对放置定时消息的service，每50ms从commitLog读取指定topic的定时消息 "),t("ol",null,[t("li",null,"TimerEnqueueGetService从commitLog读取得到定时主题的消息，并先将其放入enqueuePutQueue"),t("li",null,"另一个线程TimerEnqueuePutService将其放入timerLog,更新时间轮的存储内容。将该任务放进时间轮的指定位置")])]),t("li",null,[e("针对取出定时消息的service，每50ms读取下一秒的slot。有三个线程将读取到的消息重新放回commitLog "),t("ol",null,[t("li",null,"首先，TimerDequeueGetService每50ms读一次下一秒的slot，从timerLog中得到指定的msgs，并放进dequeueGetQueue"),t("li",null,"而后TimerDequeueGetMessageService从dequeueGetQueue中取出msg，并将其放入队列中。该队列为待写入commitLog的队列，dequeuePutQueue"),t("li",null,"最后TimerDequeuePutMessageService将这个queue中的消息取出，若已到期则修改topic，放回commitlog，否则继续按原topic写回CommitLog滚动")])])],-1),j=r("",12),C=t("h4",{id:"消息轨迹",tabindex:"-1"},[e("消息轨迹 "),t("a",{class:"header-anchor",href:"#消息轨迹","aria-hidden":"true"},"#")],-1),D=t("p",null,"一条消息的生命周期包含多个阶段：发送端发送，服务端收到消息、写入消息、投递消息等。而用户在使用MQ时，有时会想知道消息的发送、投递、消费情况，以及消费耗时、消费节点、是否重投等信息。这些信息都属于消息轨迹。 在没有可视化的消息轨迹界面时，轨迹信息都是通过原始的翻日志的方式来查询。需要根据机器节点的日志信息找到链路，一步一步溯源查找。",-1),B=r("",7),O=t("h5",{id:"消费一致性",tabindex:"-1"},[e("消费一致性 "),t("a",{class:"header-anchor",href:"#消费一致性","aria-hidden":"true"},"#")],-1),q=t("h4",{id:"高性能",tabindex:"-1"},[e("高性能 "),t("a",{class:"header-anchor",href:"#高性能","aria-hidden":"true"},"#")],-1),P=t("h5",{id:"零拷贝",tabindex:"-1"},[e("零拷贝 "),t("a",{class:"header-anchor",href:"#零拷贝","aria-hidden":"true"},"#")],-1),L=t("h5",{id:"磁盘顺序读写",tabindex:"-1"},[e("磁盘顺序读写 "),t("a",{class:"header-anchor",href:"#磁盘顺序读写","aria-hidden":"true"},"#")],-1),M=t("h4",{id:"msgbroker",tabindex:"-1"},[e("msgbroker "),t("a",{class:"header-anchor",href:"#msgbroker","aria-hidden":"true"},"#")],-1),H=t("h4",{id:"rocketmq-1",tabindex:"-1"},[e("rocketmq "),t("a",{class:"header-anchor",href:"#rocketmq-1","aria-hidden":"true"},"#")],-1),v=t("h5",{id:"_1-逻辑分区",tabindex:"-1"},[e("1. 逻辑分区 "),t("a",{class:"header-anchor",href:"#_1-逻辑分区","aria-hidden":"true"},"#")],-1),W=t("h5",{id:"_2-持久化",tabindex:"-1"},[e("2. 持久化 "),t("a",{class:"header-anchor",href:"#_2-持久化","aria-hidden":"true"},"#")],-1),V=r("",4),E=r("",5);function N(Q,R,Y,K,J,F){const a=n("q-img");return l(),d("div",null,[s,t("p",null,[i(a,{src:"/post/message-queue/intro.png",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),h,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667209314893-418d9683-c128-469d-a750-5154c970578e.png#clientId=u898eb282-ece6-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1304&id=u0cc14049&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1304&originWidth=1812&originalType=binary&ratio=1&rotation=0&showTitle=false&size=505711&status=done&style=none&taskId=u58778780-7fd4-4948-b3a0-8d572f58869&title=&width=1812",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),p,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1666926141014-60b9ddbe-9726-4c33-b77d-fca8eff9a9f7.png#clientId=u9e5d1166-b7b7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=315&id=u521f5aa0&margin=%5Bobject%20Object%5D&name=image.png&originHeight=315&originWidth=634&originalType=binary&ratio=1&rotation=0&showTitle=false&size=92018&status=done&style=none&taskId=ufc8b0d18-b384-4cbe-a58c-199f3ffe87c&title=&width=634",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),g,t("p",null,[e("【最多投递一次】SOFAMQ单向发送： "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/250552/1666749244802-18d333e2-3927-4cfd-a8c6-8c1aeed1183b.png#clientId=uaf84ef44-79b9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=387&id=uf6cdb5da&margin=%5Bobject%20Object%5D&name=image.png&originHeight=387&originWidth=538&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16903&status=done&style=none&taskId=ufdb8ed9d-3aa9-47d9-8c69-4d541b60500&title=&width=538",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 【至少投递一次】SOFAMQ同步发送、异步发送： "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/250552/1666749267290-2ac1f71a-2e23-433b-bd64-93c0bc21af9d.png#clientId=uaf84ef44-79b9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=390&id=u1c0e4623&margin=%5Bobject%20Object%5D&name=image.png&originHeight=390&originWidth=542&originalType=binary&ratio=1&rotation=0&showTitle=false&size=20385&status=done&style=none&taskId=u082a8991-8167-4983-82eb-d6d27d9c8d4&title=&width=542",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/250552/1666749279073-905205f4-048d-4afb-b5c9-2a8740d91b8d.png#clientId=uaf84ef44-79b9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=387&id=u94fe797d&margin=%5Bobject%20Object%5D&name=image.png&originHeight=387&originWidth=538&originalType=binary&ratio=1&rotation=0&showTitle=false&size=21878&status=done&style=none&taskId=u866a76dd-029d-4c0e-a869-29119750d93&title=&width=538",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),u,t("p",null,[e("【至少消费一次】MsgBroker发送、订阅： "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/250552/1666748859300-a43c1fc9-ab05-443c-a7f8-e8635af0b368.png#clientId=uaf84ef44-79b9-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=360&id=ub5df8d12&margin=%5Bobject%20Object%5D&name=image.png&originHeight=360&originWidth=594&originalType=binary&ratio=1&rotation=0&showTitle=false&size=88863&status=done&style=none&taskId=u23cf4ad5-d686-45a9-b820-b75f2e13114&title=&width=594",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),m,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1661772178394-b3813e4c-1875-4b3e-9d3b-a0a5a54c4f37.png#clientId=u19ae7e55-69aa-4&crop=0&crop=0&crop=1&crop=1&errorMessage=unknown%20error&from=paste&height=202&id=MoV0E&margin=%5Bobject%20Object%5D&name=image.png&originHeight=403&originWidth=1223&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52125&status=error&style=none&taskId=u3ad62344-323f-4bcd-9eb4-b8428687195&title=&width=611.5",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),b,t("ol",null,[t("li",null,[f,t("p",null,[i(a,{src:"/post/message-queue/shijianlun1.png",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})])]),t("li",null,[t("p",null,[e("假设初始的时候一个格子一秒，时间轮的指针定格在0。此时添加一个超时时间为2ms的任务, 那么这个任务将会插入到第二个时间格中 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666795138826-aba61b58-039c-47eb-bcbe-8d236c99e739.gif#clientId=u6de1b89a-222a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=294&id=JiPgP&margin=%5Bobject%20Object%5D&name=640-2.gif&originHeight=588&originWidth=639&originalType=binary&ratio=1&rotation=0&showTitle=false&size=72819&status=done&style=none&taskId=ua97a540f-0ed1-43c1-bc6f-c945937ace5&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})])]),t("li",null,[t("p",null,[e("时间轮的指针到达第二个时间格时, 会处理该时间格上对应的任务 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666795356385-6e9bb305-11f4-45aa-ac7d-e5b6c19aac98.gif#clientId=u6de1b89a-222a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=294&id=g9icC&margin=%5Bobject%20Object%5D&name=640-3.gif&originHeight=588&originWidth=639&originalType=binary&ratio=1&rotation=0&showTitle=false&size=133833&status=done&style=none&taskId=ub50d1813-7feb-4e04-aa6e-cc037915d9c&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})])]),t("li",null,[t("p",null,[e("如果这个时候又插入一个延时时间为8ms的任务进来, 这个任务的过期时间就是在当前时间2ms的基础上加8ms, 也就是10ms, 那么这个任务将会插入到过期时间为10ms的时间格中。 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666795417643-9b747ec2-43c3-402e-9dff-259ba3129e19.gif#clientId=u6de1b89a-222a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=294&id=wntcx&margin=%5Bobject%20Object%5D&name=640-4.gif&originHeight=588&originWidth=639&originalType=binary&ratio=1&rotation=0&showTitle=false&size=76816&status=done&style=none&taskId=uca50c1c5-8b36-4642-b4e3-b1c99e79496&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})])]),y]),t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666795948319-9b1d090e-a266-4486-bb8f-cbe945349485.gif#clientId=u6de1b89a-222a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=294&id=YJfiO&margin=%5Bobject%20Object%5D&name=640-5.gif&originHeight=588&originWidth=639&originalType=binary&ratio=1&rotation=0&showTitle=false&size=271099&status=done&style=none&taskId=u361c955c-517c-42b3-b1d0-60960bcddcf&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),t("ol",k,[t("li",null,[e("如果在当前时间是2ms的时候, 插入一个延时时间为22ms的任务, 这个任务的过期时间就是在2ms的基础上加22ms，也就是24ms，但是显然没有24ms的格子 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1666795703659-bfe1acb2-e215-40f8-9a1f-1af04ada8d64.png#clientId=u6de1b89a-222a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=294&id=YQtLH&margin=%5Bobject%20Object%5D&name=image.png&originHeight=718&originWidth=686&originalType=binary&ratio=1&rotation=0&showTitle=false&size=60811&status=done&style=none&taskId=u296ae728-6e7e-4c84-ac53-cfff32ecef7&title=&width=281",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),t("li",null,[e("第一层的时间轮装不下的时候，任务就会放入第二层的时间轮格子中 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666884189916-3f626406-06ff-47f1-b023-0a14e6951e65.gif#clientId=ue18a4c05-0a4a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=319&id=MIzh1&margin=%5Bobject%20Object%5D&name=640-2.gif&originHeight=637&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=81697&status=done&style=none&taskId=u7636cdc4-1715-4d4c-b05a-6401369f20c&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),t("li",null,[e("当第二层时间轮上的任务到期后，就会执行时间轮的降级，原本超时时间为24ms的任务会被从第二层取出来，放入第一层到期时间为24ms的格子中 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/gif/39156604/1666884621506-c2228e08-252e-414d-ba5c-dc3c6febd6d5.gif#clientId=ue18a4c05-0a4a-4&crop=0&crop=0&crop=1&crop=1&from=ui&height=319&id=EHub5&margin=%5Bobject%20Object%5D&name=640-3.gif&originHeight=637&originWidth=640&originalType=binary&ratio=1&rotation=0&showTitle=false&size=492485&status=done&style=none&taskId=u1d5565ee-4bb1-40a2-8cb0-cd9dfddc80f&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),t("li",null,[e("从这里可以看出时间轮的巧妙之处，两层时间轮只用了40个数组元素，却可以承载[0-399s]的定时任务。而三层时间轮用60个数组元素，就可以承载[0-7999s] 的定时任务 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1666884813972-bc21201c-42c3-42e4-adc9-3e74ce1899e4.png#clientId=ue18a4c05-0a4a-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=304&id=wccxQ&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1026&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258318&status=done&style=none&taskId=u4bd05c7a-58c3-49d0-b842-a9eb8874535&title=&width=320",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),_]),T,x,I,A,t("ol",null,[S,w,t("li",null,[t("p",null,[e("TimerLog与TimerWheel的协作如下图所示 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1667225942409-b7c21a9e-696e-469f-bce2-1264f34e8984.png#clientId=u8922e004-42d1-4&crop=0&crop=0&crop=1&crop=1&from=paste&id=u68d1f375&margin=%5Bobject%20Object%5D&name=image.png&originHeight=347&originWidth=594&originalType=binary&ratio=1&rotation=0&showTitle=false&size=28052&status=done&style=none&taskId=u3d39f27b-4f0c-448a-ac44-e4b51b57193&title=",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})])]),t("li",null,[t("p",null,[e("消息的存储工作流程如下： "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1667226406110-d5a6b5b8-c30f-4240-8bd6-0243c6d00d6b.png#clientId=u33cec491-c86d-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=331&id=u336950de&margin=%5Bobject%20Object%5D&name=image.png&originHeight=661&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52960&status=done&style=none&taskId=u3ca0708f-2e3c-4f4b-baff-561faa998a9&title=&width=540",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),z])]),j,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/39156604/1666888928358-033cca85-b9ac-4d94-94fd-160d83bac3ba.png#clientId=u06401f96-c50e-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=372&id=u40309fb4&margin=%5Bobject%20Object%5D&name=image.png&originHeight=744&originWidth=581&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37909&status=done&style=none&taskId=ua3283353-c147-4554-81c0-17f8d56ee83&title=&width=290.5",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),C,D,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667220447378-24e397ad-a285-40dd-9047-88803459af4a.png#clientId=ud471318f-e47b-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=1455&id=u7ee5a91b&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1455&originWidth=2971&originalType=binary&ratio=1&rotation=0&showTitle=false&size=149879&status=done&style=none&taskId=u3841ca9f-2858-4740-8fd8-585f899378c&title=&width=2971",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 既然把消息轨迹当成消息存储在Broker服务器，那存储消息轨迹的Topic如何确定呢？RocketMQ提供了两种方法来定义消息轨迹的Topic。")]),B,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/__puml/e43f0a1abf02d76ab7097deea0187b2d.svg#lake_card_v2=eyJ0eXBlIjoicHVtbCIsImNvZGUiOiJzZW5kZXIgLT4gYnJva2VyXG5icm9rZXIgLT4gZGIgOiBzYXZlIG1zZ1xuYnJva2VyIC0tPiBzZW5kZXIgOiBhY2svbmFja1xuYnJva2VyIC0-IHJlY2VpdmVyXG5yZWNlaXZlciAtLT4gYnJva2VyIDogYWNrL25hY2tcbmJyb2tlciAtPiBkYiA6IGRlbGV0ZSBtc2ciLCJ1cmwiOiJodHRwczovL2ludHJhbmV0cHJveHkuYWxpcGF5LmNvbS9za3lsYXJrL2xhcmsvX19wdW1sL2U0M2YwYTFhYmYwMmQ3NmFiNzA5N2RlZWEwMTg3YjJkLnN2ZyIsImlkIjoiYm1QU0IiLCJtYXJnaW4iOnsidG9wIjp0cnVlLCJib3R0b20iOnRydWV9LCJjYXJkIjoiZGlhZ3JhbSJ9",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e("##### 数据备份和故障转移 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666871933931-97904c34-ab95-4778-9266-8a724d652213.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=242&id=ue475ed04&margin=%5Bobject%20Object%5D&name=image.png&originHeight=483&originWidth=1037&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59699&status=done&style=none&taskId=u85dd854e-7f54-4fe9-8d6c-addca350b18&title=&width=518.5",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),O,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666873658825-a41e31e0-f7dd-44e7-910c-f1a497841dd2.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=153&id=ubf45f24c&margin=%5Bobject%20Object%5D&name=image.png&originHeight=306&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&size=155906&status=done&style=none&taskId=ud3f002cb-af85-4049-9add-af69a19790c&title=&width=540",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" LogEndOffset：每个partition的log最后一条Message的位置。 HighWatermark：取最小LEO，consumer能够看到的此partition的位置。")]),q,P,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874105184-a225b43d-bbc7-4cea-8f4f-cb05291be5c7.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=432&id=ucafb9bc6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=863&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=189782&status=done&style=none&taskId=uac12c40c-6569-448a-8259-d74addcb9f2&title=&width=750",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874115020-9996005b-36a2-4f0a-8051-824c5dd11908.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=427&id=u415102c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=853&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=183715&status=done&style=none&taskId=u05425056-2410-46d7-81fa-5cea881538c&title=&width=750",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),L,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20441/1666874264460-8cbf0497-6148-4bea-bf87-49a800ef3d51.png#clientId=uecce1891-4c1f-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=264&id=u655e9fe8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=528&originWidth=646&originalType=binary&ratio=1&rotation=0&showTitle=false&size=113276&status=done&style=none&taskId=u89e9f7da-7792-4ca4-b578-3412e933ab6&title=&width=323",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),M,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1666927224363-d5f358d6-4c94-4714-999a-d247de701a1b.png#clientId=ue9277cdc-a3a4-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=357&id=u919d22b6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=357&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=74259&status=done&style=none&taskId=u7baec6c9-8d01-4648-8a19-0f428f8915e&title=&width=750",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 在2.0的模型中将normal message table拆分为了多个表，并且在逻辑上组成了一个环，按照时间进行写入表的切换，并且定期批量的进行过期表中的数据删除。消息投递之后只会记录 checkpoint，标记哪些消息已经可以删除了，而不会真正执行 normal message table 中的数据删除，从而避免了频繁的插入和删除操作。可以简单的理解为2.0的模型写入就是不断的 Append 消息（checkpoint 可以理解为 offset），投递就是不断的推进checkpoint，删除是批量的对过期的表（不再进行读写）进行删除。")]),t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1666755832767-cae32c00-2718-4c29-b71e-1ef860b3eb73.png#clientId=u33216851-4002-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=606&id=u16911af2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=757&originWidth=1500&originalType=binary&ratio=1&rotation=0&showTitle=false&size=314793&status=done&style=none&taskId=u5872799b-7230-4dd4-b8c1-db8cc3cd08e&title=&width=1200",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" MsgBroker 2.0的计算模型设计中采用了全异步的模型，对各个开销较高的操作都做了异步化，比如msg-write-threads（消息写入线程池）仅负责消息写入时的业务逻辑，并不处理持久化操作。持久化操作是耗时的，由msg-flush-threads批量进行持久化，这样能使 msg-write-threads 更快的去处理更多的写入请求。基于这样的设计，能对各个阶段不同的线程池做精细化的配置，提升资源利用率和整体的性能。")]),H,t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667303564561-2f07e1f6-7659-42fd-af1c-e6158b2b660d.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u0afcf2aa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=540&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=151090&status=done&style=none&taskId=u69fe3af1-8ba5-496f-b9cd-2e6f00ec9b2&title=&width=750",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),v,t("p",null,[e("为了提升整体的吞吐量与提供跨副本组的高可用能力，RocketMQ 服务端一般会为单个 Topic 创建多个逻辑分区，即在多个副本组上各自维护部分分区 ( Partition)，我们把它称为队列 (MessageQueue)。同一个副本组上同一个 Topic 的队列数相同并从 0 开始连续编号，不同副本组上的 MessageQueue 数量可以不同。 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667211128802-1ebe1226-c430-4b6b-a95b-64ae84602146.png#clientId=u732f2838-f0ad-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=610&id=u13a63bf6&margin=%5Bobject%20Object%5D&name=image.png&originHeight=610&originWidth=750&originalType=binary&ratio=1&rotation=0&showTitle=false&size=217091&status=done&style=none&taskId=u1a163547-d3c6-45a3-bacb-68c9b9605a3&title=&width=750",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 每个Topic在Broker上会划分成几个逻辑队列，每个逻辑队列保存一部分消息数据。从上面模型可以看出，要解决消费并发，就是要利用Queue,一个Topic可以分出更多的queue,每一个queue可以存放在不同的硬件上来提高并发。")]),W,t("p",null,[e("在RocketMQ中消息刷盘主要可以分为同步刷盘和异步刷盘两种。 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667301973880-fbab5567-a642-42b6-8ead-7fa8e666e23d.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=540&id=u5e5e4647&margin=%5Bobject%20Object%5D&name=image.png&originHeight=908&originWidth=583&originalType=binary&ratio=1&rotation=0&showTitle=false&size=48292&status=done&style=none&taskId=u1e3a47a0-19e3-4baa-b8f2-559591abd3e&title=&width=347",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 消息写入内存的PAGECACHE后，立刻通知刷盘线程刷盘，然后等待刷盘完成，刷盘线程执行完成后唤醒等待的线程，返回消息写成功的状态。")]),t("p",null,[i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667302024113-a2ca21dc-b78c-4e84-a005-2a84c19c0f75.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=592&id=ud39bf6fa&margin=%5Bobject%20Object%5D&name=image.png&originHeight=906&originWidth=542&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49898&status=done&style=none&taskId=uc5830126-bfa6-4900-9880-40955d7f100&title=&width=354",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"}),e(" 在返回写成功状态时，消息可能只是被写入了内存的PAGECACHE，写操作的返回快，吞吐量大；当内存里的消息量积累到一定程度时，统一触发写磁盘操作，快速写入。")]),V,t("p",null,[e("批量消息是指将多条小的消息合并成一个批量消息，一次发送出去。这样的好处是可以减少网络IO，提升吞吐量。 比如说原本我有三条消息,如果三条消息分三次发的话,会走三次网络IO,如果我给三条消息整成一起发送,这样就走一次网络了。 "),i(a,{src:"https://intranetproxy.alipay.com/skylark/lark/0/2022/png/20156646/1667304196521-865cb3ee-ab0d-4c62-90e5-7b6cf5bff2f4.png#clientId=ub92ab98a-bea2-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=846&id=uec728440&margin=%5Bobject%20Object%5D&name=image.png&originHeight=846&originWidth=1402&originalType=binary&ratio=1&rotation=0&showTitle=false&size=220474&status=done&style=none&taskId=u2ccac6c3-73d4-409a-9418-120c3c6ec4c&title=&width=1402",alt:"",style:{"max-height":"400px"},loading:"lazy",fit:"contain"})]),E])}const U=o(c,[["render",N]]);export{Z as __pageData,U as default};