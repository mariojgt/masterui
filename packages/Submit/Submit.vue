<template>
    <div class="form-control pt-6">
        <button class="btn btn-primary btn-block space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
            </svg>

            <span>{{ props.name }}</span>
        </button>
    </div>
</template>

<script setup>
import { watch, onMounted, defineEmits } from "vue";

const props = defineProps({
    name: {
        type: String,
        default: "Login",
    }
});


</script>

<style></style>
