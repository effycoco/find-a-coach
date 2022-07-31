import { createStore } from 'vuex';

import coachesModule from './modules/coachesModule';
import requestsModule from './modules/requests';
import authModule from './modules/authModule';

const store = createStore({
  modules: {
    coaches: coachesModule,
    requests: requestsModule,
    auth: authModule,
  },
});

export default store;
