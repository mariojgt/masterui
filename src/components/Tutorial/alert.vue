<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Alert Examples</h2>

        <div class="flex gap-4 flex-col" >
            <!-- Normal Alert -->
            <Alert title="12 unread messages. Tap to see." />
            <!-- Info Alert -->
            <Alert type="alert-error" title="New software update available." />
            <Alert type="alert-success" title="You have successfully registered." />
            <Alert type="alert-info" title="You have 1 unread message." />
            <Alert type="alert-warning" title="Your account is about to expire." />
            <!-- Alert with buttons -->
            <Alert title="We use cookies for no reason." @btn-action="btnAction" :buttons="[
                { text: 'Deny', type: 'btn-error' },
                { text: 'Accept', type: 'btn-primary' },
            ]" />
            <!-- Alert with title and description -->
            <Alert title="New message!" :description="'You have 1 unread message'" @btn-action="btnAction" :buttons="[{ text: 'See' }]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Alert } from "../../../packages/index.js";

const btnAction = (button: any) => {
    console.log(button);
};
</script>
