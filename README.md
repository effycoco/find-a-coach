# 材料

udemy vue 课程 - Section 16

# 打算改进的地方

- 表单验证
  当前是提交表单时验证，假如某栏没有填写，提交时该项对应元素添加上`invalid`class，把鼠标移至该项又移出，即使该项还是空白， `invalid` class 会被移除，只有再次提交表单时才会再验证从而重新加上 `invalid` class。这个逻辑可能需要改进。让必填项只有填了才会清除 `invalid` class。
- contact 页面的 contact 按钮是多余的

# 说明

251 节 这一步做的是在存储新教练数据时，存储到后端（PUT），仅仅是在 coach module 添加 registerCoach action 以便使用 async await 异步函数。
252 节 在显示教练列表时，从后端获取数据，而不是单纯显示存在 state.coaches 里的固定预存数组。由于从后端获取也是异步操作，还是要放在 actions 里面，在 action 里用新注册后存在后端里的 coaches 覆盖初始的 dummy coaches，而 actions 也要通过 mutations 间接改变 state. 这步新建的 action 是 loadCoaches，那要在什么地方使用呢，首先 CoachList 组件刚加载时应该调用，其次是按刷新按钮时，所以在 CoachList 新增 method 来 dispatch loadCoaches，然后分别在 created()和 refresh button onclick 时调用这个 method.

256 现在把本地 vuex 存储数据的功能都搬到了服务器上，每次加载页面都是从服务器重新获取，这时本地的 store 在存储数据方面是没用的。现在我们想要在本地利用 vuex 缓存，仅在固定间隔（一分钟）后和刷新时才重新获取服务器数据。
257 添加过渡效果：错误提示框弹出时、router-view 在不同组件切换时（仅最外层）。如果在 router-view 里用`<transition>`，在 transition 里用`<component>`，里面的组件必须只有一个根元素，因为`<transition>`只能有一个子元素，否则会警告`Component inside <Transition> renders non-element root node that cannot be animated.`。
