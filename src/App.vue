<template>
    <router-view />
</template>

<script>
  import { useCounterStore } from './stores/counter';
  import { ref } from 'vue';
  import '@/assets/styles/main.scss';

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