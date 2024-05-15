// import { render } from "./render.js";
// // import html from "./html.js"; // createElement解析后的代码 - 虚拟DOM
// import { createElement } from "./createElement.js";
// // 模拟react的createElement方法
// const React = {
//     createElement,
//     render,
//     useState
// };

// // *******jsx解析之后的代码********

// const updateValue = e => {
//     rerender(e.target.value);
// };

// const container = document.getElementById("root") // 容器

// const rerender = value => {
//     const element = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
//         onInput: updateValue,
//         value: value
//     }), /*#__PURE__*/React.createElement("h2", null, "Hello ", value));

//     React.render(element, container); // 渲染
// };
// // *******jsx解析之后的代码********
// rerender('world');


import { render, useState } from "./render.js";
import { createElement } from "./createElement.js";

// 模拟react的createElement方法
const React = {
    createElement,
    render,
    useState
};

function Counter() {
    const [state, setState] = React.useState(1);
    return /*#__PURE__*/React.createElement("h1", {
        onClick: () => setState(c => c + 1)
    }, "Count: ", state);
}
const element3 = /*#__PURE__*/React.createElement(Counter, null);

const container = document.getElementById("root")
React.render(element3, container)