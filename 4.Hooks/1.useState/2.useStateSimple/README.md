# useStateSimple

大概的数据图：<https://www.processon.com/diagraming/6655751b411e09121081c0ae>

1.在渲染到某个fiber节点的时候，我们会创建一个hook对象；这个对象会被放到fiber.memoizedState链表上；
2.当我们调用useState的时候，我们会创建一个hook对象；这个对象会被放到当前hook.queue的链表上，以环状链表的形式；
