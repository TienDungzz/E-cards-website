<template>
  <div class="logo-wrapper">
    <ImageResponsive
      :imageName="'logo'"
      :width="100"
      :widths="[320, 480]"
      :sizes="'(max-width: 600px) 40vw, 200px'"
      :alt="'Logo E-cards website'"
      :loading="'eager'"
      :fetchpriority="'hight'"
    />
  </div>
</template>

<script setup>
  import ImageResponsive from '@/components/blocks/ImageResponsive.vue';
</script>