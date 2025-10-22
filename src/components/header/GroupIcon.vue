<template>
  <div class="group-icon-wrapper d-flex">
    <div class="group-icon-item">
        <Icon name="en-flag" />
        <span class="text">{{ t('header.en') }}</span>
    </div>
    <div class="group-icon-item">
        <Icon name="night-mode" />
        <span class="text">{{ t('header.light') }}</span>
    </div>
    <div class="group-icon-item">
        <Icon name="store" />
        <span class="text">{{ t('header.store') }}</span>
    </div>
    <div class="group-icon-item">
        <Icon name="user" />
        <span class="text">{{ t('header.login') }}</span>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  import Icon from '@/components/blocks/Icon.vue';

  const { t } = useI18n();
</script>