# commit

## before mutation

    1.处理DOM节点渲染/删除后的 autoFocus、blur逻辑
    2.调用getSnapshotBeforeUpdate生命周期钩子
    3.调度useEffect
    注：以上是从[这个文章](https://react.iamkasong.com/renderer/beforeMutation.html#%E8%B0%83%E5%BA%A6useeffect)直接抄的，具体的代码没看，这个代码的性价比不高，不值得看。
    但是我挺好奇useEffect是怎么调度的,但是我不太清楚，有机会看吧；

## mutation

    [这个文章](https://react.iamkasong.com/renderer/mutation.html#update-effect)
    有关于mutation的逻辑的描述；
    我看了下基本和build-your-owner-react一样，就是调用`commitWork`函数，这个函数会根据fiber的effectTag来判断是更新还是删除还是插入；所以细节就不看了；这个面试文档估计也很少；

## layout

    1.这个阶段是在修改完dom之后，但是还没有渲染到屏幕上；

    [这个文章](https://react.iamkasong.com/renderer/layout.html#commitlayouteffects)
    关于layout阶段的描述；
