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

        <div v-if="errorMessage" class="label">
            <span class="label-text-alt text-error">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

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

let errorMessage = ref(null);
let checkedToggle = ref(Boolean(props.modelValue));
const page = usePage();

const errors = computed(() => page.props?.errors || {});

watch(
    errors,
    (newErrors) => {
        errorMessage.value = newErrors[props.name] || null;
    },
    { deep: true }
);

watch(
    () => props.modelValue,
    (newValue) => {
        checkedToggle.value = newValue;
    }
);

watch(checkedToggle, (newValue) => {
    emit('update:modelValue', newValue);
});
</script>
