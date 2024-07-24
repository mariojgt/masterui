<template>
    <div class="form-control">
        <label class="label">
            <span :class="labelClass">{{ props.label }}</span>
        </label>
        <input
            :class="inputClass"
            :type="props.type"
            name="{{ props.name }}"
            id="{{ props.id }}"
            :placeholder="props.placeholder"
            :value="modelValue"
            @input="update"
        />
        <span v-if="errorMessage" :class="messageClass" role="alert">
            <strong>{{ errorMessage }}</strong>
        </span>
    </div>
</template>

<script setup lang="ts">
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
    type: {
        type: String,
        default: "text",
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
        default: "input input-primary input-bordered",
    },
});

const emit = defineEmits(["update:modelValue"]);

const update = (event) => {
    emit("update:modelValue", event.target.value);
};
</script>
