let timer; // 确保只有一个timer同时运行
export default {
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
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

      state.didAutoLogout = false; // 自动登出时被设为true，再次登录时重置为false，这样再自动登出时才能被App组件里的watch监测到
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
    },
  },
  actions: {
    async auth(context, payload) {
      let endpoint;
      if (payload.mode === 'signup') {
        endpoint =
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCN6_-5ILUgxl2i3FuqGMS66-3rYsVWlb4';
      } else {
        endpoint =
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCN6_-5ILUgxl2i3FuqGMS66-3rYsVWlb4';
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
      // console.log(responseData);
      // 重复注册时，responseData.error.message='EMAIL_EXISTS'
      if (!response.ok) {
        const error = new Error(
          responseData.error.message || 'Failed to authenticate'
        );
        throw error;
      }

      const expiresIn = +responseData.expireIn * 1000; // token有效期，毫秒；+将字符串转为数字
      const expiresDate = new Date().getTime() + expiresIn; // token将在这个时间点过期
      timer = setTimeout(() => context.dispatch('autoLogout'), expiresIn);

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
      const expiresDate = localStorage.getItem('expiresDate');
      const expiresIn = expiresDate - new Date().getTime(); // 距离token过期剩下的时间
      if (expiresIn < 0) {
        return; // 如果已经过期，取消自动登录
      }
      timer = setTimeout(() => context.dispatch('autoLogout'), expiresIn);
      if (token && userId) {
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
