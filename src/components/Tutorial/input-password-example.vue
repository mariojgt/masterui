<!-- FormExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Inputs password</h2>

      <form @submit.prevent="submitForm">
        <InputPassword
          label="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          v-model="formData.password"
        />
        <button type="submit" class="btn btn-primary mt-6">Submit</button>
      </form>
    </div>
  </template>

<script setup>
// Import the input component from the packages folder
import { InputPassword } from "../../../packages/index.js";

const formData = $ref({
    password: "",
});

const submitForm = () => {
    // Your form submission logic here
    console.log("Form submitted with data:", formData);
};
</script>

<style scoped>
/* Add any specific styles for this component if needed */
</style>
