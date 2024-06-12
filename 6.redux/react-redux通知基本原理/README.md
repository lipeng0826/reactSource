# React-Redux 基本使用原理

## React-redux 的使用参考 ReactLearn 项目中的 Redux 章节

    1.React-redux使用React的context特性，将store传递给所有子组件，这样所有子组件都可以通过context获取store。

```jsx
import { Provider } from "react-redux";
import store from "./store";
import Counter from "./Counter.js";

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);

export default App;
```

    2.class组件通过connect函数连接store，将store中的数据作为props传递给组件。

```jsx
import React from "react";
import { connect } from "react-redux";

const Counter = (props) => {
  const increment = () => {
    props.dispatch({ type: "INCREMENT" });
  };

  const decrement = () => {
    props.dispatch({ type: "DECREMENT" });
  };

  return (
    <div className="counter">
      <h2>Counter</h2>
      <div>
        <button onClick={decrement}>-</button>
        {/* props读取state的值 */}
        <span className="count">{props.count}</span>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};

// 添加这个函数:
function mapStateToProps(state) {
  return {
    count: state.count,
  };
}

// 高阶函数将组件包裹起来，connect注册state变化事件，然后更新子组件
export default connect(mapStateToProps)(Counter);
```

    3.在函数组件中使用useSelector和useDispatch来获取store中的数据和dispatch方法。

```jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const Counter = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  const increment = () => dispatch({ type: "INCREMENT" });
  const decrement = () => dispatch({ type: "DECREMENT" });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
```

### 其他疑问

为什么使用useSelector的方式，还要使用Provider包一下呢？

  1.因为这个Redux出现的背景就是为了解决组件之间的数据传递问题，正常多个组件之间应该使用的是同样的数据，所以需要使用Provider包一下，这样所有的组件都可以使用同一个store。
  2.如果我们不包一下，那么每个组件都需要使用useSelector来获取store，这样就会导致每个组件都会创建一个store，这样就会导致数据不一致的问题。或者我们还需要其他方案来解决这个问题。
