# 代码功能

主逻辑就是遍历fiber树

## mount

### 首先beginWork和completeWork有两个参数

  current: workInProgress.alternate || null, // current树
  workInProgress: fiber, // workInProgress树
  我们目前操作的是workInProgress树；对比的是current树；

### 第一次mount的处理流程-beginWork

入口：[beginWork](./beginWork.ts#L3077)

1.首先根据不同的fiber节点类型，调用不同的处理函数；具体代码我目前并没有深入研究；甚至上只知道这是个switch语句，具体干嘛了一点不清楚 <br/>
 [switch (workInProgress.tag)](./beginWork.ts#L3298) <br>
    比如：如果是函数组件，会调用[FunctionComponent](./beginWork.ts#L3317)函数；<br/>

 2.进入reconcileChildren函数<br/>
  [reconcileChildren](./beginWork.ts#L1122) <br>
    当然，有子节点的时候，或者函数，类组件的返回值等情况下才会进入<br/>
    2.1在recocileChildren方法中我们对child类型进行判断，然后执行不同的方法；<br/>
        生成fiber子节点；子节点的alternate（fiber.child.alternate）就是在这里设置的；
        这块就涉及到我们面试会问到的diff算法逻辑；

### 第一次mount的处理流程-completeWork

入口： [completeWork](./completeWork.ts#L675)

1.首先我们也是根据Fiber的tag节点类型，调用不同的处理函数；[switch (workInProgress.tag)](./completeWork.ts#L682)<br/>
2.[const instance = createInstance(](./completeWork.ts#L795)
  1.创建dom节点
3.将dom节点插入到父节点中；[parentNode.appendChild](./completeWork.ts#L802)
  appendAllChildren：将已经创建好的子dom节点，挂载到当前节点下；
  
### update的处理流程-beginWork

入口：[beginWork](./beginWork.ts#L3077)

  区别代码：
    1.React 会比较当前 Fiber 节点和其上一次渲染所对应的 Fiber 节点。如果两者类型相同且具有相同的 key 和 type，则将上一次渲染的 Fiber 节点作为当前节点的 current 值。
    2.如果可以直接使用，就直接使用current节点；不用新建；

### update的处理流程-completeWork

  复用dom节点的逻辑：
    1.在completeWork方法中，我们会根据不同的情况，复用dom节点；
    2.如果是HostComponent类型，我们会把组件的变化放到updatePayload中；等到commit阶段再统一处理；

### 打effectTag

    在beginWork方法中，我们会根据不同的情况打effectTag；让commit阶段知道我们需要做什么；
    在completeWork方法中，所有有effectTag的fiber节点都会被收集到effect链表中；

## beginWork阶段

1.在beginWork阶段，主要是传入当前fiber节点，然后生成子fiber节点；建立fiber关联关系；
    1.当前fiber节点的数据也会被更新；如果他自己没有alterante节点，会创建一个新的fiber节点；如果他有alterante节点，会复用这个节点；
2.在completeWork阶段
  1.如果有alterante节点，会复用dom节点；否则创建dom节点，然后将子dom节点挂载到dom树上；
  2.将effectTag的fiber节点，收集到effect链表中；

### 语言描述

  beginWork阶段：
    1.bgeinWork阶段主要是创建fiber节点，然后将fiber节点

### 有个小疑问？
  
  1.复用fiber节点时候，同时在completeWork中复用dom节点；不会存在问题吗？
    答案：不会，因为这个dom能被复用，说明他的父节点一直到根节点也是被复用的；要不然不存在只有某个单独的节点被复用的情况；
    主要是因为：commit阶段是同步执行的，整个dom更新是同步的，所以不会存在一个dom节点被两个树使用；
