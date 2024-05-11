import { createDom } from './react-dom.js'
// 这个函数是基于React的Fiber Reconciler的实现，用于构建Fiber树
// 执行当前工作单元，返回下个工作单元
export function performUnitOfWork(fiber, deletions) {
  // 当前fiber没有真实DOM节点时，创建真实DOM节点
  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  const elements = fiber.props.children
  reconcileChildren(fiber, elements, deletions) // 构建Fiber树，同时进行层级比较，找出需要更新的节点

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


/**
 * 
 * 这是将虚拟DOM转换为Fiber树的函数，同时标记需要更新的节点
 *  进行层级比较，找出需要更新的节点
 * 
 * @param {父节点fiber} wipFiber 
 * @param {子节点数组} elements 
 */

function reconcileChildren(wipFiber, elements, deletions) {
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