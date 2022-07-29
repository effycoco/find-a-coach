export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {
    addCoach(state, newCoach) {
      state.coaches.push(newCoach);
    },
    setCoaches(state, coaches) {
      state.coaches = coaches;
    },
    setFetchTimeStamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      // 不加 `state.coaches &&`  会报错，cannot read properties of undefined
      // 加了之后，若没有名为coaches的state, state.coaches evaluates to undefined,
      // undefined && 任何值 evaluates to undefined
      // 返回undefined, 在组件v-if中使用时是falsy value
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true; // 初始状态，应该更新
      }
      const currentTimeStamp = new Date().getTime();
      return currentTimeStamp - lastFetch > 60 * 1000; // 若距上次获取过去了一分钟，就重新获取
    },
  },
  actions: {
    async registerCoach(context, coachInfo) {
      const userId = context.rootGetters.userId;

      const response = await fetch(
        `https://find-a-coach-e199d-default-rtdb.firebaseio.com/coaches/${userId}.json`,
        {
          method: 'PUT', // 为什么用put不用post
          body: JSON.stringify(coachInfo),
        }
      );
      if (!response.ok) {
        // handle error
      }
      context.commit('addCoach', {
        ...coachInfo,
        id: userId,
      });
    },
    async loadCoaches(context, payload) {
      if (!payload.forceLoad && !context.getters.shouldUpdate) {
        //若距上次从服务器获取还不到一分钟，同时forceLoad=false即用户没有按refresh按钮
        return; // 取消获取数据，直接使用本地存储的版本
      }
      // 为什么链接后面要加上/coaches.json, 因为放数据时后面用了/coaches，即在后端数据库建了coaches node
      const response = await fetch(
        'https://find-a-coach-e199d-default-rtdb.firebaseio.com/coaches.json'
      );
      const coachesData = await response.json();
      const coaches = [];
      for (let key in coachesData) {
        let coach = {
          id: key,
          firstName: coachesData[key].firstName,
          lastName: coachesData[key].lastName,
          hourlyRate: coachesData[key].hourlyRate,
          areas: coachesData[key].areas,
          description: coachesData[key].description,
        };
        coaches.push(coach);
      }
      context.commit('setCoaches', coaches);
      context.commit('setFetchTimeStamp'); // 从服务器获取数据后更新时间戳
    },
  },
};
