<template>
    <svg aria-hidden="true" :class="iconClass">
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>

<script setup>
import { computed } from 'vue';

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
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
