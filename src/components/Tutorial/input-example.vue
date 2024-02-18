<!-- FormExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Inputs example</h2>

      <form @submit.prevent="submitForm">
        <InputField
          label="Username"
          name="username"
          id="username"
          placeholder="Enter your username"
          v-model="formData.username"
        />
        <InputField
          label="Password"
          name="password"
          id="password"
          type="password"
          placeholder="Enter your password"
          v-model="formData.password"
        />

        <button type="submit" class="btn btn-primary mt-6">Submit</button>
      </form>
    </div>
  </template>

<script setup>
// Import the input component from the packages folder
import { InputField } from "../../../packages/index.js";
import { ref } from "vue";

const formData = ref({
    username: "",
    password: "",
});

const submitForm = () => {
    // Your form submission logic here
    console.log("Form submitted with data:", formData.value);
};
</script>

<style scoped>
/* Add any specific styles for this component if needed */
</style>
