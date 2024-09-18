<template>
    <body class="products-page">
        <CardComponent :isAdminPanel="false" :searchUi="true"/>
    </body>
</template>

<script setup>
import CardComponent from "@/components/CardComponent.vue";
</script>
