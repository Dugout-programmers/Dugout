<script setup>
import Monitor from "@/assets/images/gamemonitor.svg";
import InfoQuiz from "@/assets/images/info_quiz_card.svg";
import InfoQuizGreen from "@/assets/images/info_quiz_card_green.svg";
import PlayerQuiz from "@/assets/images/player_quiz_card.svg";
import PlayerQuizGreen from "@/assets/images/player_quiz_card_green.svg";
import RecordQuiz from "@/assets/images/record_quiz_card.svg";
import RecordQuizGreen from "@/assets/images/record_quiz_card_green.svg";
import PlayBtn from "@/assets/images/play_btn.svg";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useModalStore } from "@/stores/useModalStore";
import Modal from "@/components/common/Modal.vue";

const router = useRouter();
const selectedQuiz = ref(null);

// 퀴즈 선택 핸들러
const selectQuiz = (quiz) => {
  selectedQuiz.value = quiz;
};

const modalStore = useModalStore();
// Start 버튼 핸들러
const startQuiz = () => {
  if (selectedQuiz.value) {
    router.push(`/game/quizselect/${selectedQuiz.value}`);
  } else {
    modalStore.openModal({
      message: "퀴즈를 선택해주세요!",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
  }
};
</script>
<template>
  <Modal />
  <div class="relative mx-auto w-max">
    <img :src="Monitor" class="h-[670px]" />
    <div
      class="absolute top-[109px] left-1/2 translate-x-[-49%] w-full px-[89px] flex justify-between">
      <button
        @click="selectQuiz('triviaquiz')"
        :class="selectedQuiz === 'triviaquiz' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="selectedQuiz === 'triviaquiz' ? InfoQuizGreen : InfoQuiz"
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedQuiz === 'triviaquiz' ? 'text-gameGreen' : 'text-white01'
          "
          class="font-bold font-Galmuri11"
          >야구 상식 퀴즈</span
        >
      </button>
      <button
        @click="selectQuiz('playerquiz')"
        :class="selectedQuiz === 'playerquiz' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="selectedQuiz === 'playerquiz' ? PlayerQuizGreen : PlayerQuiz"
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedQuiz === 'playerquiz' ? 'text-gameGreen' : 'text-white01'
          "
          class="font-bold font-Galmuri11"
          >선수 맞추기</span
        >
      </button>
      <button
        @click="selectQuiz('recordquiz')"
        :class="selectedQuiz === 'recordquiz' ? 'text-gameGreen' : ''"
        class="flex flex-col justify-center items-center gap-[16px] cursor-pointer">
        <img
          :src="selectedQuiz === 'recordquiz' ? RecordQuizGreen : RecordQuiz"
          class="h-[217px] flex-1 object-contain" />
        <span
          :class="
            selectedQuiz === 'recordquiz' ? 'text-gameGreen' : 'text-white01'
          "
          class="font-bold font-Galmuri11"
          >야구 기록 퀴즈</span
        >
      </button>
    </div>
    <button
      @click="startQuiz"
      class="absolute bottom-[140px] left-1/2 translate-x-[-45%] cursor-pointer">
      <img :src="PlayBtn" />
    </button>
  </div>
</template>
<style scoped></style>
