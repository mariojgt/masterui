<template>
    <div class="form-control">
        <label class="label cursor-pointer justify-start gap-4">
            <input
                type="checkbox"
                :id="id"
                :name="name"
                v-model="checkedToggle"
                class="toggle toggle-primary"
            />
            <slot name="label">
                <span class="label-text font-semibold">{{ label }}</span>
            </slot>
        </label>
        <div v-if="$page.props.errors?.[name]" class="label">
            <span class="label-text-alt text-error">{{ $page.props.errors[name] }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    name: String,
    id: String,
    modelValue: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const checkedToggle = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});
</script>
