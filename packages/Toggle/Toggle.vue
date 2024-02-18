<template>
    <div class="form-control">
      <!-- Label -->
      <label class="label">
        <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
      </label>

      <!-- Toggle Switch -->
      <input
        type="checkbox"
        :class="['toggle', props.class]"
        :name="props.name"
        :id="props.id"
        :placeholder="props.placeholder"
        :checked="checkedToggle"
        @click="clickToggle"
      />

      <!-- Error Message -->
      <span class="invalid-feedback text-primary" role="alert" v-if="errorMessage">
        <strong>{{ errorMessage }}</strong>
      </span>
    </div>
  </template>

  <script setup>
  import { watch, ref, defineProps, defineEmits } from 'vue';
  import { usePage } from '@inertiajs/vue3';

  // Define the props
  const props = defineProps({
    label: String,
    name: String,
    id: String,
    placeholder: String,
    modelValue: String,
    class: String,
  });

  // Define the emits
  const emit = defineEmits(['update:modelValue']);

  // Reactive variables
  let errorMessage = ref(null);
  let checkedToggle = ref(Boolean(props.modelValue));

  // Watch for errors and update errorMessage
  watch(
    () => usePage().props?.errors,
    (v) => {
      errorMessage.value = usePage().props.errors[props.name] || null;
    }
  );

  // Handle click event on the toggle switch
  const clickToggle = () => {
    checkedToggle.value = !checkedToggle.value;
    emit('update:modelValue', checkedToggle.value);
  };
  </script>

  <style>
  /* Add any specific styles for this component if needed */
  </style>
