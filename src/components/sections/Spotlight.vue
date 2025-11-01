<template>
    <section class="section spotlight">
        <div class="container">
            <div class="heading-section has-arrow">
                <h2>{{ t('homepage.spotlight_heading') }}</h2>
            </div>
            <Slider
                :items="items"
                :columns="{ mobile: 2, tablet: 3, desktop: 4}"
                :gap="15"
                :infinite="false"
                :dots="false"
                :arrows="true"
                :draggable="true"
            >
                <template #default="{ item }">
                    <div class="spotlight-item">
                        <ImageResponsive :imageName="item.image" :width="450" :widths="[320, 450]" :alt="item.title" />
                    </div>
                </template>
            </Slider>
        </div>
    </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'
import Slider from '@/components/blocks/Slider.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue';

const { t } = useI18n();

const props = defineProps({
  items: { type: Array, required: true }
})
</script>
