<template>
    <div class="get-call">
        <article class="get-call__text">
            <figure class="get-call__wrapper">
                <img class="card-img" :src="'http://localhost:5000' + productImg" alt="product image">
                <h1 class="get-call__title">{{ productTitle }}</h1>
            </figure>
            <h2 v-if="!isNumberReceived">Закажите обратный звонок</h2>
            <h2 v-if="isNumberReceived">Заявка отправлена!</h2>
            <p v-if="isNumberReceived">Менеджер позвонит вам в течение дня</p>
        </article>
        <div class="get-call__functional">
            <form class="get-call__form" @submit.prevent="onSubmit">
                <input class="get-call__input" v-if="!isNumberReceived" name="firstName" placeholder="Ваше имя" v-model="firstName" required>
                <input class="get-call__input" v-if="!isNumberReceived" name="phone" placeholder="+7 (999) 999-99-99" v-model="phone" required/>
                <button class="get-call__button" v-if="!isNumberReceived">Заказать звонок</button>
                <button class="get-call__button" v-if="isNumberReceived" @click="closeModal">Закрыть</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import {useModalStatesStore} from '@/Store/modalStates';
import axios from "axios";

const props = defineProps({
    productTitle: String,
    productImg: String
})

const firstName = ref('')
const phone = ref('')
const isNumberReceived = ref(false)
const modal = useModalStatesStore()

const onSubmit = () => {
    axios.post('http://localhost:5000/feedbackForms/create', {
        name: firstName.value,
        phone: phone.value,
        text: props.productTitle,
        email: 'Уточнить цену'
    })
    isNumberReceived.value = true
}

const closeModal = () => {
    modal.ModalToggle('')
}
</script>
