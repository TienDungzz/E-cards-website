<template>
  <div :data-theme="theme">
    <router-view />
  </div>
</template>

<script>
import { useCounterStore } from './stores/counter';
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const counter = useCounterStore();
    const theme = ref('light');

    const toggleTheme = () => {
      theme.value = theme.value === 'light' ? 'dark' : 'light';
    };

    return { counter, theme, toggleTheme };
  },
};
</script>