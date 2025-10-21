<template>
  <div class="home">
    <h1>Trang chủ</h1>
    <p>Chào mừng đến với trang chủ của bạn!</p>
  </div>
</template>

<script>
import { useCounterStore } from '../stores/counter';

export default {
  name: 'Home',
  setup() {
    const counter = useCounterStore();
    return { counter };
  },
};
</script>