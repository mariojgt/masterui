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
      :value="modelValue"
      :required="required"
      @input="update"
    >
      <option value="" v-if="!required || !modelValue">
        {{ placeholder || 'Select an option...' }}
      </option>
      <option
        v-for="option in processedOptions"
        :key="option.key"
        :value="option.key"
      >
        {{ option.label }}
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

interface SelectOption {
  key: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  name: string;
  id: string;
  options: Record<string | number, string>;
  modelValue: string | number | null;
  selectClass?: string;
  required?: boolean;
  sortBy?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  label: '',
  selectClass: '',
  required: false,
  sortBy: false,
  placeholder: '',
  modelValue: null
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null];
}>();

// Process options with optional sorting while preserving original keys
const processedOptions = computed((): SelectOption[] => {
  const optionsArray: SelectOption[] = Object.entries(props.options).map(([key, value]) => ({
    key: key,
    label: value
  }));

  if (props.sortBy) {
    // Sort by label alphabetically (case-insensitive)
    return optionsArray.sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
    );
  }

  return optionsArray;
});

const update = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  if (value === '') {
    emit("update:modelValue", null);
    return;
  }

  // Check if the original key was numeric
  const originalKey = Object.keys(props.options).find(key => key === value);
  if (originalKey && !isNaN(Number(originalKey))) {
    emit("update:modelValue", Number(value));
  } else {
    emit("update:modelValue", value);
  }
};
</script>
