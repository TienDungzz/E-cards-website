<template>
    <HeroBanner />
    <Spotlight />
    <ImageBanner
        :image="'logo'"
        :alt="'Design your card'"
        :heading="t('homepage.image_banner_heading')"
        :description="t('homepage.image_banner_desc')"
        :button="t('homepage.image_banner_btn')"
    />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import HeroBanner from '@/components/sections/HeroBanner.vue';
import Spotlight from '@/components/sections/Spotlight.vue';
import ImageBanner from '@/components/sections/ImageBanner.vue';

const { t } = useI18n();
</script>
