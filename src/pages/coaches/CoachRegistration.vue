<template>
  <section>
    <base-card>
      <h2>Register as a coach now!</h2>
      <coach-form @save-form="saveForm"></coach-form>
    </base-card>
  </section>
</template>
<script>
import CoachForm from './CoachForm.vue';
export default {
  components: {
    CoachForm,
  },
  methods: {
    saveForm(formData) {
      this.$store.dispatch('coaches/registerCoach', formData);
    },
  },
};
</script>
