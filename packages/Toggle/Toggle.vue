<template>
    <fieldset class="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-64">
      <legend class="fieldset-legend text-lg font-bold">{{ props.label }}</legend>
      <label class="fieldset-label flex items-center space-x-2">
        <Switch
          v-model="checkedToggle"
          :class="checkedToggle ? 'bg-primary' : 'bg-gray-200'"
          class="relative inline-flex h-6 w-11 items-center rounded-full"
        >
          <span class="sr-only">Toggle</span>
          <span
            :class="checkedToggle ? 'translate-x-6' : 'translate-x-1'"
            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          />
        </Switch>
        <span>{{ props.placeholder }}</span>
      </label>
      <!-- Error Message -->
      <span class="invalid-feedback text-primary mt-1 block" role="alert" v-if="errorMessage">
        <strong>{{ errorMessage }}</strong>
      </span>
    </fieldset>
  </template>

  <script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue';
  import { usePage } from '@inertiajs/vue3';
  import { Switch } from '@headlessui/vue';

  // Define the props
  const props = defineProps({
    label: String,
    name: String,
    id: String,
    placeholder: String,
    modelValue: Boolean,
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

  // Watch the prop 'modelValue' to update the toggle state
  watch(
    () => props.modelValue,
    (newValue) => {
      checkedToggle.value = newValue;
    }
  );

  // Watch the toggle state to emit the update event
  watch(checkedToggle, (newValue) => {
    emit('update:modelValue', newValue);
  });
  </script>

  <style scoped>
  .fieldset-legend {
    padding: 0 0.5rem;
  }

  .fieldset-label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  </style>
