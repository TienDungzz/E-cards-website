<template>
  <div class="group-icon-wrapper d-flex align-items-center">
    <div class="group-icon-item d-none d-xl-flex">
        <Icon name="en-flag" />
        <span class="text d-none d-xxl-block" data-nosnippet>{{ t('header.en') }}</span>
    </div>
    <div class="group-icon-item d-none d-xl-flex">
        <Icon name="night-mode" />
        <span class="text d-none d-xxl-block" data-nosnippet>{{ t('header.light') }}</span>
    </div>
    <div class="group-icon-item d-none d-xl-flex">
        <Icon name="store" />
        <span class="text d-none d-xxl-block" data-nosnippet>{{ t('header.store') }}</span>
    </div>
    <div class="group-icon-item d-none d-xl-flex">
        <Icon name="user" />
        <span class="text d-none d-xxl-block" data-nosnippet>{{ t('header.login') }}</span>
    </div>
    <div class="group-icon-item d-xl-none">
        <Icon name="menu" />
        <span class="text d-none d-xxl-block" data-nosnippet>{{ t('header.menu') }}</span>
    </div>
  </div>
</template>

<script setup>
  import { useI18n } from 'vue-i18n';
  import Icon from '@/components/blocks/Icon.vue';

  const { t } = useI18n();
</script>