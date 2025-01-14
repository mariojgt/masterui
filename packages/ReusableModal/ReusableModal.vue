<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emitClose" class="relative z-50">
            <!-- Backdrop -->
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div
                    class="fixed inset-0 bg-black/25 sm:bg-black/25"
                    @click="closeOnBackdropClick && emitClose()"
                    aria-hidden="true"
                />
            </TransitionChild>

            <!-- Modal Container -->
            <div class="fixed inset-0 overflow-y-auto">
                <div
                    class="flex min-h-full sm:items-center sm:justify-center sm:p-4 text-center"
                    @keydown.esc="emitClose"
                >
                    <TransitionChild
                        as="template"
                        enter="transform transition ease-out duration-300"
                        enter-from="translate-y-full opacity-0 sm:scale-95 sm:translate-y-0"
                        enter-to="translate-y-0 opacity-100 sm:scale-100"
                        leave="transform transition ease-in duration-200"
                        leave-from="translate-y-0 opacity-100 sm:scale-100"
                        leave-to="translate-y-full opacity-0 sm:scale-95 sm:translate-y-0"
                    >
                        <DialogPanel
                            :class="[
                                'transform transition-all relative',
                                props.showModalBox ? 'sm:modal-box' : 'p-5',
                                { 'sm:w-11/12 sm:max-w-5xl': props.isLarge },
                                'w-full min-h-screen sm:min-h-0 sm:w-auto',
                                'sm:rounded-lg',
                                modalClass
                            ]"
                        >
                            <!-- Close Button -->
                            <button
                                v-if="showHeader || alwaysShowClose"
                                @click="emitClose"
                                class="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100/10 transition-colors duration-200 z-[60]"
                                :class="[topCloseButtonClass]"
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <!-- Modal Content -->
                            <div class="p-6 sm:p-0">
                                <slot v-if="showHeader" name="title">
                                    <DialogTitle as="h3" class="text-2xl font-semibold text-white sm:text-gray-900 dark:sm:text-white mb-8">
                                        {{ title || 'Sign in' }}
                                    </DialogTitle>
                                </slot>

                                <div class="mt-2">
                                    <slot name="body">
                                        <p class="text-sm text-gray-500">
                                                                                          {{ content || "Your payment has been successfully submitted. We've sent you an email with all of the details of your order." }}
                                        </p>
                                    </slot>
                                </div>

                                <!-- Footer -->
                                <div v-if="showFooter" class="py-3 sm:flex sm:flex-row-reverse gap-4">
                                    <button
                                        @click="emitConfirm"
                                        type="button"
                                        class="btn btn-success w-full sm:w-auto"
                                    >
                                        {{ confirmText }}
                                    </button>
                                    <button
                                        @click="emitClose"
                                        type="button"
                                        class="btn btn-error w-full sm:w-auto"
                                    >
                                        {{ cancelText }}
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'

const props = defineProps({
    show: Boolean,
    title: String,
    content: String,
    cancelText: {
        type: String,
        default: 'Cancel'
    },
    confirmText: {
        type: String,
        default: 'Confirm'
    },
    isLarge: {
        type: Boolean,
        default: false
    },
    modalClass: {
        type: String,
        default: ''
    },
    topCloseButtonClass: {
        type: String,
        default: ''
    },
    showFooter: {
        type: Boolean,
        default: true
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    showModalBox: {
        type: Boolean,
        default: true
    },
    alwaysShowClose: {  // New prop
        type: Boolean,
        default: true
    },
    closeOnBackdropClick: {  // New prop
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close', 'confirm'])

const emitClose = () => {
    emit('close')
}

const emitConfirm = () => {
    emit('confirm')
}
</script>
