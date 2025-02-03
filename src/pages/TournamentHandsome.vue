<script setup>
import { ref, onMounted } from "vue";
import Monitor from "@/assets/images/gamemonitor.svg";
import { useRouter } from "vue-router";
import { getCurrentUser } from "@/api/supabase-api/userInfo";

const userName = ref("");
// 로그인된 유저 데이터 가져오기
const getUser = async () => {
  const data = await getCurrentUser();
  if (data) {
    userName.value = data; // 유저 이름 저장
  } else {
    userName.value = "알 수 없음"; // 기본값 (로그인 정보 없음)
  }
};
// 상태 변수
const isGameStarting = ref(true);
const round = ref(16); // 현재 라운드 (16강 → 8강 → 4강 → 결승)
const participants = ref([]);
const currentMatchup = ref([]);
const winners = ref([]);
const gameCount = ref(1); // 현재 경기 진행 횟수 (1~15)
const winner = ref(null);
const router = useRouter();

const goToTournament = () => {
  router.push("/game/tournamentselect");
};
// API에서 참가자 불러오기
const fetchParticipants = async () => {
  try {
    const response = await fetch("https://dugout-programmers.github.io/Dugout/api/games/handsomeTournament.json");
    const data = await response.json();

    // 참가자 16명을 랜덤으로 가져와 participants 배열에 저장
    participants.value = shuffleArray(data.participants).slice(0, 16);

    // 첫 번째 매치업 설정
    setNextMatchup();
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
  }
};

// 배열 랜덤 셔플 함수 (Fisher-Yates 알고리즘)
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 다음 매치업 설정 (2명씩 가져오기)
const setNextMatchup = () => {
  if (participants.value.length === 1) {
    winner.value = participants.value[0]; // 최종 우승자 설정
    return;
  }

  // 다음 경기 (2명 가져오기)
  currentMatchup.value = participants.value.splice(0, 2);
};

// 선택 버튼 클릭 시 다음 경기로 이동
const selectWinner = (selectedPlayer) => {
  winners.value.push(selectedPlayer);
  gameCount.value++;

  if (winners.value.length === 1 && participants.value.length === 0) {
    // 모든 경기가 끝나고 최종 우승자 선정
    winner.value = winners.value[0];
    return;
  }

  // 다음 경기가 있으면 진행
  if (participants.value.length > 0) {
    setNextMatchup();
  } else {
    // 한 라운드 끝났다면 다음 라운드로 이동
    participants.value = [...winners.value];
    winners.value = [];
    round.value /= 2; // 16강 → 8강 → 4강 → 결승
    setNextMatchup();
  }
};

// 게임 시작 후 3초 후에 토너먼트 시작
onMounted(() => {
  getUser();
  fetchParticipants();
  setTimeout(() => {
    isGameStarting.value = false;
  }, 3000);
});
</script>

<template>
  <div class="relative mx-auto w-max">
    <!-- Monitor Image -->
    <img :src="Monitor" class="h-[670px]" />

    <!-- Content Inside Monitor -->
    <div
      class="absolute top-[109px] left-1/2 translate-x-[-49%] w-full px-[89px] flex flex-col items-center"
    >
      <!-- 게임 시작 화면 -->
      <div
        v-if="isGameStarting"
        class="text-[30px] text-white font-bold flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-[90px]"
      >
        <p class="font-Galmuri11">TOURNAMENT</p>
        <p class="font-Galmuri11">START</p>
      </div>

      <!-- 게임 진행 화면 -->
      <div
        v-else
        class="w-full flex flex-col items-center relative -translate-y-20"
      >
        <!-- 타이틀 -->
        <div
          class="w-[330px] h-[35px] mb-4 bg-[#d9d9d9] rounded-bl-[30px] rounded-br-[30px] border border-[#e4e4e2] flex justify-center items-center"
        >
          <p class="font-['Galmuri11'] text-center text-xl font-bold">
            올해 최고의 미남 월드컵
          </p>
        </div>

        <!-- 최종 우승 화면 -->
        <div v-if="winner" class="flex flex-col items-center">
          <div
            class="w-[260px] h-[61px] text-center text-neutral-50 text-l font-bold font-['Galmuri11']"
          >
            {{ userName.name }} 님이 선택하신 <br />올해 최고의 미남은
          </div>
          <div
            class="w-[200px] text-sm text-neutral-50 font-bold font-['Galmuri11'] text-center border-t border-b border-[#b4b1b1]"
          >
            {{ winner.name }}
          </div>
          <div
            class="w-[200px] h-[250px] mt-4 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden mb-3"
          >
            <img
              :src="winner.photo"
              :alt="winner.name"
              class="object-cover w-full h-full"
            />
          </div>
          <p class="mt-1 text-white text-l font-bold font-['Galmuri11']">
            축하드립니다 (⓿_⓿)
          </p>
          <button
            class="w-[214px] h-8 mt-8 bg-[#0bf89f] rounded-[5px] text-center text-l font-bold font-['Galmuri11'] cursor-pointer"
            @click="goToTournament"
          >
            다른토너먼트 구경하기
          </button>
        </div>

        <!-- 경기 진행 화면 (랜덤 2명 비교) -->
        <div v-else class="w-full">
          <div
            class="flex justify-between items-center w-full text-white text-lg font-bold mb-6"
          >
            <div
              class="w-[200px] text-sm font-['Galmuri11'] text-center border-t border-b border-[#b4b1b1]"
            >
              {{ currentMatchup.length > 0 ? currentMatchup[0].name : "" }}
            </div>
            <div class="w-[50px] text-center font-bold font-['Galmuri11']">
              {{ round === 2 ? "결승" : round + "강" }}
            </div>
            <div
              class="w-[200px] text-sm font-['Galmuri11'] text-center border-t border-b border-[#b4b1b1]"
            >
              {{ currentMatchup.length > 1 ? currentMatchup[1].name : "" }}
            </div>
          </div>

          <div class="flex justify-between items-center w-full">
            <!-- 왼쪽 선수 -->
            <div
              v-if="currentMatchup.length > 0"
              class="flex flex-col items-center"
            >
              <div
                class="w-[200px] h-[250px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden mb-3"
              >
                <img
                  :src="currentMatchup[0].photo"
                  :alt="currentMatchup[0].name"
                  class="object-cover w-full h-full"
                />
              </div>
              <button
                @click="selectWinner(currentMatchup[0])"
                class="w-[90px] h-[30px] hover:bg-gameGreen bg-white rounded-[5px] text-xl font-bold font-['Galmuri11']"
              >
                선택
              </button>
            </div>

            <!-- 오른쪽 선수 -->
            <div
              v-if="currentMatchup.length > 1"
              class="flex flex-col items-center"
            >
              <div
                class="w-[200px] h-[250px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden mb-3"
              >
                <img
                  :src="currentMatchup[1].photo"
                  :alt="currentMatchup[1].name"
                  class="object-cover w-full h-full"
                />
              </div>
              <button
                @click="selectWinner(currentMatchup[1])"
                class="w-[90px] h-[30px] hover:bg-gameGreen bg-white rounded-[5px] text-xl font-bold font-['Galmuri11']"
              >
                선택
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
