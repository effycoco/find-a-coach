<template>
  <li :coach="coach">
    <h3>{{ fullName }}</h3>
    <h4>${{ coach.hourlyRate }}/hour</h4>
    <div>
      <base-badge
        v-for="area in coach.areas"
        :key="area"
        :title="area"
        :type="area"
      ></base-badge>
    </div>
    <div class="actions">
      <base-button link :to="contactLink" mode="outline">Contact</base-button>
      <base-button link :to="detailLink">View Details</base-button>
    </div>
  </li>
</template>

<script>
import BaseBadge from '../../components/ui/BaseBadge.vue';
import BaseButton from '../../components/ui/BaseButton.vue';
export default {
  components: { BaseButton, BaseBadge },
  props: ['coach'],
  computed: {
    fullName() {
      return this.coach.firstName + ' ' + this.coach.lastName;
    },
    detailLink() {
      return this.$route.path + '/' + this.coach.id;
    },
    contactLink() {
      return this.$route.path + '/' + this.coach.id + '/contact';
    },
  },
};
</script>
<style scoped>
li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
