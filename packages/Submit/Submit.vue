<template>
    <div>
        <div class="form-control pt-6">
            <button :class="props.class" @click="buttonClick">
                <span class="inline-block mr-2">{{ props.name }}</span>
                <slot>
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    class="w-4 h-4 inline-block">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg> -->
                </slot>
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
        default: "Login",
    },
    class: {
        type: String,
        default: "btn btn-primary",
    },
});
const emit = defineEmits(["click"]);

// Emit the click event
const buttonClick = () => {
    // Emit the click event
    emit("click");
};
</script>
