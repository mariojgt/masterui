<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Select Example</h2>

      <p class="mb-4">
        This is a simple example of a select input component. The select input component is a
      </p>

      <div class="">
        <SelectInput
          label="Choose an option"
          name="exampleSelect"
          id="exampleSelect"
          :options="selectOptions"
          v-model="selectedOption"
        />
      </div>

      <p class="mt-4">
        Selected option: {{ selectedOption }}
      </p>
    </div>
  </template>

  <script setup lang="ts" >
  // Import the input component from the packages folder
  import { ref } from 'vue';
  import { SelectInput } from "../../../packages/index.js";

  const selectOptions = ['Option 1', 'Option 2', 'Option 3'];
  const selectedOption = $ref(null);

  </script>
