<template>
    <div class="header">
        <img class="header-nav__image" src="@/assets/icon/logo_SpetsServisKar-2.png" alt="">
        <ul class="header-nav__list">
            <li class="header-nav__item" @click="goTo('/')"> <a class="header-nav-link">Главная</a> </li>
            <li class="header-nav__item" @click="goTo('/products')"> <a class="header-nav-link">Товары</a> </li>
            <li class="header-nav__item" @click="scrollToBottom"> <a class="header-nav-link">О нас</a> </li>
        </ul>
    </div>
</template>

<script setup>
import router from "@/router/index.js";

const goTo = (path) => {
    router.push(path)
}

const scrollToBottom = () => {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    })
}
</script>