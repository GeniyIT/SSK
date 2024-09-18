<template>
    <HeaderComponent v-if="router.currentRoute.value.path ==='/' || router.currentRoute.value.path === '/products'"/>
    <RouterView/>
    <FooterComponent v-if="router.currentRoute.value.path ==='/' || router.currentRoute.value.path === '/products'"/>
</template>

<script setup>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import router from "@/router/index.js";
</script>

<style scoped>

</style>
