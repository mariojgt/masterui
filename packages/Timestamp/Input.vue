<template>
    <div class="form-control w-full">
        <label :for="id" class="label" v-if="label || $slots.label">
            <slot name="label">
                <span class="label-text font-semibold">{{ label }}</span>
            </slot>
        </label>

        <input
            :id="id"
            :name="name"
            type="datetime-local"
            :class="['input input-bordered w-full', inputClass, { 'input-error': errorMessage }]"
            v-model="inputValue"
            :required="required"
            :min="min"
            :max="max"
            @blur="validateInput"
        />

        <div v-if="errorMessage" class="label">
            <span class="label-text-alt text-error">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';

interface TimestampProps {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    modelValue: string;
    inputClass?: string;
    required?: boolean;
    min?: string;
    max?: string;
}

const props = withDefaults(defineProps<TimestampProps>(), {
    label: '',
    placeholder: '',
    inputClass: '',
    required: false
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
}>();

const errorMessage = ref<string | null>(null);
const page = usePage();

const errors = computed(() => page.props?.errors || {});

const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

watch(
    errors,
    (newErrors) => {
        errorMessage.value = newErrors[props.name] || null;
    },
    { deep: true }
);

const validateInput = () => {
    errorMessage.value = null;
    if (props.required && !inputValue.value) {
        errorMessage.value = `${props.label} is required`;
        return;
    }
    if (props.min && inputValue.value < props.min) {
        errorMessage.value = `Date must be after minimum date`;
        return;
    }
    if (props.max && inputValue.value > props.max) {
        errorMessage.value = `Date must be before maximum date`;
        return;
    }
};
</script>
