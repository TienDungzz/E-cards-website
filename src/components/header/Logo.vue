<template>
    <div class="logo-wrapper">
        <router-link to="/">
            <ImageResponsive
                :imageName="'logo'"
                :width="100"
                :widths="[320, 480]"
                :sizes="'(max-width: 600px) 40vw, 200px'"
                :alt="'Logo E-cards website'"
                :loading="'eager'"
                :fetchpriority="'hight'"
            />
        </router-link>
    </div>
</template>

<script setup>
import ImageResponsive from '@/components/blocks/ImageResponsive.vue';
</script>
