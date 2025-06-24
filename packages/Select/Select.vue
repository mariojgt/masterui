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
            :class="['select select-bordered w-full', selectClass, { 'select-error': errorMessage }]"
            :value="modelValue"
            :required="required"
            @input="update"
        >
            <option v-for="(item, index) in options" :key="index" :value="index">
                {{ item }}
            </option>
        </select>

        <div v-if="errorMessage" class="label">
            <span class="label-text-alt text-error">{{ errorMessage }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { usePage } from "@inertiajs/vue3";

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

let errorMessage = ref<string | null>(null);
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
    const target = event.target as HTMLSelectElement;
    emit("update:modelValue", target.value);

    if (props.required && !target.value) {
        errorMessage.value = `${props.label} is required`;
    } else {
        errorMessage.value = null;
    }
};
</script>
