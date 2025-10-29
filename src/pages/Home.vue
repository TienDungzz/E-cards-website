<template>
    <HeroBanner />
    <Spotlight />

    <div class="container">
        <!-- <h2>Bento Layout (CSS Grid)</h2>
        <Masonry :items="items" type="bento" :columns="3" :cell-size="100" /> -->

        <h2>Images Layout</h2>
        <Masonry :items="items" type="images" :relative-height="130" />

        <h2>Pinterest Layout</h2>
        <Masonry :items="items" type="pinterest" :columns="6" />

        <h2>Grid Layout</h2>
        <Masonry :items="items" type="grid" :columns="10" />

        <h2>Flex Layout</h2>
        <Masonry :items="items" type="flex" :columns="{ mobile: 1, tablet: 2, desktop: 3}" :max-width="400" />
    </div>
</template>

<script setup>
import HeroBanner from '@/components/sections/HeroBanner.vue';
import Spotlight from '@/components/sections/Spotlight.vue';
import Masonry from '@/components/blocks/Masonry.vue';

const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#4caf50', '#cddc39', '#ffc107']

const items = [
  { color: colors[0], width: 500, height: 200 },
  { color: colors[1], width: 400, height: 250 },
  { color: colors[2], width: 300, height: 350 },
  { color: colors[3], width: 150, height: 100 },
  { color: colors[4], width: 220, height: 300 },
  { color: colors[5], width: 350, height: 180 },
  { color: colors[6], width: 280, height: 220 },
  { color: colors[7], width: 320, height: 280 },
  { color: colors[8], width: 250, height: 320 },
  { color: colors[0], width: 300, height: 190 },
  { color: colors[2], width: 450, height: 240 },
  { color: colors[1], width: 260, height: 300 },
  { color: colors[3], width: 180, height: 150 },
  { color: colors[4], width: 370, height: 220 },
  { color: colors[5], width: 240, height: 380 },
  { color: colors[6], width: 330, height: 200 },
  { color: colors[7], width: 310, height: 270 },
  { color: colors[8], width: 260, height: 260 },
  { color: colors[0], width: 420, height: 210 },
  { color: colors[2], width: 390, height: 260 },
  { color: colors[1], width: 210, height: 330 },
  { color: colors[3], width: 170, height: 140 },
  { color: colors[4], width: 355, height: 205 },
  { color: colors[5], width: 230, height: 410 },
  { color: colors[6], width: 290, height: 230 },
  { color: colors[7], width: 340, height: 300 },
  { color: colors[8], width: 275, height: 310 },
  { color: colors[0], width: 480, height: 195 },
  { color: colors[1], width: 225, height: 345 },
  { color: colors[2], width: 410, height: 265 },
]
</script>
