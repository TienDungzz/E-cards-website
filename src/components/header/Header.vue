<template>
    <div ref="headerWrapper" class="header-wrapper">
        <header class="header" :class="{ 'is-sticky': isSticky, 'is-visible': isVisible }">
            <div class="container">
                <div class="header-inner d-flex justify-content-between">
                    <div class="header-item d-flex justify-content-start">
                        <ScanQR />
                    </div>
                    <div class="header-item d-flex justify-content-center">
                        <Logo />
                    </div>
                    <div class="header-item d-flex justify-content-end">
                        <GroupIcon />
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import '@/assets/styles/header.scss';
import Logo from '@/components/header/Logo.vue';
import GroupIcon from '@/components/header/GroupIcon.vue';
import ScanQR from '@/components/header/ScanQR.vue';

// Refs
const headerWrapper = ref(null);
const headerEl = ref(null);
const isSticky = ref(false);
const isVisible = ref(true);
let lastScrollY = 0;
let ticking = false;
let headerHeight = 0;

// Cập nhật chiều cao (wrapper = inner)
const syncHeight = async () => {
  await nextTick();
  if (headerEl.value) {
    headerHeight = headerEl.value.offsetHeight;
    if (headerWrapper.value) {
      headerWrapper.value.style.height = `${headerHeight}px`;
    }
  }
};

const updateScroll = () => {
  const currentScrollY = window.scrollY;

  // Bật sticky khi cuộn qua header
  if (currentScrollY > headerHeight) {
    if (!isSticky.value) isSticky.value = true;
  } else {
    isSticky.value = false;
    isVisible.value = true;          // luôn hiện khi chưa qua header
  }

  // Ẩn/hiện khi đang sticky
  if (isSticky.value) {
    const hideThreshold = headerHeight + 30; // tránh nhấp nháy
    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
      isVisible.value = false;
    } else if (currentScrollY < lastScrollY) {
      isVisible.value = true;
    }
  }

  lastScrollY = currentScrollY;
  ticking = false;
};

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScroll);
    ticking = true;
  }
};

const onResize = () => {
  syncHeight();
};

onMounted(() => {
  syncHeight();
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
});
</script>
