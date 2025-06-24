<template>
    <div class="form-control w-full">
        <label :for="id" class="label">
            <slot name="label">
                <span class="label-text font-semibold">{{ label }}</span>
            </slot>
        </label>
        <input
            :id="id"
            :name="name"
            :type="type"
            :class="['input input-bordered w-full', inputClass, { 'input-error': errorMessage }]"
            :placeholder="placeholder"
            :value="modelValue"
            :readonly="readonly"
            :required="required"
            :min="min"
            :max="max"
            :step="step"
            :pattern="pattern"
            :minlength="minLength"
            :maxlength="maxLength"
            @input="update"
            @blur="handleBlur"
            @click="handleClick" />

        <div v-if="errorMessage" class="label">
            <span class="label-text-alt text-error">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

interface InputProps {
    label?: string;
    name: string;
    id: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'time';
    modelValue: string | number;
    inputClass?: string;
    required?: boolean;
    readonly?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: string | number;
    max?: string | number;
    step?: string | number;
}

const props = withDefaults(defineProps<InputProps>(), {
    label: '',
    placeholder: '',
    type: 'text',
    inputClass: '',
    required: false,
    readonly: false
});

const emit = defineEmits<{
    'update:modelValue': [value: string | number];
    'blur': [event: FocusEvent];
    'click': [event: MouseEvent];
}>();

const errorMessage = ref<string | null>(null);
const page = usePage();

const errors = computed(() => page.props?.errors || {});

watch(
    errors,
    (newErrors) => {
        errorMessage.value = newErrors[props.name] || null;
    },
    { deep: true }
);

const update = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value: string | number = target.value;

    // Convert to number for number inputs
    if (props.type === 'number' && value !== '') {
        value = parseFloat(value) || 0;
    }

    emit('update:modelValue', value);
    validateInput();
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
    validateInput();
};

const handleClick = (event: MouseEvent) => {
    emit('click', event);
};

const validateInput = () => {
    errorMessage.value = null;

    if (props.required && !props.modelValue) {
        errorMessage.value = `${props.label} is required`;
        return;
    }

    if (props.type === 'email' && props.modelValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(props.modelValue))) {
            errorMessage.value = 'Please enter a valid email address';
            return;
        }
    }

    if (props.pattern && props.modelValue) {
        const patternRegex = new RegExp(props.pattern);
        if (!patternRegex.test(String(props.modelValue))) {
            errorMessage.value = `Please match the requested format`;
            return;
        }
    }

    if (props.minLength && String(props.modelValue).length < props.minLength) {
        errorMessage.value = `Minimum length is ${props.minLength} characters`;
        return;
    }

    if (props.maxLength && String(props.modelValue).length > props.maxLength) {
        errorMessage.value = `Maximum length is ${props.maxLength} characters`;
        return;
    }

    if (props.type === 'number' && typeof props.modelValue === 'number') {
        if (props.min !== undefined && props.modelValue < Number(props.min)) {
            errorMessage.value = `Minimum value is ${props.min}`;
            return;
        }

        if (props.max !== undefined && props.modelValue > Number(props.max)) {
            errorMessage.value = `Maximum value is ${props.max}`;
            return;
        }
    }
};
</script>
