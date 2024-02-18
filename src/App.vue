<template>
    <layout>
        <div class="container mx-auto m-10">
            <div class="grid grid-cols-1 gap-4">
                <div class="hero min-h-screen bg-base-200">
                    <div class="hero-content text-center">
                        <div class="max-w-md">
                            <h1 class="text-5xl font-bold">Master UI</h1>
                            <p class="py-6">
                                This is a collection of components and utilities for faster and easier web development, made in vue js 3 and tailwind css wit Daisy UI.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Example Bellow -->
                <inputs />
                <links />
                <InputPassword />
                <ButtonExample />
                <SelectExample />
                <SelectExampleComplex />
                <MultipleText />
                <ToggleExample />
                <ModalExample />
                <Alert />
            </div>
        </div>
    </layout>
</template>

<script setup>
// Update the page tittle
document.title = "Master UI | Docs";
import layout from "./components/layout/app.vue";
// navbar
import navbar from "./components/global/navbar.vue";
// Example
import inputs from "./components/Tutorial/input-example.vue";
import links from "./components/Tutorial/links-example.vue";
import InputPassword from "./components/Tutorial/input-password-example.vue";
import ButtonExample from "./components/Tutorial/button-example.vue";
import SelectExample from "./components/Tutorial/select-example.vue";
import SelectExampleComplex from "./components/Tutorial/image-example-complex.vue";
import MultipleText from "./components/Tutorial/multiple-text.vue";
import ToggleExample from "./components/Tutorial/toggle-example.vue";
import ModalExample from "./components/Tutorial/modal-example.vue";
import Alert from "./components/Tutorial/alert.vue";
</script>
