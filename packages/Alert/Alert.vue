<template>
    <div :class="['alert', type, { 'shadow-lg': shadow }]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" :class="['stroke-current', iconSize]">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
            <h3 v-if="title" class="font-bold">{{ title }}</h3>
            <span v-if="description" class="text-xs">{{ description }}</span>
        </div>
        <div v-if="buttons" class="flex gap-4">
            <button v-for="(button, index) in buttons" :key="index" :class="['btn', button.type]" @click="() => emit('btnAction', button)">
                {{ button.text }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { AlertButton } from './type.ts';

const emit = defineEmits(['btnAction']);

const props = defineProps({
    type: {
        type: String,
        default: "",
    },
    shadow: {
        type: Boolean,
        default: false,
    },
    iconSize: {
        type: String,
        default: "w-6 h-6",
    },
    title: String,
    description: String,
    buttons: Array as () => AlertButton[],
});
</script>

<style scoped>
/* Add your custom styles here or use Daisy UI styles */
</style>
