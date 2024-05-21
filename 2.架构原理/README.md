# 了解原理

## 做事都要有目的

    这个学习的主要目的是了解原理，不需要熟悉源码，只需要了解原理即可。

    参考文档：https://react.iamkasong.com/

## 还是从最基本的开始

```jsx
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

    在这个最基本的react代码中：
        1. 第一行我们写了一个jsx语法表示的dom节点；
           1. jsx就是一种语法糖，用来简化描述dom节点；最终会被编译成js对象；
        2. 第二行我们获取了一个dom节点；作为容器；
        3. 第三行我们把jsx语法渲染到dom节点中；

## 我们已经学过了第一章，实现一个最简单的react代码，所以对react流程有了一个基本的概念，那么我们结合基础知识然后对代码进行稍微深入
