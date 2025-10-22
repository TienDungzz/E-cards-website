<template>
  <img
    :src="computedSrc"
    :srcset="computedSrcset"
    :sizes="sizes"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
  />
</template>

<script>
export default {
  name: 'ImageResponsive',
  props: {
    imageName: {
      type: String,
      required: true,
      description: 'The name of the image (without .png extension)',
    },
    width: {
      type: [Number, String],
      required: true,
      description: 'The default width of the image',
    },
    height: {
      type: [Number, String],
      default: 'auto',
      description: 'The default height of the image (optional)',
    },
    widths: {
      type: Array,
      required: true,
      description: 'Array of widths for srcset',
    },
    sizes: {
      type: String,
      default: '(max-width: 600px) 40vw, 200px',
      description: 'Sizes attribute value for responsive images',
    },
    alt: {
      type: String,
      default: 'Responsive Image',
      description: 'Alt attribute value for the image',
    },
    loading: {
      type: String,
      default: 'lazy',
      description: 'Alt attribute value for the image',
    },
    fetchpriority: {
      type: String,
      default: 'low',
      description: 'Alt attribute value for the image',
    },
  },
  computed: {
    computedSrc() {
      const fullImageName = this.imageName.endsWith('.png') ? this.imageName : `${this.imageName}.png`;
      return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_${this.width},f_auto,q_auto/v${import.meta.env.VITE_CLOUDINARY_VERSION}/${fullImageName}`;
    },
    computedSrcset() {
      return this.widths
        .map(w => `${this.getImageSrc(w)} ${w}w`)
        .join(', ');
    },
  },
  methods: {
    getImageSrc(width) {
      const fullImageName = this.imageName.endsWith('.png') ? this.imageName : `${this.imageName}.png`;
      return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},f_auto,q_auto/v${import.meta.env.VITE_CLOUDINARY_VERSION}/${fullImageName}`;
    },
  },
};
</script>