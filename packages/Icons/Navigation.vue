<template>
    <svg-icon type="mdi" :path="mdiNavigation" :size="props.size"></svg-icon>
</template>

<script setup>
// Import the mdi icon component
import SvgIcon from '@jamescoyle/vue-icon'
// Import the icon you want to use
import { mdiNavigation } from '@mdi/js'

// Page props
const props = defineProps({
    size: {
        type: Number,
        default: 25,
    },
});

</script>
