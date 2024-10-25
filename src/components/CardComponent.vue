<template>
    <div v-if="searchUi" class="card-products__search-container">
        <div class="card-products__search">
            <img src="@/assets/icon/searchIcon.svg" height="24" width="24" alt="поиск">
            <input type="text" placeholder="Поиск по каталогу товаров" v-model="searchQuery">
        </div>
    </div>
    <div class="card-products__buttons-container" v-if="isMainPage === false">
        <button class="card-products__button-product" :style="productButtonStyle"
            @click="isPart = false">Продукты</button>
        <button class="card-products__button-part" :style="partButtonStyle" @click="isPart = true">Запчасти</button>
    </div>
    <div class="card" v-if="isPart === false">
        <div class="card-wrapper" v-for="product in filteredProducts" :key="product.id">
            <figure class="card-image">
                <img class="card-img" :src="`${backendUrl}${product.imageUrl}`" alt="product image">
            </figure>
            <h3 class="card-title">{{ product.title }}</h3>
            <div class="card-description">{{ product.description }}</div>
            <div class="card-price">
                <h3 class="card-price__text">Цена: от {{ product.price }} ₽</h3>
                <div class="card-price__button">
                    <button v-if="!isAdminPanel" class="card-price__button-price"
                        @click="openModal('getPrice', product)">Уточнить цену</button>
                    <button v-if="isAdminPanel" class="card-price__button-remove"
                        @click="removeProducts(product.id)">Удалить товар</button>
                    <button class="card-price__button-characteristics"
                        @click="openModal('characteristics', product)">Характеристики</button>
                </div>
            </div>
        </div>
    </div>
    <div class="card" v-if="isPart === true">
        <div class="card-wrapper" v-for="product in filteredProducts" :key="product.id">
            <figure class="card-image">
                <img class="card-img" :src="`${backendUrl}${product.imageUrl}`" alt="product image">
            </figure>
            <h3 class="card-title">{{ product.title }}</h3>
            <div class="card-description">{{ product.description }}</div>
            <div class="card-price">
                <h3 class="card-price__text">Цена: от {{ product.price }} ₽</h3>
                <div class="card-price__button">
                    <button v-if="!isAdminPanel" class="card-price__button-price"
                        @click="openModal('getPrice', product)">Уточнить цену</button>
                    <button v-if="isAdminPanel" class="card-price__button-remove"
                        @click="removeProducts(product.id)">Удалить товар</button>
                    <button class="card-price__button-characteristics"
                        @click="openModal('characteristics', product)">Характеристики</button>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <ModalWindowComponent v-if="modalStates.ModalStatus === `getPrice${currentProductId}`">
            <GetPriceModal :product-title="currentProduct.title" :product-img="currentProduct.imageUrl" />
        </ModalWindowComponent>
    </Teleport>

    <Teleport to="body">
        <ModalWindowComponent v-if="modalStates.ModalStatus === `characteristics${currentProductId}`">
            <CharacteristicsModal :characteristics="currentProduct.characteristics" />
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
const allPart = ref([])
const searchQuery = ref('')
const isPart = ref(false)

const props = defineProps({
    isAdminPanel: Boolean,
    searchUi: Boolean,
    isMainPage: Boolean
})

const productButtonStyle = computed(() => {
    return isPart.value
        ? {}
        : {
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
        };
});

const partButtonStyle = computed(() => {
    return isPart.value
        ? {
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid black',
        }
        : {};
});

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

const getPart = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/product/part/`)
        allPart.value = await response.data.map(product => ({
            ...product,
            characteristics: formatCharacteristics(product.characteristics)
        }));
        if (router.currentRoute.value.path === '/') {
            allPart.value = await response.data.slice(0, 5)
        } else {
            allPart.value = await response.data
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
    if (isPart.value === false) {
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
    else if (isPart.value === true) {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/product/part/`, {
                data: {
                    id: id
                },
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }

            )
            await getPart()
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
}

const filteredProducts = computed(() => {
    if (props.isMainPage) {
        const recentProducts = allProducts.value.slice(-5);
        const recentParts = allPart.value.slice(-5);
        const combined = [...recentProducts, ...recentParts]
        return combined;
    }
    else if (!props.isMainPage) {
        if (!searchQuery.value) {
            if (isPart.value === false) {
                return allProducts.value
            }
            else if (isPart.value === true) {
                return allPart.value
            }
            else {
                return console.log('Ошибка получения товаров или запчастей')
            }

        }
        else if (isPart.value === false) {
            return allProducts.value.filter(product =>
                product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
        } else if (isPart.value === true) {
            return allPart.value.filter(product =>
                product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
            )
        } else {
            return console.log('Ошибка фильтрации товаров или запчастей')
        }
    }
    else {
        console.log('Ошибка MainPage filter');
    }

})

onMounted(() => {
    getProducts()
    getPart()
})
</script>
