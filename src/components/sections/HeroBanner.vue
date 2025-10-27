<template>
    <section class="hero-banner position-relative">
        <div class="banner w-100">
            <Slider
                :items="slides"
                :columns="1"
                :gap="0"
                :infinite="true"
                :dots="true"
                :arrows="false"
                :draggable="false"
                :stack="true"
                :autoplay="true"
            >
                <template #default="{ item }">
                    <div class="banner-item position-relative">
                        <div
                            class="banner--gradient position-absolute w-100 h-100"
                            :class="`z-${slides.length + 0}`"
                            :style="{ '--gradient': item.gradient }"
                        ></div>
                        <div class="banner--bg" :class="`z-${slides.length+2}`">
                            <ImageResponsive
                                :imageName="'background_banner'"
                                :width="1920"
                                :widths="[320, 480, 768, 992, 1024, 1400, 1920]"
                                :alt="'Background hero banner'"
                                :loading="'eager'"
                                :fetchpriority="'hight'"
                            />
                        </div>
                        <div class="banner--image position-absolute" :class="`z-${slides.length+1}`">
                            <ImageResponsive
                                :imageName="item.image"
                                :width="675"
                                :widths="[320, 480, 675]"
                                :alt="item.title"
                            />
                        </div>
                    </div>
                </template>
            </Slider>
        </div>
        <div class="heading-banner position-absolute z-20">
            <h1>E-card Website</h1>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import Slider from '@/components/blocks/Slider.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue';
import '@/assets/styles/sections/_hero-banner.scss'

const slides = ref([
  { id: 1, title: 'Letter image', image: 'letter', bgImage: "background_banner", gradient: "linear-gradient(to bottom, #FFE8BE, #DDFFE3)" },
  { id: 2, title: 'Pink cake', image: 'pink-cake', bgImage: "background_banner", gradient: "linear-gradient(to bottom, #FFE1EE, #FFD6E0)" },
  { id: 3, title: 'Rose', image: 'rose', bgImage: "background_banner", gradient: "linear-gradient(to bottom, #FFE6F4, #FAD8FF)" },
  { id: 4, title: 'Red heart', image: 'red-heart', bgImage: "background_banner", gradient: "linear-gradient(to bottom, #FFE2E2, #FFEBEB)" },
  { id: 5, title: 'White christmas', image: 'white-christmas', bgImage: "background_banner", gradient: "linear-gradient(to bottom, #E8FFF3, #DDF5FF)" },
])
</script>
