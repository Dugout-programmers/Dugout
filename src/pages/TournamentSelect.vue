<script setup>
import Monitor from "@/assets/images/gamemonitor.svg";
import BadPlayer from "@/assets/images/bad_player_card.svg";
import BadPlayerGreen from "@/assets/images/bad_player_card_green.svg";
import GoodPlayer from "@/assets/images/good_player_card.svg";
import GoodPlayerGreen from "@/assets/images/good_player_card_green.svg";
import HandsomePlayer from "@/assets/images/handsome_card.svg";
import HandsomePlayerGreen from "@/assets/images/handsome_card_green.svg";
import PlayBtn from "@/assets/images/play_btn.svg";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import Modal from "@/components/common/Modal.vue";

const router = useRouter();
const selectedTournament = ref(null);

// 퀴즈 선택 핸들러
const selectTournament = (tournament) => {
  selectedTournament.value = tournament;
};

const modalStore = useModalStore();
// Start 버튼 핸들러
const startTournament = () => {
  if (selectedTournament.value) {
    router.push(`/game/tournamentselect/${selectedTournament.value}`);
  } else {
    modalStore.openModal({
      message: "토너먼트를 선택해주세요!",
      type: "oneBtn",
      onConfirm: useModalStore.closeModal,
    });
  }
};
</script>
<template>
  <Modal />
  <div class="relative w-max mx-auto">
    <img :src="Monitor" class="h-[670px]" />
    <div
      class="absolute top-[109px] left-1/2 translate-x-[-49%] w-full px-[89px] flex justify-between">
      <button
        @click="selectTournament('traitor')"
        :class="selectedTournament === 'traitor' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="selectedTournament === 'traitor' ? BadPlayerGreen : BadPlayer"
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedTournament === 'traitor' ? 'text-gameGreen' : 'text-white01'
          "
          class="font-Galmuri11 font-bold"
          >올해 최고의<br />
          역적 월드컵</span
        >
      </button>
      <button
        @click="selectTournament('hero')"
        :class="selectedTournament === 'hero' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="selectedTournament === 'hero' ? GoodPlayerGreen : GoodPlayer"
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedTournament === 'hero' ? 'text-gameGreen' : 'text-white01'
          "
          class="font-Galmuri11 font-bold"
          >올해 최고의 <br />
          영웅 월드컵</span
        >
      </button>
      <button
        @click="selectTournament('handsome')"
        :class="selectedTournament === 'handsome' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="
            selectedTournament === 'handsome'
              ? HandsomePlayerGreen
              : HandsomePlayer
          "
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedTournament === 'handsome'
              ? 'text-gameGreen'
              : 'text-white01'
          "
          class="font-Galmuri11 font-bold"
          >올해 최고의 <br />
          미남 월드컵</span
        >
      </button>
    </div>
    <button
      @click="startTournament"
      class="absolute bottom-[140px] left-1/2 translate-x-[-45%] cursor-pointer">
      <img :src="PlayBtn" />
    </button>
  </div>
</template>
<style scoped></style>
