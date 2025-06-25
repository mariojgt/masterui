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
            :class="['input input-bordered w-full', inputClass, { 'input-error': $page.props.errors?.[name] || hasClientValidationError }]"
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

        <div v-if="$page.props.errors?.[name] || hasClientValidationError" class="label">
            <span class="label-text-alt text-error">
                {{ $page.props.errors?.[name] || clientValidationError }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

// Client-side validation computed properties
const clientValidationError = computed(() => {
    if (props.required && !props.modelValue) {
        return `${props.label} is required`;
    }

    if (props.type === 'email' && props.modelValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(props.modelValue))) {
            return 'Please enter a valid email address';
        }
    }

    if (props.pattern && props.modelValue) {
        const patternRegex = new RegExp(props.pattern);
        if (!patternRegex.test(String(props.modelValue))) {
            return 'Please match the requested format';
        }
    }

    if (props.minLength && String(props.modelValue).length < props.minLength) {
        return `Minimum length is ${props.minLength} characters`;
    }

    if (props.maxLength && String(props.modelValue).length > props.maxLength) {
        return `Maximum length is ${props.maxLength} characters`;
    }

    if (props.type === 'number' && typeof props.modelValue === 'number') {
        if (props.min !== undefined && props.modelValue < Number(props.min)) {
            return `Minimum value is ${props.min}`;
        }

        if (props.max !== undefined && props.modelValue > Number(props.max)) {
            return `Maximum value is ${props.max}`;
        }
    }

    return null;
});

const hasClientValidationError = computed(() => !!clientValidationError.value);

const update = (event: Event) => {
    const target = event.target as HTMLInputElement;
    let value: string | number = target.value;

    // Convert to number for number inputs
    if (props.type === 'number' && value !== '') {
        value = parseFloat(value) || 0;
    }

    emit('update:modelValue', value);
};

const handleBlur = (event: FocusEvent) => {
    emit('blur', event);
};

const handleClick = (event: MouseEvent) => {
    emit('click', event);
};
</script>
