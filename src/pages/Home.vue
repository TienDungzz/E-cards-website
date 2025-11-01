<template>
    <HeroBanner />
    <Spotlight :items="spotlights" />
    <ImageBanner
        :image="'image-banner_wp2t7k'"
        :alt="'Design your card'"
        :heading="t('homepage.image_banner_heading')"
        :description="t('homepage.image_banner_desc')"
        :button="t('homepage.image_banner_btn')"
    />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'
import HeroBanner from '@/components/sections/HeroBanner.vue';
import Spotlight from '@/components/sections/Spotlight.vue';
import ImageBanner from '@/components/sections/ImageBanner.vue';

const { t } = useI18n();

const spotlights = ref([
  { id: 1, title: 'Happy lunar new year', image: 'sp-new-year_pi3cnk' },
  { id: 2, title: 'Happy birthday', image: 'sp-birthday_aqztx4' },
  { id: 3, title: 'Valentine', image: 'sp-valentine_epuqpq' },
  { id: 4, title: 'April Fool', image: 'sp-marry_quxma3' },
  { id: 5, title: 'Halloween', image: 'sp-halloween_ethowj' },
  { id: 6, title: 'Woman day', image: 'sp-woman-day_tnyaxh' },
  { id: 7, title: 'Christmas', image: 'sp-christmas_hnwzcj' },
  { id: 8, title: 'weeding', image: 'sp-weeding_voxtce' },
  { id: 9, title: 'Graduation', image: 'sp-graduation_vgj1xn' },
  { id: 10, title: 'Thank', image: 'sp-thank_jlttzx' },
])
</script>
