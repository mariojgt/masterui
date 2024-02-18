<!-- PageExample.vue -->
<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Links Example</h2>

        <p class="mb-4">
            This is a simple example page. You can use the LinkButton component
            to navigate to different pages.
        </p>

        <div class="flex justify-start gap-4">
            <LinkButton name="Login" link="/google" />
            <LinkButton name="Register" link="/register" />
        </div>
    </div>
</template>

<script setup>
// Import the input component from the packages folder
import { LinkButton } from "../../../packages/index.js";
</script>
