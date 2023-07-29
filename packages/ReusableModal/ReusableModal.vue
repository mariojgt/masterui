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
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <slot name="title">
                                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Default Header</DialogTitle>
                            </slot>
                            <div class="mt-2">
                                <slot name="body">
                                    <p class="text-sm text-gray-500">
                                        Your payment has been successfully submitted. We’ve sent you
                                        an email with all of the details of your order.
                                    </p>
                                </slot>
                            </div>
                            <div class="py-3 sm:flex sm:flex-row-reverse">
                                <button @click="emitConfirm" type="button" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">{{ props.confirmText }}</button>
                                <button @click="emitClose" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">{{ props.cancelText }}</button>
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
