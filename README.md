# 材料

[Udemy Vue 课程](https://www.udemy.com/course/vuejs-2-the-complete-guide/) - Section 16 & 17 & 18

# 说明

251 节 这一步做的是在存储新教练数据时，存储到后端（PUT），仅仅是在 coach module 添加 registerCoach action 以便使用 async await 异步函数。

252 节 在显示教练列表时，从后端获取数据，而不是单纯显示存在 state.coaches 里的固定预存数组。由于从后端获取也是异步操作，还是要放在 actions 里面，在 action 里用新注册后存在后端里的 coaches 覆盖初始的 dummy coaches，而 actions 也要通过 mutations 间接改变 state. 这步新建的 action 是 loadCoaches，那要在什么地方使用呢，首先 CoachList 组件刚加载时应该调用，其次是按刷新按钮时，所以在 CoachList 新增 method 来 dispatch loadCoaches，然后分别在 created()和 refresh button onclick 时调用这个 method.

256 现在把本地 vuex 存储数据的功能都搬到了服务器上，每次加载页面都是从服务器重新获取，这时本地的 store 在存储数据方面是没用的。现在我们想要在本地利用 vuex 缓存，仅在固定间隔（一分钟）后和刷新时才重新获取服务器数据。

257 添加过渡效果：错误提示框弹出时、router-view 在不同组件切换时（仅最外层）。如果在 router-view 里用`<transition>`，在 transition 里用`<component>`，里面的组件必须只有一个根元素，因为`<transition>`只能有一个子元素，否则会警告`Component inside <Transition> renders non-element root node that cannot be animated.`。

## Authentication

262 将部分数据锁定权限，coaches reading to all, requests writing to all while coaches adding and requests reading is restricted. 这是在后端服务器修改读写规则实现的。

263 增加注册和登录页面

264 在服务器端启用邮箱登录；谷歌搜索 firebase auth rest api -> sign up/in with email/password, 获得向服务器发送登录数据的 endpoint; 我们将使用 vuex 存储登录信息，所以不是直接从组件里向服务器发送登录数据，而是通过 vuex。vuex 中新增 auth module, 并将管理 userId 的 state 和 getters 从根商店移至 auth module 中，由于不采用独立命名空间，因此代码挪动后无需改变。

265 在 auth module 中写注册的逻辑（actions-signup 及对应的 mutation 和 state）；在 UserAuth 组件中 signup mode 下提交表格时调用。

266 增加 sign up 提交后的 loading spinner 和 error handling

267 在 auth module 和 UserAuth 组件写登录的逻辑，与注册几乎完全一致，仅需修改 endpoint 的 URL。

268 由于设置了 coaches write 权限为`auth!=null`, 现在在任何时候试图注册教练都会失败，想要在登录后成功注册教练就要在相关 action 里在 endpoint 链接尾端添加`?auth=[token]`。同理还有获取 requests 列表 的 action。添加后再注册教练或者获取 request 列表就不会报错了。

269 在页面给'/auth'增加一个入口，比如 login 按钮，并在未登录时隐藏 register 和 request button。

270 添加登出按钮及相应逻辑。由于服务器不会存储当前是谁登录了，这个信息存储在本地，服务器只存储有哪些用户可以登录。所以登出不需要向服务器发送请求，只需要 clear 本地 store 里因为登录产生的数据。

271 登录或登出后重定向至首页，只需要在相应的组件中在操作成功后添加`this.$router.replace('/')`, 这种方法简单但是无法处理不同情况，比如用户在首页 card 内点击登录目的是注册教练，那重定向至注册教练页面比较好，但首页的两个登录入口指向同一个`/auth`页，要想根据来路不同重定向至不同的页面需要在两个入口按钮的 to 属性添加 query param 来区分：`to="/auth?redirect=register"` vs. `to="/auth?redirect=coaches"` (query 参数名称自定义)。然后在 UserAuth 组件里就可以根据`this.$route.query.redirect`的值来确定不同的重定向链接了。但这样仍存在的问题是虽然未登录用户看不见注册为教练的 button 入口，但仍可在地址栏手动输入`/register`到达该注册页面，虽然提交表单时会报错，但最好使用户不能访问这个页面;解决方案是利用 navigation guards; 详见 router.js 文件。

272 增加自动登录。解决刷新页面之前的登录信息会消失的问题，让用户保持登录状态，不必反复输入密码。利用 localStorage; 应在 App 组件 dispatch 自动登录的 action，因为这是最早创建的组件，进入所有与本应用有关的地址都会先创建这个组件。所以在该组件创建时分发自动登录 action 就会在进入任何相关地址时先尝试自动登录。首先在登录时通过 localStorage.setItem()将数据存储在本地，在自动登录的 action 里检查本地是否有这些数据，若有，则 commit setUser(即登录)。还需在 logout 里清空数据-`removeItem`，以免点击登出后再刷新又是登录状态。

273 增加自动登出。token 过期后自动登出。登录和自动登录 action 里面 setTimeout(,expiresIn); 登录里是服务器返回的过期时间，自动登录 action 里面过期时间是上次登录的有效期剩余时间（登录后将过期时间存储在本地，自动登录时与当前时间相减）。
另一个问题是，如果自动登出前用户在 requests 列表页面，登出后仍停留在该页，而非登录用户本应看不到该页面的。解决方案是监测自动登出(watch in App)，一监测到自动登出就重定向至首页。为了监测，需要在 vuex 里增加一个 didAutoLogout state, 自动登出是在计时器里触发的，登出是点击 button 触发的，新建一个自动登出 action，里面不仅登出，还要改变 didAutoLogout 的值。同时要在下次登录时将 didAutoLogout 重置（setUser 里）

## 优化/Optimization

278 有些组件并不是所有页面都需要，因此在部分页面需要下载，部分页面不需要下载。下载的代码越少，页面加载越快。所以这些仅在特定页面才用到的组件文件如果异步下载、仅在用到时才下载，而不是和其他文件一同下载（现在是所有文件全部先下载好），将会节省时间。vue 提供的 `defineAsyncComponent() `可实现这点，该函数接受一个回调函数，回调函数应返回导入的组件，但 vue 仅在需要该组件时才调用该回调函数。
It wants a function that in the end returns the imported component, but Vue will only call that function when the component is really needed.
注意使用该函数要先从 vue 导入。

routing 也有类似的用法，某个路径对应的文件不直接导入，而是放在回调函数里，这样只在访问某个路径时才下载该路径用到的文件（实际下载的是与文件代码对应的解析后浏览器能理解的代码）。

```js
// async component
const BaseDialog = defineAsyncComponent(() =>
  import('./components/ui/BaseDialog.vue')
);
//async routing
const ContactCoach = () => import('./pages/requests/ContactCoach.vue');
```

280 Building the project for production. 如果是简单的项目，没用到 vue-cli, 部署项目可直接上传所有文件；如果较为复杂，用到了 vue-cli，在 部署前应先如上节优化代码，然后再 build，该步骤会自动进一步优化代码。手写的代码需要经 build 过程转换成(transform to)普通 JS 代码才能被浏览器理解。
npm run build 后会生成一个 dist 文件夹，存储经转换的代码，部署时只需上传该文件夹里的内容。

# 知识点

## JSON.stringify() vs. response.json()

向服务器传送数据，要将 javascript 对象转换成能传输的 json 格式，使用`JSON.stringify({})`; 而服务器返回的数据也是以 json 格式返回的，要转换成 javascript 对象才能在后续代码中使用它，使用`response.json()`。

# 打算改进的地方

- 表单验证
  当前是提交表单时验证，假如某栏没有填写，提交时该项对应元素添加上`invalid`class，把鼠标移至该项又移出，即使该项还是空白， `invalid` class 会被移除，只有再次提交表单时才会再验证从而重新加上 `invalid` class。这个逻辑可能需要改进。让必填项只有填了才会清除 `invalid` class。
