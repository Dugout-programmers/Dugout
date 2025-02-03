<script setup>
import Loading from "@/components/common/Loading.vue";
import HighlightList from "@/components/highlight/HighlightList.vue";
import TeamSelector from "@/components/highlight/TeamSelector.vue";
import VideoModal from "@/components/highlight/VideoModal.vue";
import { onMounted, ref, watch } from "vue";

const isLoading = ref(true);

const teams = [
  { tag: "# LG 트윈스", searchTitle: ["LG", "트윈스", "앨지", "twins"] },
  { tag: "# KT 위즈", searchTitle: ["KT", "위즈", "케이티", "wiz"] },
  {
    tag: "# 삼성 라이온즈",
    searchTitle: ["삼성", "라이온즈", "samsung", "lions"],
  },
  { tag: "# KIA 타이거즈", searchTitle: ["KIA", "기아", "타이거즈", "tigers"] },
  {
    tag: "# 키움 히어로즈",
    searchTitle: ["키움", "히어로즈", "kiwoom", "heroes"],
  },
  { tag: "# 한화 이글스", searchTitle: ["한화", "이글스", "hanwha", "eagles"] },
  { tag: "# NC 다이노스", searchTitle: ["NC", "다이노스", "엔씨", "dinos"] },
  {
    tag: "# 롯데 자이언츠",
    searchTitle: ["롯데", "자이언츠", "lotte", "giants"],
  },
  { tag: "# SSG 랜더스", searchTitle: ["SSG", "랜더스", "landers"] },
  { tag: "# 두산 베어스", searchTitle: ["두산", "베어스", "doosan", "bears"] },
];

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = import.meta.env.VITE_TVINGSPORTS_CHANNEL_ID;

const selectedTeam = ref([]);
const videos = ref([]);
const allVideos = ref([]);
const activeVideoId = ref(null);

//채널 프로필 이미지 가져오기
const getChannelProfile = async () => {
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`;
  try {
    const response = await fetch(channelUrl);

    if (!response.ok) {
      console.error(`📌 CHANNEL API 요청 실패: HTTP ${response.status}`);
      return "";
    }

    const data = await response.json();
    return data.items[0]?.snippet?.thumbnails?.default?.url || "";
  } catch (error) {
    console.error("📌 프로필 이미지 가져오기 실패", error);
    return "";
  }
};

//비디오 조회수 가져오기
const getVideoStatistics = async (videoId) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`📌 비디오 조회수 요청 실패: HTTP ${response.status}`);
      return "0";
    }

    const data = await response.json();
    return data.items[0]?.statistics?.viewCount || "0";
  } catch (error) {
    console.error("📌 비디오 조회수 가져오기 실패:", error);
    return "0";
  }
};

//나머지 비디오 정보(비디오id, 제목, 썸네일, 업로드 날짜, 채널 제목) 가져오기
const searchVideos = async (searchQuery) => {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    searchQuery
  )}&channelId=${CHANNEL_ID}&type=video&order=date&maxResults=50&key=${API_KEY}`;
  //개발할 때만 할당량 때문에 maxResults 5로 둠 (최대 50까지 가능)

  try {
    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error(`📌 API 요청 실패: HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();

    const videosData = await Promise.all(
      data.items.map(async (item) => {
        const videoId = item.id.videoId;
        const channelId = item.snippet.channelId;

        const [profileImage, viewCount] = await Promise.all([
          getChannelProfile(channelId), // 채널 프로필 이미지 가져오기
          getVideoStatistics(videoId), // 비디오 조회수 가져오기
        ]);

        return {
          id: videoId,
          title: item.snippet.title,
          thumbnail:
            item.snippet.thumbnails.high.url ||
            item.snippet.thumbnails.medium.url ||
            item.snippet.thumbnails.default.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          profileImg: profileImage,
          viewCount: viewCount,
        };
      })
    );

    return videosData;
  } catch (error) {
    console.error("📌 검색 API 실패:", error);
    return [];
  }
};

const fetchVideosOnmount = async () => {
  const requiredKeywords = ["kbo", "하이라이트"];
  const excludeKeywords = ["프로농구", "kbl", "shorts"];
  const excludeQuery = excludeKeywords.map((word) => `-${word}`).join(" ");

  const searchQuery = `"${requiredKeywords.join('" "')} " ${excludeQuery}`;
  let result = await searchVideos(searchQuery);

  // 원본 데이터 저장 (API에서 가져온 전체 데이터)
  allVideos.value = result;

  // 처음 로드 시 기본 필터 적용
  videos.value = result.filter(
    (video) =>
      requiredKeywords.some((keyword) => video.title.includes(keyword)) &&
      !excludeKeywords.some((exclude) => video.title.includes(exclude))
  );
  isLoading.value = false;
};

// 해시태그버튼 따라 필터링 - kbo, 하이라이트만 필수쿼리로 지정하면 농구, 쇼츠 등이 걸러지지 않음.
const filterVideos = async () => {
  if (selectedTeam.value.length === 0) {
    videos.value = allVideos.value; // 모든 데이터 표시
    return;
  }

  const filterKeywords = selectedTeam.value.flatMap((team) => team.searchTitle);
  videos.value = allVideos.value.filter((video) =>
    filterKeywords.some((keyword) => video.title.includes(keyword))
  );
};

const openModal = (videoId) => {
  activeVideoId.value = videoId;
};

watch(
  selectedTeam,
  () => {
    filterVideos(); // API 호출 없이 기존 데이터에서 필터링
  },
  { deep: true }
);

onMounted(() => {
  fetchVideosOnmount(); // 처음 한 번만 API 호출
});
</script>
<template>
  <Loading v-if="isLoading" />
  <TeamSelector v-model:selectedTeam="selectedTeam" :teams="teams" />
  <HighlightList :videos="videos" @playVideo="openModal" />
  <VideoModal
    v-if="activeVideoId"
    :videoId="activeVideoId"
    @close="activeVideoId = null"
  />
</template>
<style scoped></style>
