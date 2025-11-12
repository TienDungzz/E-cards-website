<template>
    <svg aria-hidden="true" :class="iconClass" :style="iconStyle">
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: 'icon',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  iconClass: {
    type: String,
    default: 'icon',
  },
  style: Object
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const iconStyle = computed(() => props.style || {})
</script>
