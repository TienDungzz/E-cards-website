<template>
    <section class="section image-banner">
        <div class="container">
            <div class="content-section d-flex">
                <div class="banner w-50">
                    <ImageResponsive :imageName="image" :width="1000" :widths="[320, 450, 550, 768, 992]" :alt="alt" />
                </div>
                <div
                    class="content w-50 d-flex align-items-center justify-content-center flex-column gap-40 p-40 text-center"
                >
                    <div class="heading-section pb-0">
                        <h2 v-html="heading"></h2>
                    </div>
                    <div v-if="description || button" class="divider"></div>
                    <p v-show="description" class="description">{{description}}</p>
                    <Button :label="button" :icon="'arrow'" :size="32" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import Slider from '@/components/blocks/Slider.vue'
import ImageResponsive from '@/components/blocks/ImageResponsive.vue'
import Button from '@/components/blocks/Button.vue'

const props  = defineProps({
  image: { type: Text, required: true, default: 'letter' },
  alt: { type: Text, default: "Alt for image banner" },
  heading: { type: Text, required: true, default: "Choose your style" },
  description: { type: Text },
  button: { type: Text }
})
</script>
