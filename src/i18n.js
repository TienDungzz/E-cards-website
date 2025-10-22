// src/i18n.js
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
// import vi from './locales/vi.json';

const i18n = createI18n({
  legacy: false, // Sử dụng Composition API (Vue 3)
  locale: localStorage.getItem('language') || 'en', // Ngôn ngữ mặc định
  fallbackLocale: 'en', // Ngôn ngữ dự phòng
  messages: {
    en
  },
});

export default i18n;