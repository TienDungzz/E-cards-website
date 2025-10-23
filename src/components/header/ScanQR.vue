<template>
  <div class="group-icon-wrapper d-flex align-items-center">
    <div class="group-icon-item d-flex align-items-center">
        <Icon name="qr_scan" />
        <span class="text d-none d-m-block" data-nosnippet>{{ t('header.scan_your_card') }}</span>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  import Icon from '@/components/blocks/Icon.vue';

  const { t } = useI18n();
</script>h