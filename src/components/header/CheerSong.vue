<script setup>
import HeadsetIcon from "@/assets/icons/audio_headset.svg";
import OffAutoPlayIcon from "@/assets/icons/audio_autoplay_off.svg";
import OnAutoPlayIcon from "@/assets/icons/audio_autoplay_on.svg";
import AudioPlayIcon from "@/assets/icons/audio_play.svg";
import AudioBackIcon from "@/assets/icons/audio_back.svg";
import AudioForwardIcon from "@/assets/icons/audio_forward.svg";
import AudioPauseIcon from "@/assets/icons/audio_pause.svg";
import { onMounted, onUnmounted, watch } from "vue";
import { useCheerSongStore } from "@/stores/cheerSongStore";

const props = defineProps({
  selectedTeam: String,
  isSearchHovered: Boolean,
});

const cheerSongStore = useCheerSongStore();

//YouTube API를 동적으로 로드하는 함수
const loadYouTubeAPI = () => {
  if (!window.YT) {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  } else {
    createYouTubePlayer();
  }
};

// Youtube 플레이어 생성 함수
const createYouTubePlayer = () => {
  if (!window.YT || !window.YT.Player) return;

  cheerSongStore.setPlayer(
    new YT.Player("youtube-player", {
      videoId: cheerSongStore.teamChants[cheerSongStore.currentIndex]?.videoId, // 초기 응원가
      playerVars: {
        autoplay: 0, // 자동 재생 x
        controls: 0, // 컨트롤 바 숨김
        modestbranding: 1, //유투브 로고 숨김
        mute: 0, // 음소거 x
      },
      events: {
        onReady: (event) => {
          cheerSongStore.setPlayer(event.target);
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            cheerSongStore.isPlaying = true; // 유튜브가 실제로 재생될 때 isPlaying을 true로 설정
          }

          if (event.data === YT.PlayerState.PAUSED) {
            cheerSongStore.isPlaying = false; // 사용자가 명확하게 Pause 했을 때만 false로 변경
          }

          if (event.data === YT.PlayerState.ENDED) {
            if (cheerSongStore.isAutoPlaying) {
              cheerSongStore.playForward(); // 자동 재생 활성화된 경우만 다음 곡 재생
            } else {
              cheerSongStore.isPlaying = false; // 자동재생 OFF 상태일 때 재생 상태를 false로 설정
            }
          }
        },
      },
    })
  );
};

onMounted(() => {
  console.log("🎵 CheerSong 마운트됨!");
  if (window.YT && window.YT.Player) {
    createYouTubePlayer();
  } else {
    loadYouTubeAPI();
    window.onYouTubeIframeAPIReady = createYouTubePlayer;
  }
});

onUnmounted(() => {
  console.log("🛑 CheerSong 언마운트됨!");
});

watch(
  () => props.selectedTeam,
  (newTeam) => {
    if (!newTeam || !cheerSongStore) return;
    const index = cheerSongStore.teamChants.findIndex((value) =>
      value.team.includes(newTeam)
    );

    if (index !== -1) {
      const wasPlaying = cheerSongStore.isPlaying;
      cheerSongStore.setCurrentIndex(Math.max(0, index));
      cheerSongStore.loadNewVideo(wasPlaying);
    }
  },
  { immediate: true }
);
</script>
<template>
  <div
    class="w-[314.5px] h-[35px] bg-white02 rounded-[10px] flex justify-between items-center"
    :class="{ 'w-auto px-[12px]': isSearchHovered }"
  >
    <div v-if="isSearchHovered" class="flex justify-center items-center">
      <img :src="HeadsetIcon" alt="헤드셋" class="w-[20px] h-[20px]" />
    </div>
    <div v-else class="flex gap-[19.52px] ml-[13.77px]">
      <div class="flex gap-[12.63px]">
        <button @click="cheerSongStore.playBack">
          <img
            :src="AudioBackIcon"
            alt="이전 곡 재생 아이콘"
            class="w-[20px] h-[20px]"
          />
        </button>
        <button
          v-if="!cheerSongStore.isPlaying"
          @click="cheerSongStore.togglePlay"
        >
          <img
            :src="AudioPlayIcon"
            alt="플레이 아이콘"
            class="w-[20px] h-[20px]"
          />
        </button>
        <button v-else @click="cheerSongStore.togglePlay">
          <img
            :src="AudioPauseIcon"
            alt="재생 멈춤 아이콘"
            class="w-[20px] h-[20px]"
          />
        </button>
        <button @click="cheerSongStore.playForward">
          <img
            :src="AudioForwardIcon"
            alt="다음곡 재생 아이콘"
            class="w-[20px] h-[20px]"
          />
        </button>
      </div>
      <span class="text-[14px] text-gray03 text-semibold">{{
        cheerSongStore.teamChants[cheerSongStore.currentIndex].team
      }}</span>
    </div>
    <div
      v-if="!isSearchHovered"
      class="mr-[14.26px] flex items-center justify-center h-full"
    >
      <button @click="cheerSongStore.toggleAutoPlay">
        <img
          :src="cheerSongStore.isAutoPlaying ? OffAutoPlayIcon : OnAutoPlayIcon"
          alt="자동재생 아이콘"
          class="w-[20px] h-[20px]"
        />
      </button>
    </div>
    <!--  YouTube iframe (숨김 처리) -->
    <div id="youtube-player" class="hidden"></div>
  </div>
</template>
<style scoped></style>
