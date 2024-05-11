// 将虚拟DOM转换为真实DOM
import { performUnitOfWork } from "./unitWork.js"
import { commitWork } from "./react-dom.js"

function commitRoot() {
  deletions.forEach(commitWork) // 删除标记为删除的节点
  commitWork(wipRoot.child) // 递归操作所有的节点（增，删，改），真正操作DOM
  currentRoot = wipRoot // 将当前根节点设置为工作根节点
  wipRoot = null // 清空工作根节点
}

export function render(element, container) {
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
// 根节点
let wipRoot = null
// 当前根节点
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