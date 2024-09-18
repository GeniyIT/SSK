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
    const response = await axios.post('http://localhost:5000/user', {
        login: login.value,
        password: pass.value
    })
    localStorage.setItem('token', response.data.token)
    if (localStorage.getItem('token') !== null) {
        await router.push('/admin')
    } else {
        await router.push('/')
    }
}

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/feedbackForms', {
        headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })
    if (response.data.forms.length > 0) {
        await router.push('/admin')
    }
})
</script>