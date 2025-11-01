<template>
    <button class="button d-flex align-items-center justify-content-center gap-10" :class="style">
        <Icon v-if="icon && iconPos == 'left'" :name="icon" />
        {{ label }}
        {{ icon }}
        <Icon v-if="icon && iconPos == 'right'" :name="icon" />
    </button>
</template>

<script setup>
import Icon from '@/components/blocks/Icon.vue'
const props = defineProps({
    label: {
        type: String,
        required: false,
        default: "Button lable"
    },
    icon: {
        type: String,
        required: false,
        description: 'The name of the SVG icon (without .svg extension)'
    },
    style: {
        type: String,
        required: false,
        default: "primary"
    },
    iconPos: {
        type: String,
        required: false,
        default: "right"
    }
    });
</script>
