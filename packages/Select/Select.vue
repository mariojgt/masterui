<template>
    <div class="form-control">
      <label class="label">
        <span class="block text-lg font-bold mb-2">{{ props.label }}</span>
      </label>
      <select
        class="select select-primary w-full"
        id="{{ props.id }}"
        :value="modelValue"
        @input="update"
      >
        <option v-for="(item, index) in props.options" :key="index" :value="index" >{{ item }}</option>
      </select>
    </div>

    <span class="invalid-feedback text-primary" role="alert">
      <strong>{{ errorMessage }}</strong>
    </span>
  </template>

  <script setup>
  import { watch, ref, defineEmits } from "vue";
  import { usePage } from "@inertiajs/vue3";

  let errorMessage = ref(null);

  watch(
    () => usePage().props?.errors,
    (v) => {
      if (usePage().props.errors[props.name]) {
        errorMessage.value = usePage().props.errors[props.name];
      }
    }
  );

  const props = defineProps({
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    options: {
      type: Object,
      default: {},
    },
    modelValue: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  const update = (event) => {
      console.log('here');
    emit("update:modelValue", event.target.value);
  };
  </script>

  <style></style>
