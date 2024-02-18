<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Toggle Switch Example</h2>

      <p class="mb-4">
        This is an example of a toggle switch component.
      </p>

      <div class="flex justify-start gap-4">
        <Toggle
          label="Enable Feature"
          name="enableFeature"
          id="enableFeature"
          placeholder="Toggle the feature"
          v-model="featureEnabled"
          class="text-primary"
        />
      </div>

      <p class="mt-4">
        Feature is {{ featureEnabled ? 'enabled' : 'disabled' }}.
      </p>
    </div>
  </template>

  <script setup>
  // Import the Toggle component from the packages folder
  import { Toggle } from "../../../packages/index.js";

  // Feature enabled state
  const featureEnabled = $ref(true);
  </script>
