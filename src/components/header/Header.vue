<template>
    <header ref="headerWrapper" class="header-wrapper position-sticky z-21">
        <div
            ref="headerEl"
            class="header"
            :class="{ 'is-sticky': isSticky, 'is-visible': isVisible, 'is-scrolled-far': isScrolledFar }"
        >
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
        </div>
    </header>
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
const isScrolledFar = ref(false);

const syncHeight = async () => {
  await nextTick();
  if (headerEl.value && headerWrapper.value) {
    headerHeight = headerEl.value.offsetHeight;
    headerWrapper.value.style.height = `${headerHeight}px`;
  }
};

const updateScroll = () => {
  const currentScrollY = window.scrollY;
  const farThreshold = headerHeight * 1.2;

  if (currentScrollY >= headerHeight) {
    if (!isSticky.value) {
      isSticky.value = true;
      headerWrapper.value.style.height = `${headerHeight}px`;
    }
  } else if (currentScrollY === 0) {
    isSticky.value = false;
    isVisible.value = true;
  }

  if (currentScrollY >= farThreshold) {
    isScrolledFar.value = true;
  } else {
    isScrolledFar.value = false;
  }

  if (isSticky.value) {
    const hideThreshold = headerHeight + 30;
    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
      isVisible.value = false;
    } else if (currentScrollY < lastScrollY) {
      isVisible.value = true;
    }
  } else {
    isVisible.value = false;
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
