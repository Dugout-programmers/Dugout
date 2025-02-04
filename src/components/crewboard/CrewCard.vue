<script setup>
import { useRouter } from "vue-router";
// day.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko"; // 한국어 로케일 가져오기
import { computed } from "vue";
import BaseballLogo from "@/assets/icons/default_profile_xl.svg";

// day.js
dayjs.extend(relativeTime); // relativeTime 플러그인 활성화
dayjs.locale("ko"); // 한국어 로케일 설정

// 현재 팀 이름을 라우터에서 가져옴
const router = useRouter();
const currentTeam = router.currentRoute.value.params.team;

// 팀별 마스콧 이미지 맵핑
const mascotImages = {
  doosan: new URL("@/assets/images/mascot_doosan.svg", import.meta.url).href,
  hanhwa: new URL("@/assets/images/mascot_hanhwa.svg", import.meta.url).href,
  kia: new URL("@/assets/images/mascot_kia1.svg", import.meta.url).href,
  kiwoom: new URL("@/assets/images/mascot_kiwoom.svg", import.meta.url).href,
  kt: new URL("@/assets/images/mascot_kt.svg", import.meta.url).href,
  lg: new URL("@/assets/images/mascot_lg.svg", import.meta.url).href,
  lotte: new URL("@/assets/images/mascot_lotte1.svg", import.meta.url).href,
  nc: new URL("@/assets/images/mascot_nc1.svg", import.meta.url).href,
  samsung: new URL("@/assets/images/mascot_samsung.svg", import.meta.url).href,
  ssg: new URL("@/assets/images/mascot_ssg.svg", import.meta.url).href,
};

const mascotImg = computed(() => {
  return mascotImages[currentTeam];
});

// props로 post 데이터를 받아옵니다.
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});
// 카드 클릭 시 상세 페이지로 이동
const goToDetail = () => {
  if (!props.post || !props.post.post_id) {
    console.error("Invalid post data:", props.post);
    return;
  }

  // 라우팅: 팀 이름과 포스트 ID를 포함한 경로로 이동
  router.push(`/${currentTeam}/crewboard/${props.post.post_id}`);
};
</script>

<template>
  <div
    @click="goToDetail"
    class="border border-white02 rounded-[10px] w-[310px] h-[250px] bg-[#F4F4F4] relative p-[10px] flex justify-between items-end"
  >
    <!-- 배경 이미지 -->
    <img
      :src="mascotImg"
      alt="게시물 이미지"
      class="opacity-30 w-[150px] h-[166px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    />

    <!-- 카드 중앙 데이터 -->
    <div
      class="px-[10px] absolute flex flex-col items-center w-full text-xl font-bold transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <span>{{ props.post.title || "제목 없음" }}</span>
    </div>

    <!-- 하단 유저 정보 및 모집 상태 -->
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-[10px]">
        <img
          :alt="`${currentTeam} 로고 이미지`"
          :src="props.post.author_image || BaseballLogo"
          alt="유저 프로필"
          class="w-[25px] h-[25px] rounded-full"
          :class="{
            'outline outline-1 outline-gray02': !props.post?.author_image,
          }"
        />
        <span class="text-xs text-gray03">{{
          props.post.author_name || "정보 없음"
        }}</span>
        <span class="text-xs text-gray02">
          {{ dayjs(props.post.created_at).fromNow() }}
        </span>
      </div>

      <div class="flex items-center gap-[5px]">
        <div
          class="w-[6px] h-[6px] rounded-full"
          :class="{
            'bg-green-500': props.post.status === '모집 중',
            'bg-red-500': props.post.status === '모집 완료',
          }"
        ></div>
        <span class="text-xs">{{ props.post.status || "상태 정보 없음" }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
