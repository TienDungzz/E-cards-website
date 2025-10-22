<template>
    <header class="header">
        <div class="container">
            <div class="header-wrapper d-flex justify-content-between">
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
</template>

<script setup>
  import '@/assets/styles/header.scss';
  import Logo from '@/components/header/Logo.vue';
  import GroupIcon from '@/components/header/GroupIcon.vue';
  import ScanQR from '@/components/header/ScanQR.vue';
</script>