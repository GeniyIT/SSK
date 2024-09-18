<template>
    <div class="characteristics-modal">
        <div class="characteristics-container">
            <h1 class="characteristics__title" v-if="formattedCharacteristics.length">Характеристики товара:</h1>
            <h1 v-if="!formattedCharacteristics.length">Характеристики для этого товара отсутствуют</h1>
            <article class="characteristics-card" v-else v-for="(characteristic, index) in formattedCharacteristics" :key="index">
                <h1>{{ characteristic.key }}</h1>
                <p>{{ characteristic.value }}</p>
            </article>
        </div>
        <button class="characteristics__close-button" @click="closeModal">Закрыть</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useModalStatesStore } from '@/Store/modalStates';

const props = defineProps({
    characteristics: Array
})

const modal = useModalStatesStore()
const formattedCharacteristics = ref([])

const closeModal = () => {
    modal.ModalToggle('')
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
    }).filter(char => char !== null)
}

onMounted(() => {
    formattedCharacteristics.value = formatCharacteristics(props.characteristics)
})
</script>
