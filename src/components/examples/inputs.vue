<template>
  <div class="lg:p-10 xl:grid-cols-12 lg:bg-base-200 rounded-box">
    <input-field
      label="Text Field"
      placeholder="Place Holder"
      v-model="value"
      color="success"
    />
  </div>
</template>

<script setup>
// Import the input component from the packages folder
import { InputField } from "../../../packages/index.js";

const props = defineProps({
  title: {
    type: String,
    default: "mariojgt is heredude",
  },
});

let value = $ref(null);
</script>
