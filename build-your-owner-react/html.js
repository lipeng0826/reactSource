import { createElement } from "./createElement.js";

// 模拟react的createElement方法
const React = {
  createElement
};

// *******jsx解析之后的代码********

const updateValue = e => {
  console.log(e.target.value);
};
const element = /*#__PURE__*/React.createElement("div", {
  id: "foo"
}, /*#__PURE__*/React.createElement("a", null, "bar"), /*#__PURE__*/React.createElement("input", {
  onInput: updateValue
}));
// *******jsx解析之后的代码********

function App(props) {
  return /*#__PURE__*/React.createElement("h1", null, "Hi ", props.name);
}

// *******jsx解析之后的代码********

function App2(props) {
  return /*#__PURE__*/React.createElement("h1", null, "Hi ", props.name);
}
const element2 = /*#__PURE__*/React.createElement(App2, {
  name: "foo"
});


export default element2;