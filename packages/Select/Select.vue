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
      <option v-for="(item, index) in options" :key="index" :value="index">
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
interface SelectProps {
  label?: string;
  name: string;
  id: string;
  options: Record<string, string>;
  modelValue: string | number;
  selectClass?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<SelectProps>(), {
  label: '',
  selectClass: '',
  required: false
});

const emit = defineEmits(["update:modelValue"]);

const update = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value);
};
</script>
