<template>
    <div v-if="searchUi" class="card-products__search-container">
        <div class="card-products__search">
            <img src="@/assets/icon/searchIcon.svg" height="24" width="24" alt="поиск">
            <input type="text" placeholder="Поиск по каталогу товаров" v-model="searchQuery">
        </div>
    </div>

    <div class="card">
        <div class="card-wrapper" v-for="product in filteredProducts" :key="product.id">
            <figure class="card-image">
                <img class="card-img" :src="`${backendUrl}${product.imageUrl}`" alt="product image">
            </figure>
            <h3 class="card-title">{{ product.title }}</h3>
            <div class="card-description">{{ product.description }}</div>
            <div class="card-price">
                <h3 class="card-price__text">Цена: от {{ product.price }} ₽</h3>
                <div class="card-price__button">
                    <button v-if="!isAdminPanel" class="card-price__button-price" @click="openModal('getPrice', product)">Уточнить цену</button>
                    <button v-if="isAdminPanel" class="card-price__button-remove" @click="removeProducts(product.id)">Удалить товар</button>
                    <button class="card-price__button-characteristics" @click="openModal('characteristics', product)">Характеристики</button>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <ModalWindowComponent v-if="modalStates.ModalStatus === `getPrice${currentProductId}`">
            <GetPriceModal
                :product-title="currentProduct.title"
                :product-img="currentProduct.imageUrl"
            />
        </ModalWindowComponent>
    </Teleport>

    <Teleport to="body">
        <ModalWindowComponent v-if="modalStates.ModalStatus === `characteristics${currentProductId}`">
            <CharacteristicsModal
                :characteristics="currentProduct.characteristics"
            />
        </ModalWindowComponent>
    </Teleport>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useModalStatesStore } from "@/Store/modalStates.js";
import ModalWindowComponent from "@/components/ModalWindowComponent.vue";
import GetPriceModal from "@/modals/GetPriceModal.vue";
import axios from "axios";
import router from "@/router/index.js";
import CharacteristicsModal from "@/modals/CharacteristicsModal.vue";

const backendUrl = import.meta.env.VITE_BACKEND_URL
const modalStates = useModalStatesStore()
const currentProductId = ref(null)
const currentProduct = ref({})
const allProducts = ref([])
const searchQuery = ref('')

const props = defineProps({
    isAdminPanel: Boolean,
    searchUi: Boolean
})

const formatCharacteristics = (characteristicsArray) => {
    return characteristicsArray.map(characteristic => {
        const colonIndex = characteristic.indexOf(':')
        if (colonIndex === -1) {
            return null
        }
        const key = characteristic.slice(0, colonIndex + 1).trim()
        const value = characteristic.slice(colonIndex + 1).trim()
        return { key, value }
    }).filter(char => char && char.key && char.value)
}

const getProducts = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`)
        allProducts.value = await response.data.map(product => ({
            ...product,
            characteristics: formatCharacteristics(product.characteristics)
        }));
        if (router.currentRoute.value.path === '/') {
            allProducts.value = await response.data.slice(0, 5)
        } else {
            allProducts.value = await response.data
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
    }
}

const openModal = (name, product) => {
    currentProductId.value = product.id
    currentProduct.value = product
    if (name === 'getPrice') {
        modalStates.ModalToggle(`getPrice${product.id}`)
    } else if (name === 'characteristics') {
        modalStates.ModalToggle(`characteristics${product.id}`)
    }
}

const removeProducts = async (id) => {
    try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/products/remove`, {
            idProduct: id
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        await getProducts()
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
}

const filteredProducts = computed(() => {
    if (!searchQuery.value) {
        return allProducts.value
    }
    return allProducts.value.filter(product =>
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

onMounted(async () => {
    await getProducts()
})
</script>
