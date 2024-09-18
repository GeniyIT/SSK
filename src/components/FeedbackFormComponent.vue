<template>
    <div class="feedback-form">
        <form class="feedback-form__form" @submit.prevent="btnHandler" v-if="!isSend">
            <input class="feedback-form__input" type="text" v-model="name" name="name" placeholder="Ваше имя" required/>
            <input class="feedback-form__input" type="tel" v-model="phone" name="phone" placeholder="+7 (999) 999-99-99" required/>
            <input class="feedback-form__input" type="email" v-model="email" name="email" placeholder="Адрес электронной почты"/>
            <textarea class="input__text" v-model="textArea" rows="5" placeholder="Напишите что бы вы хотели узнать"></textarea>
            <button class="feedback-form__button" type="submit" @click="">Жду звонок</button>
        </form>
    </div>
    <h1 class="feedback-form__title" v-if="isSend">Звонок заказан!</h1>
</template>

<script setup>
import {ref} from "vue";
import axios from "axios";

const name = ref('')
const phone = ref('')
const email = ref('')
const textArea = ref('')

const isSend = ref(false)

const btnHandler = (() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/feedbackForms/create`, {
        name: name.value,
        phone: phone.value,
        text: textArea.value,
        email: email.value
    })
    isSend.value = true
})
</script>