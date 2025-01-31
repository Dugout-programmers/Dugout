import { defineStore } from "pinia";
import { ref } from "vue";

export const useCheerSongStore = defineStore(
  "cheerSong",
  () => {
    const player = ref(null);
    const isPlaying = ref(false);
    const isAutoPlaying = ref(true);
    const currentIndex = ref(0);
    const teamChants = ref([
      { team: "LG 트윈스 응원가", videoId: "Qtu23VpTeOA" },
      { team: "두산 베어스 응원가", videoId: "lMhDirLYvVo" },
      { team: "키움 히어로즈 응원가", videoId: "OjoYnwcZMOI" },
      { team: "SSG 랜더스 응원가", videoId: "VBCa5NIHDWU" },
      { team: "NC 다이노스 응원가", videoId: "tHdoFtp6Ouc" },
      { team: "기아 타이거즈 응원가", videoId: "ZEPS5Bm3iqc" },
      { team: "한화 이글스 응원가", videoId: "wWXbTj5L2yc" },
      { team: "롯데 자이언츠 응원가", videoId: "HfqKC-G3dDA" },
      { team: "삼성 라이온즈 응원가", videoId: "sG3JxXb5EV0" },
      { team: "KT 위즈 응원가", videoId: "WDZzXQlfTK8" },
    ]);

    const setPlayer = (playerInstance) => {
      if (!playerInstance || typeof playerInstance.getIframe !== "function") {
        console.error(
          " 유효하지 않은 YouTube 플레이어 인스턴스!",
          playerInstance
        );
        return;
      }

      console.log(" YouTube 플레이어가 설정됨:", playerInstance);
      player.value = playerInstance;
    };

    const setPlayingState = (state) => {
      isPlaying.value = state;
    };

    const setCurrentIndex = (index) => {
      currentIndex.value = index;
    };

    const togglePlay = () => {
      if (!player.value) {
        console.error(" YouTube 플레이어가 아직 생성되지 않음!");
        return;
      }
      if (isPlaying.value) {
        player.value.pauseVideo();
      } else {
        player.value.playVideo();
      }
      isPlaying.value = !isPlaying.value;
    };

    const toggleAutoPlay = () => {
      isAutoPlaying.value = !isAutoPlaying.value;
    };

    const playForward = () => {
      if (currentIndex.value < teamChants.value.length - 1) {
        currentIndex.value++;
      } else {
        currentIndex.value = 0;
      }
      loadNewVideo();
    };

    const playBack = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      } else {
        currentIndex.value = teamChants.value.length - 1;
      }
      loadNewVideo();
    };

    const loadNewVideo = (wasPlaying = isPlaying.value) => {
      if (!player.value || typeof player.value.stopVideo !== "function") {
        console.error(
          " YouTube 플레이어가 아직 초기화되지 않음!",
          player.value
        );
        return;
      }

      console.log(" 새로운 영상 로드, player 상태:", player.value);

      player.value.stopVideo();
      player.value.loadVideoById(teamChants.value[currentIndex.value]?.videoId);
      if (wasPlaying) {
        setTimeout(() => {
          player.value.playVideo();
        }, 100);
      } else {
        setTimeout(() => {
          player.value.pauseVideo();
        }, 100);
      }
      isPlaying.value = wasPlaying;
    };

    return {
      player,
      isPlaying,
      isAutoPlaying,
      currentIndex,
      teamChants,
      setCurrentIndex,
      setPlayer,
      setPlayingState,
      togglePlay,
      toggleAutoPlay,
      playForward,
      playBack,
      loadNewVideo,
    };
  },
  {
    persist: true,
  }
);
