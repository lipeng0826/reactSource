import { createElement } from "./createElement.js";

// 模拟react的createElement方法
const React = {
  createElement
};

// *******jsx解析之后的代码Start********

const updateValue = e => {
  console.log(e.target.value);
};
const element = /*#__PURE__*/React.createElement("div", {
  id: "foo"
}, /*#__PURE__*/React.createElement("a", null, "bar"), /*#__PURE__*/React.createElement("input", {
  onInput: updateValue
}));
// *******jsx解析之后的代码End********

export default element;