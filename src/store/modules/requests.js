export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  getters: {
    requests(state, _, _2, rootGetters) {
      const userId = rootGetters.userId;
      return state.requests.filter((req) => req.coachId === userId);
    },
    hasRequests(state, getters) {
      return getters.requests && state.requests.length > 0;
    },
  },
  mutations: {
    addRequest(state, newRequest) {
      state.requests.push(newRequest); // 用户添加request时先存储到服务器，再存储到本地
    },
    setRequests(state, requests) {
      state.requests = requests; // 把本地requests设成从服务器获取的requests, 在组件created时调用
    },
  },
  actions: {
    async addRequest(context, payload) {
      const newRequest = {
        message: payload.message,
        userEmail: payload.email,
      };
      const response = await fetch(
        `https://find-a-coach-e199d-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        {
          method: 'POST', // just add new request, not overwrite the existing data, 'put' will overwrite
          body: JSON.stringify(newRequest),
        }
      );

      const responseData = await response.json(); //

      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to send request.'
        );
        throw error;
      }

      newRequest.id = responseData.name; // post到服务器上后，服务器会自动添加一个name属性
      newRequest.coachId = payload.coachId;

      context.commit('addRequest', newRequest);
    },
    async fetchRequests(context) {
      const coachId = context.rootGetters.userId; // 只获取服务器上的这个id下的requests
      const response = await fetch(
        `https://find-a-coach-e199d-default-rtdb.firebaseio.com/requests/${coachId}.json`
      );
      const responseData = await response.json();
      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to send request.'
        );
        throw error;
      }
      const requests = [];
      for (let key in responseData) {
        const request = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(request);
      }
      context.commit('setRequests', requests);
    },
  },
};
