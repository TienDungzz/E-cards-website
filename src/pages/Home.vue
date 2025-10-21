<template>
  <div class="home">
    <h1>Trang chủ</h1>
    <p>Chào mừng đến với trang chủ của bạn!</p>
  </div>
  <button class="btn-diagonal">Hover me</button>

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

<style>
.btn-diagonal {
  position: relative;
  overflow: hidden;
  background: #fff;
  color: #000;
  border: 2px solid #b4853e;
  padding: 12px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 1;
}

/* Tạo đường chéo */
.btn-diagonal::before {
  content: "";
  position: absolute;
  top: 0;
  left: -140%;
  width: 130%;
  height: 100%;
  background: linear-gradient(135deg, #ffc978, #b4853e);
  transform: skewX(-30deg);
  transition: all 0.5s ease;
  z-index: -1;
}

/* Khi hover: chạy qua */
.btn-diagonal:hover::before {
  left: -20%;
}

/* Khi hover: đổi màu chữ */
.btn-diagonal:hover {
  color: #fff;
}

</style>