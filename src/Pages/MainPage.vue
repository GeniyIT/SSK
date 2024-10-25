<template>
    <body class="main-page">
        <AboutUsComponent/>
        <CardComponent :isAdminPanel="false" :isMainPage="true" :searchUi="false"/>
        <FeedbackFormComponent/>
    </body>
</template>

<script setup>
import CardComponent from "@/components/CardComponent.vue";
import FeedbackFormComponent from "@/components/FeedbackFormComponent.vue";
import AboutUsComponent from "@/components/AboutUsComponent.vue";
</script>