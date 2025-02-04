<script setup>
import BaseballLogo from "@/assets/icons/default_profile_xl.svg";
import commentIcon from "@/assets/icons/comment.svg";
import likeIcon from "@/assets/icons/like.svg";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed } from "vue";
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";
dayjs.extend(relativeTime);
dayjs.locale("ko");

const props = defineProps({
  restaurantPostData: {
    type: Object,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
});

const parsedContent = computed(() => {
  // HTML 문자열을 DOM 객체로 변환
  const doc = new DOMParser().parseFromString(
    props.restaurantPostData.content,
    "text/html"
  );
  // 텍스트만 추출
  return doc.body.textContent || doc.body.innerText;
});

const calculatedCreatedAt = computed(() => {
  return dayjs(props.restaurantPostData.created_at).fromNow();
});
</script>
<template>
  <RouterLink
    :to="`/${props.teamName}/foodboard/${props.restaurantPostData.id}`"
    class="w-full h-auto cursor-pointer"
  >
    <div class="flex w-full h-[200px] border rounded-[10px] overflow-hidden">
      <!-- 왼쪽 이미지 -->
      <div class="w-[350px] h-[200px]">
        <img
          v-if="props.restaurantPostData.thumbnail_url"
          :src="props.restaurantPostData.thumbnail_url"
          alt="게시물 이미지"
          class="w-full h-full object-cover min-w-[350px]"
        />
        <KakaoMap
          v-else-if="
            props.restaurantPostData.lat && props.restaurantPostData.lng
          "
          class="w-full h-full object-cover"
          :style="{ width: '100%', height: '100%' }"
          :lat="props.restaurantPostData.lat"
          :lng="props.restaurantPostData.lng"
          :draggable="false"
          :scrollwheel="false"
          @onLoadKakaoMap="onLoadKakaoMap"
        >
          <KakaoMapMarker
            :lat="props.restaurantPostData.lat"
            :lng="props.restaurantPostData.lng"
          />
        </KakaoMap>
      </div>
      <!-- 오른쪽 게시물 정보 -->
      <div class="flex px-[30px] py-[20px] flex-col justify-between">
        <!-- 제목 / 내용 -->
        <div class="flex flex-col gap-[15px]">
          <div class="gap[10px]">
            <div class="flex gap-[5px]">
              <span
                v-for="(tag, i) in props.restaurantPostData.tags || []"
                :key="i"
                class="text-gray02 text-[14px]"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <span class="text-black01 text-[24px] font-bold">{{
            props.restaurantPostData.title
          }}</span>
          <span class="text-gray03 text-[16px] line-clamp-1">{{
            parsedContent
          }}</span>
        </div>
        <!-- 닉네임 / 작성일 -->
        <div class="flex items-center w-[280px] bottom-0 justify-between">
          <div class="flex text-[12px] gap-[10px] items-center">
            <div>
              <img
                :src="props.restaurantPostData.author_image || BaseballLogo"
                class="w-[25px] h-[25px] rounded-full"
                :class="{
                  'outline outline-1 outline-gray02':
                    !props.restaurantPostData.author_image,
                }"
              />
            </div>
            <span class="text-gray03">{{ props.restaurantPostData.name }}</span>
            <span class="text-gray02">{{ calculatedCreatedAt }}</span>
          </div>
          <!-- 좋아요 / 댓글 -->
          <div class="flex gap-[20px]">
            <div class="flex gap-[10px]">
              <img :src="likeIcon" alt="하트 이미지" />
              <span class="text-gray02">{{
                props.restaurantPostData.likes
              }}</span>
            </div>
            <div class="flex gap-[10px]">
              <img :src="commentIcon" alt="말풍선 이미지" />
              <span class="text-gray02">{{
                props.restaurantPostData.comments
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
<style scoped></style>
