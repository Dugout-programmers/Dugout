<script setup>
import gameMonitor from "@/assets/images/gamemonitor.svg";
import baseBallMiniGame from "@/assets/images/baseballminigame.svg";
import ballWhite from "@/assets/images/ballwhite.svg";
import ballColor from "@/assets/images/ballcolor.svg";
import PlayBtn from "@/assets/images/play_btn.svg";
import RetryBtn from "@/assets/images/retry_btn.svg";
import Ball from "@/assets/images/baseball_ball.svg";
import { nextTick, ref } from "vue";
import { useGameStart } from "@/utils/useGameStart";
import { getCurrentUser } from "../api/supabase-api/userInfo";
import {
  createBaseballGame,
  updateBaseballGame,
} from "@/api/supabase-api/baseballGame";
import { supabase } from "@/supabase";
import { useAuthStore } from "@/stores/auth";

const isGameStarted = ref(false);
const attempts = ref(0);
const maxAttempts = 10;
const targetNumber = ref([]); // 맞춰야 할 4자리 숫자
const inputs = ref(["", "", "", ""]); // 사용자 입력값
const gameMessages = ref([]); // 게임 메시지 기록
const isGameOver = ref(false);
const isWin = ref(false);
const chatContainer = ref(null); // 채팅 영역 자동 스크롤
const auth = useAuthStore();

// 메시지가 추가될 때마다 스크롤을 최하단으로 이동
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// 게임 시작 전 [QUIZ START] 화면 3초동안 출력
const { isGameStarting } = useGameStart();

// 랜덤한 4자리 숫자 생성 (중복 없이)
const generateRandomNumber = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i); // 0-9
  const result = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result.push(numbers.splice(randomIndex, 1)[0]);
  }
  return result;
};

// 게임 시작
const startGame = async () => {
  isGameStarted.value = true;
  isGameOver.value = false;
  isWin.value = false;
  targetNumber.value = generateRandomNumber();
  attempts.value = 0;
  gameMessages.value = [];

  // 게임 시작 시 기록 확인 및 생성
  if (auth.user) {
    const { data } = await supabase
      .from("baseball_game_record")
      .select()
      .eq("member_id", auth.user.id)
      .single();

    if (!data) {
      await createBaseballGame({ member_id: auth.user.id });
    }
  }
};

// 스트라이크와 볼 계산
const calculateResult = (guess) => {
  let strikes = 0;
  let balls = 0;

  guess.forEach((num, index) => {
    if (num === targetNumber.value[index]) {
      strikes++;
    } else if (targetNumber.value.includes(Number(num))) {
      balls++;
    }
  });

  return { strikes, balls };
};

// 입력 처리
const handleInput = (index, event) => {
  const value = event.target.value;

  // 숫자만 입력 가능
  if (!/^\d*$/.test(value)) {
    event.target.value = "";
    return;
  }

  inputs.value[index] = value;

  // 다음 입력칸으로 이동
  if (value && index < 3) {
    const nextInput = event.target.nextElementSibling;
    if (nextInput) nextInput.focus();
  }

  // 모든 입력이 완료되면 결과 처리
  if (inputs.value.every((input) => input !== "") && index === 3) {
    submitGuess();
    // 첫 번째 입력창으로 포커스 이동
    const firstInput = event.target.parentElement.firstElementChild;
    if (firstInput) firstInput.focus();
  }
};

// 백스페이스 처리
const handleKeyDown = (index, event) => {
  if (event.key === "Backspace") {
    if (inputs.value[index] === "") {
      // 현재 입력값이 비어있을 때 이전 입력창으로 이동
      if (index > 0) {
        const prevInput = event.target.previousElementSibling;
        if (prevInput) {
          prevInput.focus();
          inputs.value[index - 1] = ""; // 이전 입력값 삭제
        }
      }
    } else {
      // 현재 입력값이 있을 때는 그 값을 삭제
      inputs.value[index] = "";
    }
  }
};

// 추측 제출
const submitGuess = async () => {
  const guess = inputs.value.map(Number);
  const { strikes, balls } = calculateResult(guess);
  attempts.value++;

  // 메시지 순서 변경: 사용자 입력 먼저, 결과 나중에
  gameMessages.value = [
    ...gameMessages.value,
    {
      type: "guess",
      text: `당신의 볼 번호는 (${inputs.value.join(") (")})`,
    },
    {
      type: "result",
      text: `${strikes} 스트라이크 ${balls} 볼입니다!`,
    },
  ];

  // 입력값 초기화 및 첫 번째 입력창으로 포커스 이동
  inputs.value = ["", "", "", ""];
  const firstInput = document.querySelector("input");
  if (firstInput) firstInput.focus();

  // 메시지 추가 후 스크롤 이동
  nextTick(() => {
    scrollToBottom();
  });

  // 게임 종료 조건 체크
  if (strikes === 4 || attempts.value >= maxAttempts) {
    isGameStarted.value = false;
    isGameOver.value = true;
    isWin.value = strikes === 4;

    // 승리한 경우 기록 업데이트
    if (isWin.value && auth.user) {
      await updateBaseballGame(auth.user.id);
    }
  }
};
</script>
<template>
  <div class="flex justify-center">
    <div class="relative">
      <img :src="gameMonitor" alt="모니터 사진" class="h-[670px]" />
      <!-- 모니터 레이아웃 -->
      <div
        class="absolute w-[586px] h-[387px] left-[71px] top-[43px] flex justify-center items-center">
        <!-- 게임 설명 화면 -->
        <div
          v-if="!isGameStarted && !isGameOver"
          class="flex flex-col items-center justify-center gap-[25px]">
          <!-- 제목 -->
          <img
            :src="baseBallMiniGame"
            alt="야구 미니 게임"
            class="w-[237px] h-[47px]" />
          <!-- 설명 -->
          <div class="flex flex-col items-center font-bold text-white01">
            <span class="font-Galmuri11">
              나와 상대방에게 무작위의 4자리 숫자가 주어집니다.
            </span>
            <span class="font-Galmuri11">랜덤으로 첫 질문자를 정합니다.</span>
            <span class="font-Galmuri11">
              질문자는 상대방의 숫자를 예측해 질문합니다.
            </span>
            <span class="font-Galmuri11">
              답변자는 질문자가 맞춘 숫자에 따라 답변합니다.
            </span>
          </div>
          <!-- 볼 / 스트라이크 설명 -->
          <div class="flex w-full text-white01">
            <div class="flex flex-col items-center justify-between w-1/2">
              <div class="flex flex-col items-center font-bold">
                <span class="font-Galmuri11"
                  ><span class="font-Galmuri11 text-gameGreen">숫자</span>만
                  맞추면</span
                >
                <span class="font-Galmuri11 text-gameGreen">볼</span>
              </div>

              <img :src="ballWhite" alt="흰색 공" class="w-[55px] h-[55px]" />
            </div>
            <div class="flex flex-col items-center w-1/2 gap-3">
              <div class="flex flex-col items-center font-bold">
                <span class="font-Galmuri11"
                  >숫자와
                  <span class="font-Galmuri11 text-gameGreen">자리까지</span>
                  맞추면</span
                >
                <span class="font-Galmuri11 text-gameGreen">스트라이크</span>
              </div>
              <img :src="ballColor" alt="컬러 공" class="w-[55px] h-[55px]" />
            </div>
          </div>
        </div>
        <!-- 게임 결과 화면 -->
        <div
          v-else-if="isGameOver"
          class="text-white01 flex flex-col items-center">
          <p class="font-Galmuri11 font-bold text-[20px] mb-[10px]">
            상대방의 번호는
          </p>
          <div class="flex justify-between items-center">
            <div
              class="flex items-center gap-[10px] font-bold text-[20px] text-black01">
              <div
                v-for="(number, index) in targetNumber"
                :key="index"
                class="relative">
                <img :src="Ball" class="w-[40px] h-[40px] top-0 left-0" />
                <p class="font-Galmuri11 absolute left-[15px] top-[5px]">
                  {{ number }}
                </p>
              </div>
            </div>
          </div>
          <p class="font-Galmuri11 font-bold text-[20px] mt-[10px]">입니다</p>
          <p class="font-Galmuri11 font-bold text-[20px] mt-[30px]">
            {{ isWin ? "승리하셨습니다!" : "게임오버!" }}
          </p>
        </div>
        <!-- 게임 시작 버튼 누른 후 -->
        <div v-else class="w-full h-full">
          <!-- 3초동안 게임 시작 화면 -->
          <div
            v-if="isGameStarting"
            class="h-full text-[30px] text-white01 font-bold flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-[150px]">
            <p class="font-Galmuri11">GAME</p>
            <p class="font-Galmuri11">START</p>
          </div>
          <!-- 게임 화면 -->
          <div v-else class="text-white01">
            <div
              class="w-[60%] mx-auto py-3 rounded-b-[35px] flex items-center justify-center text-center bg-white02 font-Galmuri11 text-gray02">
              예상한 숫자를 입력해주세요 ( {{ attempts }} / {{ maxAttempts }} )
            </div>
            <div class="mt-[20px] px-[20px]">
              <!-- 볼 이미지 영역 -->
              <div class="flex justify-between items-center">
                <div
                  class="flex items-center gap-[10px] font-bold text-[20px] text-black01">
                  <div class="relative">
                    <img :src="Ball" class="w-[40px] h-[40px] top-0 left-0" />
                    <p class="font-Galmuri11 absolute left-[15px] top-[5px]">
                      ?
                    </p>
                  </div>
                  <div class="relative">
                    <img :src="Ball" class="w-[40px] h-[40px] top-0 left-0" />
                    <p class="font-Galmuri11 absolute left-[15px] top-[5px]">
                      ?
                    </p>
                  </div>
                  <div class="relative">
                    <img :src="Ball" class="w-[40px] h-[40px] top-0 left-0" />
                    <p class="font-Galmuri11 absolute left-[15px] top-[5px]">
                      ?
                    </p>
                  </div>
                  <div class="relative">
                    <img :src="Ball" class="w-[40px] h-[40px] top-0 left-0" />
                    <p class="font-Galmuri11 absolute left-[15px] top-[5px]">
                      ?
                    </p>
                  </div>
                </div>
                <div
                  class="px-[20px] py-1 bg-white02 font-Galmuri11 font-bold text-black01">
                  ME
                </div>
              </div>
              <!-- 게임 영역 -->
              <div
                ref="chatContainer"
                class="mt-[20px] flex flex-col gap-2 h-[250px] overflow-y-auto px-2">
                <div class="flex flex-col">
                  <template
                    v-for="(message, index) in gameMessages"
                    :key="index">
                    <div
                      :class="
                        message.type === 'result'
                          ? 'flex justify-start'
                          : 'flex justify-end'
                      ">
                      <div
                        class="px-2 py-2 max-w-[80%] border-t-2 border-b-2 font-Galmuri11">
                        {{ message.text }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="!isGameStarted"
        @click="startGame"
        class="absolute bottom-[140px] left-1/2 translate-x-[-45%] cursor-pointer">
        <img
          :src="isGameOver ? RetryBtn : PlayBtn"
          :alt="isGameOver ? 'retry button' : 'play button'" />
      </button>
      <!-- 입력 영역 -->
      <div
        v-if="isGameStarted"
        class="absolute bottom-[140px] left-1/2 translate-x-[-45%] cursor-pointer flex gap-[10px] bg-black01">
        <input
          v-for="(input, index) in inputs"
          :key="index"
          type="text"
          maxlength="1"
          v-model="inputs[index]"
          @input="handleInput(index, $event)"
          @keydown="handleKeyDown(index, $event)"
          class="w-[35px] h-[45px] pl-[12px] font-Galmuri11 font-bold focus:outline-none rounded-[3px] drop-shadow-[0_0_3px_rgba(6,251,156,0.7)]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
.overflow-y-auto {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}
</style>
