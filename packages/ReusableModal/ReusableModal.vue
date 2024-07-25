<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" @close="emitClose" class="relative z-10">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="modal-box"
                            :class="{ 'w-11/12 max-w-5xl': !props.isLarge, 'w-11/12 max-w-5xl': props.isLarge }, props.modalClass"
                            >
                            <button v-if="showHeader" @click="emitClose" :class="topCloseButtonClass">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <slot v-if="showHeader" name="title">
                                <h3 class="font-bold text-lg">Hello!</h3>
                            </slot>
                            <div class="mt-2">
                                <slot name="body">
                                    <p class="text-sm text-gray-500">
                                        Your payment has been successfully submitted. We’ve sent you
                                        an email with all of the details of your order.
                                    </p>
                                </slot>
                            </div>
                            <div class="py-3 sm:flex sm:flex-row-reverse gap-4" v-if="showFooter">
                                <button @click="emitConfirm" type="button" class="btn btn-success">{{ props.confirmText }}</button>
                                <button @click="emitClose" type="button" class="btn btn-error">{{ props.cancelText }}</button>
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
    show: Boolean, // prop for controlling visibility of the modal
    title: String, // prop for the title of the modal
    content: String, // prop for the content of the modal
    cancelText : {
        type: String,
        default: 'Cancel'
    },
    confirmText : {
        type: String,
        default: 'Confirm'
    },
    isLarge : {
        type: Boolean,
        default: false
    },
    modalClass : {
        type: String,
        default: ''
    },
    topCloseButtonClass : {
        type: String,
        default: 'absolute top-1 right-1 p-4 bg-primary rounded-full hover:bg-base-300'
    },
    showFooter : {
        type: Boolean,
        default: true
    },
    showHeader : {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close', 'confirm'])

const emitClose = () => {
    emit('close') // emit the 'close' event when the modal is closed
}

const emitConfirm = () => {
    emit('confirm') // emit the 'confirm' event when the modal is confirmed
}
</script>
