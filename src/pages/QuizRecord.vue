<script setup>
import Monitor from "@/assets/images/gamemonitor.svg";
import { getRandomQuestions } from "@/utils/getRandomQuizs";
import { useGameStart } from "@/utils/useGameStart";
import { computed, ref } from "vue";

// 게임 시작 전 [QUIZ START] 화면 3초동안 출력
const { isGameStarting } = useGameStart();

// 퀴즈
const allQuestions = ref([]); // 모든 문제
const shuffledQuestions = ref([]); // 랜덤 추출한 문제
const currentIndex = ref(0); // 현재 문제 인덱스

const userAnswer = ref("");
const showResult = ref(false);
const isCorrect = ref(false);
const score = ref(0);
const isQuizEnd = ref(false);

// JSON 데이터 가져오기
const fetchQuestions = async () => {
  try {
    const response = await fetch(
      "https://dugout-programmers.github.io/Dugout/api/games/recordQuiz.json"
    ); // JSON 파일 경로
    if (!response.ok)
      throw new Error(`퀴즈를 불러오는 데 실패했습니다 ${error}`);
    const data = await response.json();
    allQuestions.value = data.questions;

    // 문제 10개 추출
    shuffledQuestions.value = getRandomQuestions(allQuestions.value, 10);
  } catch (error) {
    console.error("데이터를 불러오는 중 오류 발생:", error);
  }
};

fetchQuestions();

// 현재 문제
const currentQuestion = computed(() => {
  if (!shuffledQuestions.value || shuffledQuestions.value.length === 0)
    return null;
  return currentIndex.value < shuffledQuestions.value.length
    ? shuffledQuestions.value[currentIndex.value]
    : null;
});

// 다음 문제로 이동
const nextQuestion = () => {
  if (currentIndex.value < shuffledQuestions.value.length - 1) {
    currentIndex.value++;
    userAnswer.value = "";
    showResult.value = false;
    isCorrect.value = false;
  } else {
    isQuizEnd.value = true;
  }
};

// 답안 제출
const submitAnswer = () => {
  if (!userAnswer.value || !currentQuestion.value) return;

  try {
    isCorrect.value = currentQuestion.value.answer.some(
      (answer) =>
        answer.toLowerCase().replace(/\s+/g, "") ===
        userAnswer.value.toLowerCase().replace(/\s+/g, "").trim()
    );
    if (isCorrect.value) score.value++;
    showResult.value = true;
  } catch (error) {
    console.error(`답안 제출 중 오류 발생: ${error}`);
  }
};

// 퀴즈 재시작
const retryQuiz = () => {
  currentIndex.value = 0;
  score.value = 0;
  isQuizEnd.value = false;
  showResult.value = false;
  isCorrect.value = false;
  userAnswer.value = "";
  shuffledQuestions.value = getRandomQuestions(allQuestions.value, 10);
};
</script>
<template>
  <div class="relative mx-auto w-max">
    <img :src="Monitor" class="h-[670px]" />
    <div
      class="absolute top-[109px] left-1/2 translate-x-[-49%] w-full px-[89px] flex justify-between">
      <!-- Game Start (3s) -->
      <div
        v-if="isGameStarting"
        class="text-[30px] text-white01 font-bold flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-[90px]">
        <p class="font-Galmuri11">QUIZ</p>
        <p class="font-Galmuri11">START</p>
      </div>
      <!-- 게임 화면 -->
      <div v-else>
        <!-- 퀴즈 종료 -->
        <div
          v-if="isQuizEnd"
          class="text-white01 w-[80%] flex flex-col gap-[60px] items-center absolute left-1/2 -translate-x-1/2 top-0">
          <div class="flex flex-col items-center">
            <p class="font-Galmuri11">퀴즈 종료!</p>
            <p class="font-Galmuri11 text-[24px]">
              10개 퀴즈 중 {{ score }}개 정답
            </p>
          </div>
          <button
            @click="retryQuiz"
            class="font-Galmuri11 font-bold text-[26px] text-black01 leading-[26px] bg-gameGreen px-[25px] py-[7px] rounded-[10px]">
            RETRY
          </button>
        </div>

        <!-- 퀴즈 화면 -->
        <div
          v-else-if="currentQuestion"
          class="text-white01 w-[80%] flex flex-col gap-[50px] items-center absolute left-1/2 -translate-x-1/2 top-0">
          <div class="flex flex-col items-center gap-[10px]">
            <p class="font-Galmuri11">{{ currentIndex + 1 }}번째 문제</p>
            <p class="font-Galmuri11 text-[24px] break-keep text-center">
              {{ currentQuestion.question }}
            </p>
          </div>
          <!-- 답안 입력 -->
          <div v-if="!showResult" class="flex items-center gap-[20px]">
            <input
              v-model="userAnswer"
              class="w-[250px] px-[10px] py-[8px] rounded-[10px] text-black01 focus:outline-0"
              placeholder="답안을 입력하세요"
              @keyup.enter="submitAnswer" />
            <button
              @click="submitAnswer"
              class="font-Galmuri11 font-bold text-[20px] text-black01 bg-gameGreen px-[20px] py-[5px] rounded-[8px]">
              제출
            </button>
          </div>
          <!-- 정답 여부 출력 및 다음 문제로 이동 -->
          <div v-else class="flex flex-col items-center gap-[20px]">
            <p
              class="font-Galmuri11 text-[24px]"
              :class="{
                'text-gameGreen': isCorrect,
                'text-red-500': !isCorrect,
              }">
              {{ isCorrect ? "정답입니다!" : "틀렸습니다." }}
            </p>
            <button
              @click="nextQuestion"
              class="font-Galmuri11 font-bold text-[26px] text-black01 leading-[26px] bg-gameGreen px-[25px] py-[7px] rounded-[10px]">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
