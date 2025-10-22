<template>
    <div class="icon-wrapper" v-if="svgContent" v-html="svgContent" />
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    const props = defineProps({
    name: {
        type: String,
        required: true,
        description: 'The name of the SVG icon (without .svg extension)',
    },
    });

    const svgContent = ref('');
    const errorMessage = ref('');

    onMounted(async () => {
        try {
            const response = await import(`@/assets/icons/${props.name}.svg?raw`);
            svgContent.value = response.default;
        } catch (error) {
            errorMessage.value = error.message || 'Unknown error';
            svgContent.value = '';
        }
    });
</script>