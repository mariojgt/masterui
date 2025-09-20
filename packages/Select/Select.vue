<template>
  <div class="form-control w-full">
    <label class="label">
      <slot name="label">
        <span class="label-text font-semibold">{{ label }}</span>
      </slot>
    </label>
    <select
      :id="id"
      :name="name"
      :class="['select select-bordered w-full', selectClass, { 'select-error': $page.props.errors?.[name] || (required && !modelValue) }]"
      :value="normalizedValue"
      :required="required"
      @input="update"
    >
      <option v-for="(item, key) in options" :key="key" :value="key">
        {{ item }}
      </option>
    </select>
    <div v-if="$page.props.errors?.[name] || (required && !modelValue)" class="label">
      <span class="label-text-alt text-error">
        {{ $page.props.errors?.[name] || `${label} is required` }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectProps {
  label?: string;
  name: string;
  id: string;
  options: Record<string | number, string>;
  modelValue: string | number | null;
  selectClass?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<SelectProps>(), {
  label: '',
  selectClass: '',
  required: false
});

const emit = defineEmits(["update:modelValue"]);

// Ensure the current value exists in options, otherwise use the first available option or null
const normalizedValue = computed(() => {
  if (props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '') {
    // Check if the current value exists in the options
    if (Object.prototype.hasOwnProperty.call(props.options, props.modelValue)) {
      return props.modelValue;
    }
  }
  return props.modelValue;
});

const update = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  // Convert to number if the original modelValue was a number
  if (typeof props.modelValue === 'number' && !isNaN(Number(value))) {
    emit("update:modelValue", Number(value));
  } else {
    emit("update:modelValue", value);
  }
};
</script>
