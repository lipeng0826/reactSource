/**
 *
 * 实现一个useState函数到Udpate的逻辑
 *
 * 这个的主要逻辑是：
 *  1.写一个useState函数
 *  2.在setState函数中创建一个Update对象
 *  3.在dispatchAction函数中执行Update对象的action
 *
 */

let isMount = false; // 是否已经挂载
let workInProgressHook = null; // 当前的hook

const fiber = { // fiber节点
    memoizedState: null,
    stateNode: App,
};

// 声明useState
function useState(initialState) {
    let hook;

    if (isMount) {
        // 初始化hook
        hook = {
            queue: {
                pending: null,
            },
            memoizedState: initialState,
            next: null,
        };
        if (!fiber.memoizedState) {
            fiber.memoizedState = hook;
        } else {
            workInProgressHook.next = hook; // 建立链表
        }
        workInProgressHook = hook;
    } else {
        // 更新时
        hook = workInProgressHook;
        // 指向下一个hook
        workInProgressHook = workInProgressHook.next;
    }

    // 通过执行队列中的action来更新state
    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        let firstUpdate = hook.queue.pending.next;

        do {
            const action = firstUpdate.action;
            baseState = action(baseState);
            firstUpdate = firstUpdate.next;
        } while (firstUpdate !== hook.queue.pending.next);

        hook.queue.pending = null;
    }
    // 更新memoizedState
    hook.memoizedState = baseState;

    // 返回一个数组，第一个元素是state，第二个元素是dispatchAction，这样调用setState时就可以直接调用dispatchAction
    return [baseState, dispatchAction.bind(null, hook.queue)];
}

function run() {
    workInProgressHook = fiber.memoizedState;
    const app = fiber.stateNode();
    isMount = false;
    return app;
}

// 使用方式
function App() {
    const [state, setState] = useState(0);
    return {
        onClick: () => {
            setState(state + 1);
        },
    };
}
