<template>
    <section class="section spotlight">
        <div class="container">
            <div class="heading-section has-arrow">
                <h2>Choose your style</h2>
            </div>
            <Slider
                :items="slides"
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
import { ref } from 'vue'
import Slider from '@/components/blocks/Slider.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue';
import '@/assets/styles/sections/_hero-banner.scss'

const slides = ref([
  { id: 1, title: 'Letter image', image: 'letter' },
  { id: 2, title: 'Pink cake', image: 'pink-cake' },
  { id: 3, title: 'Rose', image: 'rose' },
  { id: 4, title: 'Red heart', image: 'red-heart' },
  { id: 5, title: 'White christmas', image: 'white-christmas' },
])
</script>
