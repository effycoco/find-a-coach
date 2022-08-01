let timer; // 确保只有一个timer同时运行
export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false, // true表示刚刚自动登出了，要重定向至首页
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      console.log(`set didAutoLogout from ${state.didAutoLogout} to false`);
      console.log(payload);

      state.didAutoLogout = false; // 自动登出时被设为true，再次登录时重置为false，这样再自动登出时才能被App组件里的watch监测到
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async auth(context, payload) {
      // 默认用登录endpoint
      let endpoint =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCN6_-5ILUgxl2i3FuqGMS66-3rYsVWlb4';
      if (payload.mode === 'signup') {
        endpoint =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCN6_-5ILUgxl2i3FuqGMS66-3rYsVWlb4';
      }

      const response = await fetch(
        // endpoint found in doc
        endpoint,
        {
          method: 'POST',
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );
      const responseData = await response.json();
      console.log('responseData', responseData);
      // 重复注册时，responseData.error.message='EMAIL_EXISTS'
      if (!response.ok) {
        const error = new Error(
          responseData.error.message || 'Failed to authenticate'
        );
        throw error;
      }

      const expiresIn = +responseData.expiresIn * 1000; // token有效期，毫秒；+将字符串转为数字
      const expiresDate = new Date().getTime() + expiresIn; // token将在这个时间点过期
      // console.log(expiresIn);
      timer = setTimeout(function () {
        context.dispatch('autoLogout');
        //  console.log( `auto log out after log in, token expiresIn given by server`);
      }, expiresIn);

      localStorage.setItem('token', responseData.idToken);
      localStorage.setItem('userId', responseData.localId);
      localStorage.setItem('expiresDate', expiresDate);

      context.commit('setUser', {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    tryLogin(context) {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const expiresDate = localStorage.getItem('expiresDate'); // 应过期日期，以从1970年零点到该时间的毫秒数表示
      const expiresIn = +expiresDate - new Date().getTime(); // 距离token过期剩下的时间
      if (!expiresIn > 0) {
        return; // 如果已经过期，取消自动登录,不用expiresIn<0是因为当localStorage没有expiresDate数据时也应该返回 NaN>0->false NaN<0->false
      }
      console.log(expiresIn);
      timer = setTimeout(function () {
        context.dispatch('autoLogout');
        console.log(
          `auto log out after try auto login, expires in ${expiresIn}`
        );
      }, expiresIn);
      if (token && userId) {
        console.log('auto login');
        context.commit('setUser', {
          token,
          userId,
          tokenExpiration: null,
        });
      }
    },
    autoLogout(context) {
      context.dispatch('logout');
      context.commit('setAutoLogout');
      console.log('auto logout is invoked');
    },
    logout(context) {
      clearTimeout(timer);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      context.commit('setUser', {
        token: null,
        userId: null,
      });
    },
  },
};
