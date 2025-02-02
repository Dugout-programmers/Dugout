<script setup>
import { computed } from "vue";

const props = defineProps({ videos: Array, isLoading: Boolean });
const videoList = computed(() => props.videos || []);

const emit = defineEmits(["playVideo"]);

const playVideo = (videoId) => {
  emit("playVideo", videoId);
};
</script>
<template>
  <div class="min-h-screen bg-white01">
    <div
      v-if="videoList.length === 0"
      class="flex items-center justify-center h-screen w-screen"
    ></div>
    <div v-else class="flex-1 px-[29px] mt-[219px] mb-[99.97px] bg-white01">
      <div class="grid grid-cols-3 gap-x-[21px] gap-y-[50px] w-full">
        <div
          v-for="video in videoList"
          :key="video.id"
          class="bg-white01 cursor-pointer"
        >
          <a @click.prevent="playVideo(video.id)">
            <img
              :src="video.thumbnail"
              class="w-full h-[218.52px] object-cover rounded-[8px]"
            />
          </a>
          <div class="flex items-start mt-[10px] gap-[10px]">
            <img
              :src="video.profileImg"
              class="w-[35px] h-[35px] object-cover"
            />
            <div class="gap-y-[5px]">
              <h3 class="font-bold text-4 text-black01 line-clamp-2">
                {{ video.title }}
              </h3>
              <h4 class="font-bold text-3 text-gray03">
                {{ video.channelTitle }}
              </h4>
              <p class="text-3 text-gray03">
                조회수: {{ Number(video.viewCount).toLocaleString() }}회 |
                {{ new Date(video.publishedAt).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
