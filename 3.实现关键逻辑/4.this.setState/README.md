# this.setState

```js
Component.prototype.setState = function (partialState, callback) {
  if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
    {
      throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
    }
  }
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

1.和之前学的一样，就是生成`Update`对象，然后放到`updateQueue`中；
2.然后等调度器时机合适了执行调度工作；
3.这里的`this.updater.enqueueSetState`是一个`enqueueUpdate`的封装；