<template>
    <div class="form-control">
        <label class="label">
            <span :class="labelClass">{{ props.label }}</span>
        </label>
        <div class="relative">
            <input
                :class="inputClass"
                :type="showPassword ? 'text' : 'password'"
                name="{{ props.name }}"
                id="{{ props.id }}"
                :placeholder="props.placeholder"
                :value="modelValue"
                @input="update"
            />
            <a
                :class="showPasswordClass"
                @click="toggleShowPassword"
            >
                <svg
                    v-if="showPassword"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                <svg
                v-else
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>

            </a>
        </div>
        <span v-if="errorMessage" :class="messageClass" role="alert">
            <strong>{{ errorMessage }}</strong>
        </span>
    </div>
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
    modelValue: {
        type: String,
        default: "",
    },
    messageClass: {
        type: String,
        default: "invalid-feedback text-primary",
    },
    labelClass: {
        type: String,
        default: "block text-lg font-bold mb-2",
    },
    inputClass: {
        type: String,
        default: "w-full pr-16 input input-primary input-bordered",
    },
    showPasswordClass: {
        type: String,
        default: "absolute top-0 right-0 rounded-l-none btn btn-primary",
    },
});

const emit = defineEmits(["update:modelValue"]);

const update = (event) => {
    emit("update:modelValue", event.target.value);
};

let showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
