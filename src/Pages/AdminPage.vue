<template>
    <div class="admin-page">
        <header class="admin-header">
            <h1 class="admin-header__title">Админ панель</h1>
            <nav class="admin-header__nav">
                <ul class="admin-header__nav-list">
                    <li class="admin-header__nav-item" @click="buttonHandler('feedback')"><a class="admin-header__nav-button-">Обратная связь</a></li>
                    <li class="admin-header__nav-item" @click="buttonHandler('removeProducts')"><a class="admin-header__nav-button-">Удаление товаров</a></li>
                    <li class="admin-header__nav-item" @click="buttonHandler('addProducts')"><a class="admin-header__nav-button-">Добавление товаров</a></li>
                    <li class="admin-header__nav-item" @click="modalStates.ModalToggle('changePassword')"><a class="admin-header__nav-button-">Сменить пароль</a></li>
                </ul>
            </nav>
        </header>

        <div v-if="page === 'feedback'" class="admin-page__feedback">
            <table class="feedback-table">
                <thead>
                <tr>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Email</th>
                    <th>Текст</th>
                    <th>Дата</th>
                    <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="feedback in allFeedback" :key="feedback.id">
                    <td>{{ feedback.name }}</td>
                    <td>{{ feedback.phone }}</td>
                    <td>{{ feedback.email }}</td>
                    <td>{{ feedback.text }}</td>
                    <td>{{ feedback.date }}</td>
                    <td class="feedback-form__btn" @click="isCheckReply(feedback.id, feedback.checkReply)">{{ feedback.checkReply ? 'Просмотренно' : 'Не просмотренно' }}</td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-if="page === 'removeProducts'" class="admin-page__remove-products">
            <CardComponent
                :isAdminPanel="true"
                :searchUi="true"
            />
        </div>

        <div v-if="page === 'addProducts'" class="admin-page__add-products">
            <form class="add-products__form" @submit.prevent="onSubmit">
                <div class="products-form__container">
                    <h1>Введите название товара</h1>
                    <input class="products-form__input" type="text" placeholder="Введите название товара" name="title" v-model="title">
                </div>

                <div class="products-form__container">
                    <h1>Загрузите картинку</h1>
                    <input class="products-form__image-input" type="file" @change="handleFileUpload">
                </div>

                <div class="products-form__container">
                    <h1>Введите описание товара</h1>
                    <textarea class="products-form__description-input" v-model="description" rows="5" placeholder="Введите описание товара" name="description"></textarea>
                </div>

                <div class="products-form__container">
                    <h1>Характеристики товара</h1>
                    <div v-for="(characteristic, index) in characteristics" :key="index" class="products-form__characteristics-item">
                        <input class="products-form__input" type="text" placeholder="Название характеристики" v-model="characteristic.key" required>
                        <input class="products-form__input" type="text" placeholder="Значение характеристики" v-model="characteristic.value" required>
                        <button class="remove-characteristic-button" type="button" @click="removeCharacteristic(index)">Удалить</button>
                    </div>
                    <button class="products-form__characteristics-button" type="button" @click="addCharacteristic">Добавить характеристику</button>
                </div>

                <div class="products-form__container">
                    <h1>Введите цену товара</h1>
                    <input class="products-form__input" type="number" placeholder="Введите цену товара" name="price" v-model="price">
                </div>
                <button class="products-form__submit-button" type="submit">Добавить товар</button>
            </form>
        </div>
    </div>

    <teleport to="body">
        <ModalWindowComponent v-if="modalStates.ModalStatus === 'changePassword'">
            <ChangePasswordModal/>
        </ModalWindowComponent>
    </teleport>
</template>

<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import CardComponent from "@/components/CardComponent.vue";
import {useModalStatesStore} from "@/Store/modalStates.js";
import ModalWindowComponent from "@/components/ModalWindowComponent.vue";
import ChangePasswordModal from "@/modals/ChangePasswordModal.vue";
import router from "@/router/index.js";

const page = ref('feedback')
const title = ref('')
const imageFile = ref(null)
const description = ref('')
const characteristics = ref([{ key: '', value: '' }])
const price = ref(0)

const searchProducts = ref('')

const allProducts = ref([])
const allFeedback = ref([])

const modalStates = useModalStatesStore()

const addCharacteristic = () => {
    characteristics.value.push({ key: '', value: '' })
}

const removeCharacteristic = (index) => {
    characteristics.value.splice(index, 1)
}

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

const formatDate = (isoDate) => {
    const date = new Date(isoDate)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}`
}

const getFeedback = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedbackForms`, {
            headers: {
                authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const forms = response.data.forms

            .sort((a, b) => b.id - a.id)
        allFeedback.value = forms.map(form => ({
            ...form,
            date: formatDate(form.date)
        }))
    } catch (error) {
        console.error(error)
    }
}

const getProducts = async () => {
    try {
        const response = await axios.get('http://localhost:5000/products')
        allProducts.value = response.data.map(product => ({
            ...product,
            characteristics: formatCharacteristics(product.characteristics)
        }))
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
    }
}

const onSubmit = async () => {
    const formData = new FormData()
    formData.append('image', imageFile.value)

    const responseImage = await axios.post('http://localhost:5000/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    imageFile.value = responseImage.data.path

    const characteristicsArray = characteristics.value.map(char => `${char.key}: ${char.value}`)

    await axios.post('http://localhost:5000/products/add', {
        title: title.value,
        imageUrl: imageFile.value,
        description: description.value,
        characteristics: characteristicsArray,
        price: price.value
    },
        {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
    resetForm()
}

const handleFileUpload = (event) => {
    imageFile.value = event.target.files[0]
}

const buttonHandler = (btnName) => {
    if (btnName === 'removeProducts') {
        getProducts()
        page.value = btnName
    } else if (btnName === 'feedback') {
        getFeedback()
        page.value = btnName
    }
    else{
        page.value = btnName
    }
}

const resetForm = () => {
    title.value = ''
    imageFile.value = null
    description.value = ''
    characteristics.value = [{ key: '', value: '' }]
    price.value = 0
}

const isCheckReply = async (id, checkReplyStatus) => {
    if (!checkReplyStatus) {
        await axios.post('http://localhost:5000/feedbackForms/setReplyTrueForm', {
            id: id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
        )
        await getFeedback()

    }
    else {
        await axios.post('http://localhost:5000/feedbackForms/setReplyFalseForm', {
            id: id
        },
            {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
        await getFeedback()
    }
}

onMounted(() => {
    getFeedback()
    if (localStorage.getItem('token') === null) {
        router.push('/login')
    }
    console.log(import.meta.env.VITE_BACKEND_URL)
})
</script>