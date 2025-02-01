<script setup>
import Footer from "@/components/ui/Footer.vue";
import Header from "@/components/ui/Header.vue";
import Sidebar from "@/components/ui/Sidebar.vue";
import { RouterView } from "vue-router";
</script>
<template>
  <div class="flex flex-col items-center justify-start w-full min-h-screen">
    <Header />
    <Sidebar />
    <!-- 남은 부분 들어갈 컨텐츠 -->
    <div
      class="mt-[100px] ml-[190px] flex-grow w-[calc(100%-190px)] bg-white01"
    >
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
<style scoped></style>
