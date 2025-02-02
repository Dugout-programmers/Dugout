<script setup>
import teamToggleIcon from "@/assets/icons/team_toggle.svg";
import { teamList } from "@/constants";
import { useTeamStore } from "@/stores/teamStore";
import { twMerge } from "tailwind-merge";
import { ref } from "vue";
import { useRouter } from "vue-router";
import EnteringComunityAnimation from "./EnteringComunityAnimation.vue";

const router = useRouter();
const isOpen = ref(false);
const teamStore = useTeamStore();

const toggleTeam = () => {
  isOpen.value = !isOpen.value;
};

const navigationAndAnimation = (team) => {
  isOpen.value = false;
  teamStore.triggerEnteringAnimation(team);
  setTimeout(() => {
    router.push(team.path);
  }, 1500);
};
</script>

<template>
  <EnteringComunityAnimation v-if="teamStore.isEnterAnimationOn" />
  <div
    v-if="isOpen"
    class="w-[770px] h-[60px] fixed bottom-[40px] left-1/2 -translate-x-1/2 flex items-center justify-center px-[25px] gap-[35px] bg-white drop-shadow-md rounded-[20px] z-50 animate-slideUp">
    <button
      v-for="(team, index) in teamList"
      :key="index"
      class="flex-shrink-0"
      @click="navigationAndAnimation(team)">
      <img :src="team.logo" class="w-[40px] h-auto" />
    </button>
  </div>
  <button
    @click="toggleTeam"
    class="fixed bottom-0 -translate-x-1/2 left-1/2 z-50">
    <img
      :src="teamToggleIcon"
      :class="
        twMerge(
          'transition-all duration-300 ease-in-out transform',
          isOpen ? '-scale-100' : 'rotate-0'
        )
      "
      alt="Team Toggle" />
  </button>
</template>

<style scoped>
@keyframes slideUp {
  0% {
    transform: translate(-50%, 20px);
    opacity: 0;
  }
  90% {
    transform: translate(-50%, 20px);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.animate-slideUp {
  animation: slideUp 0.2s ease-out forwards;
}
</style>
