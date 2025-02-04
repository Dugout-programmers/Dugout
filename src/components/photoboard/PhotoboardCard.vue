<script setup>
import Like from "@/assets/icons/like.svg";
import Comment from "@/assets/icons/comment.svg";
import { useRoute } from "vue-router";
import { getCertificationPostDetailsById } from "@/api/supabase-api/viewingCertificationPost";
import { onMounted, ref, watch } from "vue";
import BaseballLogo from "@/assets/icons/default_profile_xl.svg";

const route = useRoute();

const props = defineProps({
  post: Object,
});

const postDetail = ref({ ...props.post });

const fetchPhotoboardDetail = async (postId) => {
  if (!postId) {
    console.warn("postId가 존재하지 않음.");
    return;
  }

  try {
    const data = await getCertificationPostDetailsById(postId);

    if (data) {
      postDetail.value = data;
    } else {
      console.warn("데이터가 존재하지 않음");
      postDetail.value = {};
    }
  } catch (error) {
    console.error("데이터를 가져오지 못함", error);
  }
};

onMounted(() => {
  fetchPhotoboardDetail(props.post.id);
});

watch(
  () => [postDetail.value.likes, postDetail.value.comments],
  ([newLikes, newComments], [oldLikes, oldComments]) => {
    if (newLikes !== oldLikes || newComments !== oldComments) {
      fetchPhotoboardDetail(props.post.id);
    }
  },
  { deep: true }
);
</script>
<template>
  <RouterLink
    :to="`/${route.params.team}/photoboard/${props.post.id}`"
    class="flex flex-col justify-between bg-white02 rounded-[10px] pt-[10px] px-[10px] pb-[15px] h-[335px] cursor-pointer"
  >
    <div class="w-full flex-grow overflow-hidden mb-[15px] rounded-[10px]">
      <img :src="props.post.image" class="w-full h-full object-cover" />
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[10px]">
        <img
          :src="props.post.author_image || BaseballLogo"
          class="w-[25px] h-[25px] object-cover rounded-full flex-nowrap"
          :class="{
            'outline outline-1 outline-gray02': !props.post.author_image,
          }"
        />
        <p>{{ props.post.name || "작성자이름 없음" }}</p>
      </div>
      <div class="flex items-center gap-[20px]">
        <div class="flex items-center gap-[10px]">
          <img
            :src="Like"
            class="w-16.39px h-14px align-middle flex-shrink-0"
          />
          <p class="text-gray02 text-3">{{ postDetail.likes }}</p>
        </div>
        <div class="flex items-center gap-[10px]">
          <img
            :src="Comment"
            class="w-16.39px h-14px align-middle flex-shrink-0"
          />
          <p class="text-gray02 text-3">{{ postDetail.comments }}</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
<style scoped></style>
