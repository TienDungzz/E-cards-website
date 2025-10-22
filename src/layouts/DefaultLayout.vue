<template>
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
</template>

<script setup>
import Header from '@/components/header/Header.vue';
import Footer from '@/components/Footer.vue';
</script>
