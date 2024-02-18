<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Submit Button Example</h2>
        <div class="flex justify-start gap-4">
            <Submit name="Default" class="btn btn-active" @click="callbackExample" />
            <Submit name="Neutral" class="btn btn-active btn-neutral" @click="callbackExample" />
            <Submit name="Primary" class="btn btn-active btn-primary" @click="callbackExample" />
            <Submit name="Secondary" class="btn btn-active btn-secondary" @click="callbackExample" />
            <Submit name="Accent" class="btn btn-active btn-accent" @click="callbackExample" />
            <Submit name="Ghost" class="btn btn-active btn-ghost" @click="callbackExample" />
        </div>
    </div>
</template>

<script setup>
// Import the input component from the packages folder
import { Submit } from "../../../packages/index.js";


// Emit the click event
const callbackExample = () => {
    console.log('mariojgt');
};
</script>
