// 将虚拟DOM转换为真实DOM
// import { performUnitOfWork } from "./unitWork.js"
import { commitWork, createDom } from "./react-dom.js"

function commitRoot() {
  deletions.forEach(commitWork) // 删除标记为删除的节点
  commitWork(wipRoot.child) // 递归操作所有的节点（增，删，改），真正操作DOM
  currentRoot = wipRoot // 将当前根节点设置为工作根节点
  wipRoot = null // 清空工作根节点
}

export function render(element, container) {
  /**
   * 工作单元是为了实现渲染的时候不阻塞主线程，将渲染任务拆分为多个任务，每个任务执行时间不超过16ms
   * 使用fiber架构，将任务拆分为多个工作单元，每个工作单元是一个fiber对象
   */
  // 设置下一个工作单元
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 将render拆分为每个工作单元
let nextUnitOfWork = null
// 根节点，每次更新时的根节点
let wipRoot = null
// 最后一次fiber树
let currentRoot = null
// 删除节点的数组
let deletions = null

// 使用循环调用requestIdleCallback来执行工作单元
function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork, deletions
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  // 如果没有下一个工作单元，且有根节点，执行更新dom操作
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}
// 这是一个原生API，它会在浏览器空闲时调用一个函数，新的react版本已经不再使用这个API
requestIdleCallback(workLoop)

// 这个函数是基于React的Fiber Reconciler的实现，用于构建Fiber树
// 执行当前工作单元，返回下个工作单元
export function performUnitOfWork(fiber) {

  const isFunctionComponent =
    fiber.type instanceof Function

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  // 如果有子节点，返回子节点
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    // 如果有兄弟节点，返回兄弟节点
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

let wipFiber = null
let hookIndex = null

function updateFunctionComponent(fiber) {
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hooks = []
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}


export function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  }

  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}

// ​更新原生标签组件
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber, fiber.props.children)
}


/**
 * 
 * 这是将虚拟DOM转换为Fiber树的函数，同时标记需要更新的节点
 *  进行层级比较，找出需要更新的节点
 * 
 * @param {父节点fiber} wipFiber 
 * @param {子节点数组} elements 
 */

function reconcileChildren(wipFiber, elements) {
  let index = 0
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child // 旧fiber的子节点
  let prevSibling = null


  while (
    index < elements.length ||
    oldFiber != null
  ) {
    const element = elements[index]
    let newFiber = null

    // 判断是否需要更新节点
    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    if (sameType) {
      // 更新节点
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if (element && !sameType) {
      // 添加节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if (oldFiber && !sameType) {
      // 删除节点
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else if (element) {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}