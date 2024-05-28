// Update 对象
const update = {
    // 更新执行的函数
    action,
    // 与同一个Hook的其他更新形成链表
    next: null,
};


// 将update组成环状单向链表
function dispatchAction(queue, action) {
    // 创建update
    const update = {
        action,
        next: null,
    };

    // 环状单向链表操作
    if (queue.pending === null) {
        update.next = update;
    } else {
        update.next = queue.pending.next;
        queue.pending.next = update;
    }
    queue.pending = update;

    // 模拟React开始调度更新
    schedule();
}