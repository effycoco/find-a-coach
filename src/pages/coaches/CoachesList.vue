<template>
  <div>
    <base-dialog :show="!!error" title="An error occured!" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <coach-filter @change-filter="setFilters"></coach-filter>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button v-if="!isLoggedIn" link to="/auth?redirect=register"
            >Log in to Register as Coach</base-button
          >
          <base-button
            v-if="!isCoach && !isLoading && isLoggedIn"
            link
            to="/register"
            >Register a Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filteredCoaches"
            :coach="coach"
            :key="coach.id"
          ></coach-item>
        </ul>

        <h3 v-else>No Coaches Found</h3>
      </base-card>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CoachItem from './CoachItem.vue';
import CoachFilter from './CoachFilter.vue';
export default {
  data() {
    return {
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
      isLoading: false,
      error: false,
    };
  },
  components: {
    CoachItem,
    CoachFilter,
  },
  computed: {
    ...mapGetters('coaches', {
      hasCoaches: 'hasCoaches',
      isCoach: 'isCoach',
    }),
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    filteredCoaches() {
      const coaches = this.$store.getters['coaches/coaches'];
      return coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
      });
    },
  },
  created() {
    this.loadCoaches();
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      // 由于loadCoaches这个action是异步函数，它也返回一个promise, 所以它前面可以加 await, 等这个promise resolved之后才会进行下一步即更改isLoading
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          forceLoad: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Something went wrong!';
      }

      this.isLoading = false;
    },
    handleError() {
      this.error = false;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
