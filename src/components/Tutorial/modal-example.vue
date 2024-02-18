<template>
    <div class="w-full mx-auto mt-10 p-6 bg-neutral rounded-md shadow-md">
        <h2 class="text-2xl font-semibold mb-6">Modal Example</h2>

        <div class="flex justify-start gap-4">
            <button @click="openModal" class="bg-blue-500 text-white px-4 py-2 rounded">Open Modal</button>
        </div>

        <!-- Your Modal Component -->
        <ReusableModal :show="isModalOpen" @close="closeModal" @confirm="handleConfirm" cancelText="Cancel"
            confirmText="Confirm">
            <!-- Custom title slot -->
            <template #title>
                <h3 class="font-bold text-lg">Hello!</h3>
            </template>

            <!-- Custom body slot -->
            <template #body>
                <p class="text-sm text-gray-500">
                    This is a custom body content for the modal. You can add any content you want here.
                </p>
            </template>
        </ReusableModal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ReusableModal } from "../../../packages/index.js";

const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const handleConfirm = () => {
    closeModal(); // You might want to close the modal after confirmation
};
</script>
