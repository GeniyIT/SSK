<template>
    <div class="change-password">
        <form class="change-password__form" @submit.prevent="onSubmit">
            <h1>Введите новый пароль</h1>
            <input class="change-password__input" type="password" v-model="newPassword" placeholder="Введите новый пароль" required>
            <h1>Повторите пароль</h1>
            <input class="change-password__input" type="password" v-model="repeatPassword" placeholder="Повторите пароль" required>
            <button type="submit">Сменить пароль</button>
        </form>
        <h1 v-if="!statusPassword" style="text-align: center">Пароли не совпадают</h1>
    </div>
</template>

<script setup>
import {ref} from "vue";
import axios from "axios";
import {useModalStatesStore} from "@/Store/modalStates.js";
import router from "@/router/index.js";

const modalStates = useModalStatesStore()

const newPassword = ref('')
const repeatPassword = ref('')
const statusPassword = ref(true)

const onSubmit = async () => {
    if(newPassword.value === repeatPassword.value) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/changePassword`, {
                    newPassword: newPassword.value
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
            modalStates.ModalToggle('')
        } catch (error) {
            if (error.response && error.response.data && error.response.status === 401) {
                console.error('Ошибка авторизации: токен недействителен или отсутствует')
                localStorage.removeItem('token')
                await router.push('/login')
            }
            else {
                console.error('Произошла ошибка:', error)
            }
        }

    } else {
        newPassword.value = ''
        repeatPassword.value = ''
        statusPassword.value = false
    }
}
</script>