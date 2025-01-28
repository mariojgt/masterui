<template>
    <div class="form-control">
        <label :for="id" class="label">
            <span :class="labelClass">{{ label }}</span>
        </label>

        <input :id="id" :name="name" :type="type" :class="[inputClass, { 'error': errorMessage }]"
            :placeholder="placeholder" :value="modelValue" @input="update" @blur="validateInput" />

        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100" leave-to-class="transform opacity-0">
            <span v-if="errorMessage" :class="messageClass" role="alert" aria-live="polite">
                <strong>{{ errorMessage }}</strong>
            </span>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { PropType } from 'vue';

interface InputProps {
    label: string;
    name: string;
    id: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    modelValue: string;
    messageClass?: string;
    labelClass?: string;
    inputClass?: string;
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
}

const props = withDefaults(defineProps<InputProps>(), {
    placeholder: '',
    type: 'text',
    messageClass: 'text-red-500 text-sm mt-1',
    labelClass: 'block text-lg font-bold mb-2',
    inputClass: 'input input-primary input-bordered w-full',
    required: false
});

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'blur': [event: FocusEvent];
}>();

const errorMessage = ref<string | null>(null);
const page = usePage();

// Create a computed property for errors
const errors = computed(() => page.props?.errors || {});

// Then modify the watch to use the computed property
watch(
    errors,
    (newErrors) => {
        errorMessage.value = newErrors[props.name] || null;
    },
    { deep: true }
);

const update = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
    validateInput();
};

const validateInput = () => {
    errorMessage.value = null;

    if (props.required && !props.modelValue) {
        errorMessage.value = `${props.label} is required`;
        return;
    }

    if (props.type === 'email' && props.modelValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(props.modelValue)) {
            errorMessage.value = 'Please enter a valid email address';
            return;
        }
    }

    if (props.pattern && props.modelValue) {
        const patternRegex = new RegExp(props.pattern);
        if (!patternRegex.test(props.modelValue)) {
            errorMessage.value = `Please match the requested format`;
            return;
        }
    }

    if (props.minLength && props.modelValue.length < props.minLength) {
        errorMessage.value = `Minimum length is ${props.minLength} characters`;
        return;
    }

    if (props.maxLength && props.modelValue.length > props.maxLength) {
        errorMessage.value = `Maximum length is ${props.maxLength} characters`;
        return;
    }
};
</script>

<style scoped>
@reference "tailwindcss";
.form-control {
    @apply relative mb-4;
}

.input.error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}
</style>
