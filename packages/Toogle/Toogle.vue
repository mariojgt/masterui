<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">{{ props.label }}</span>
        </label>
        <input type="checkbox" :class="['toggle', props.class]" :name="props.name" :id="props.id"
            :placeholder="props.placeholder" :checked="checkedToggle" @click="clickToggle" />
        <span class="invalid-feedback text-primary" role="alert">
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
    class: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["update:modelValue"]);

let checkedToggle = $ref(props.modelValue ? props.modelValue : false);

const clickToggle = () => {
    checkedToggle = !checkedToggle;
    emit("update:modelValue", checkedToggle);
};
</script>

<style>

</style>
