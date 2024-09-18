<template>
    <div class="login-page">
        <div class="login-page__container">
            <form class="login-form" @submit.prevent="onSubmit">
                <h1 class="login-form__title">Авторизация</h1>
                <h1 class="login-form__login-text">Логин</h1>
                <input class="login-form__login-input" type="text" placeholder="Введите логин" v-model="login">
                <h1 class="login-form__pass-text">Пароль</h1>
                <input class="login-form__pass-input" type="password" placeholder="Введите пароль" v-model="pass">
                <button class="login-form__button">Авторизоваться</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import router from "@/router/index.js";
import axios from "axios";

const login = ref('')
const pass = ref('')

const onSubmit = async () => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user`, {
            login: login.value,
            password: pass.value
        })
        if (response.data.message === undefined) {
            localStorage.setItem('token', response.data.token)
            await router.push('/admin')
        }
    }catch(err) {
        console.error(err)
    }
}

onMounted(async () => {
    if (localStorage.getItem('token')) {
        await router.push('/admin')
    }
})
</script>