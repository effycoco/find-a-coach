<template>
  <form @submit.prevent="submitForm">
    <div class="form-control" :class="{ invalid: !firstName.valid }">
      <label for="firstname">Firstname</label>
      <input
        type="text"
        id="firstname"
        v-model.trim="firstName.val"
        @blur="clearValidity('firstName')"
      />
      <p v-if="!firstName.valid">First name cannot be empty</p>
    </div>
    <div class="form-control" :class="{ invalid: !lastName.valid }">
      <label for="lastname">Lastname</label>
      <input
        type="text"
        id="lastname"
        v-model.trim="lastName.val"
        @blur="clearValidity('lastName')"
      />
      <p v-if="!lastName.valid">Last name cannot be empty</p>
    </div>
    <div class="form-control" :class="{ invalid: !description.valid }">
      <label for="description">Description</label>
      <textarea
        id="description"
        rows="5"
        v-model.trim="description.val"
        @blur="clearValidity('description')"
      ></textarea>
      <p v-if="!description.valid">Description cannot be empty</p>
    </div>
    <div class="form-control" :class="{ invalid: !hourlyRate.valid }">
      <label for="rate">Hourly Rate</label>
      <input
        type="number"
        id="rate"
        v-model.number="hourlyRate.val"
        @blur="clearValidity('hourlyRate')"
      />
      <p v-if="!hourlyRate.valid">Hourly Rate should be greater than 0</p>
    </div>
    <div class="form-control" :class="{ invalid: !areas.valid }">
      <h3>Areas of Expertise</h3>
      <div>
        <input
          type="checkbox"
          value="frontend"
          id="frontend"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="frontend">Frontend</label>
      </div>
      <div>
        <input
          type="checkbox"
          value="backend"
          id="backend"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="backend">Backend</label>
      </div>
      <div>
        <input
          type="checkbox"
          value="career"
          id="career"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="career">Career</label>
      </div>
      <p v-if="!areas.valid">At least one area must be selected</p>
    </div>
    <p v-if="!validForm">Please fix the above errors and submit again</p>
    <base-button>Register</base-button>
  </form>
</template>
<script>
export default {
  emits: ['save-form'],
  data() {
    return {
      firstName: { val: '', valid: true },
      lastName: { val: '', valid: true },
      description: { val: '', valid: true },
      hourlyRate: { val: null, valid: true },
      areas: { val: [], valid: true },
      validForm: true,
    };
  },
  methods: {
    validateForm() {
      // 重新验证前先重置为true
      this.validForm = true;
      if (!this.firstName.val) {
        this.firstName.valid = false;
        this.validForm = false;
      }
      if (!this.lastName.val) {
        this.lastName.valid = false;
        this.validForm = false;
      }
      if (!this.description.val) {
        this.description.valid = false;
        this.validForm = false;
      }
      if (!this.hourlyRate.val || this.hourlyRate.val < 0) {
        this.hourlyRate.valid = false;
        this.validForm = false;
      }
      if (this.areas.val.length === 0) {
        this.areas.valid = false;
        this.validForm = false;
      }
    },
    clearValidity(input) {
      this[input].valid = true;
    },
    submitForm() {
      this.validateForm();
      if (!this.validForm) {
        return;
      }
      const formData = {
        firstName: this.firstName.val,
        lastName: this.lastName.val,
        description: this.description.val,
        hourlyRate: this.hourlyRate.val,
        areas: this.areas.val,
      };
      this.$emit('save-form', formData);
      this.$router.replace('/coaches');
    },
  },
};
</script>
<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label,
p {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
</style>
