<script setup>
import {
  deleteCrewRecruitmentPost,
  getCrewRecruitmentPostDetails,
} from "@/api/supabase-api/crewRecruitmentPost";
import backIcon from "@/assets/icons/back.svg";
import CommentSection from "@/components/common/CommentSection.vue";
import Loading from "@/components/common/Loading.vue";
import PostHeader from "@/components/common/PostHeader.vue";
import { useModalStore } from "@/stores/useModalStore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// day.js
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 가져오기
import relativeTime from "dayjs/plugin/relativeTime";

// day.js
dayjs.extend(relativeTime); // relativeTime 플러그인 활성화
dayjs.locale("ko"); // 한국어 로케일 설정

const isLoading = ref(true);

const modalStore = useModalStore();
const route = useRoute();
const router = useRouter();
const post = ref(null);
const currentTeam = router.currentRoute.value.params.team;

const fetchPostDetails = async () => {
  const postId = route.params.id;
  const data = await getCrewRecruitmentPostDetails(postId);
  if (data) {
    post.value = data;
  } else {
    alert("게시물 정보를 가져오는 데 실패했습니다.");
  }
  isLoading.value = false;
};

const handleBack = () => {
  router.push(`/${currentTeam}/crewboard/`);
};

const confirmDelete = () => {
  modalStore.openModal({
    message: "삭제 후에는 복구할 수 없습니다 \n삭제하시겠습니까?",
    type: "twoBtn",
    onConfirm: async () => {
      isLoading.value = true;
      await deleteCrewRecruitmentPost(post.value.post_id);
      modalStore.closeModal();
      router.push(`/${currentTeam}/crewboard/`);
      isLoading.value = false;
    },
    onCancel: modalStore.closeModal(),
  });
};

onMounted(() => {
  fetchPostDetails();
});
</script>

<template>
  <!-- 로딩창 -->
  <Loading v-if="isLoading" />
  <div v-if="post" class="px-[50px] py-[30px]">
    <!-- 뒤로가기 -->
    <div class="mb-[50px] flex w-full">
      <button @click="handleBack">
        <img :src="backIcon" alt="뒤로가기 아이콘" />
      </button>
    </div>
    <!-- 상세페이지 -->
    <div class="flex flex-col gap-[50px] w-[990px] mx-auto">
      <!-- 상세 페이지 정보 -->
      <PostHeader
        crewBoard
        :title="post.title"
        :time="dayjs(post.created_at).fromNow()"
        :status="post.status"
        :post="post"
        :confirmDelete="confirmDelete"
      />
      <!-- 게시물 내용 -->
      <div class="pb-[50px] border-b border-gray01 flex flex-col gap-[50px]">
        <span>
          {{ post.content }}
        </span>
        <div class="flex flex-col text-lg text-black01 gap-[30px]">
          <div>
            <span class="inline-block w-[100px]">경기일</span>
            <span class="font-bold">| {{ post.game_date }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">응원팀</span>
            <span class="font-bold">|{{ post.club_name }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">경기 장소</span>
            <span class="font-bold">| {{ post.game_stadium }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">작성자 성별</span>
            <span class="font-bold">| {{ post.author_sex }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">작성자 연령</span>
            <span class="font-bold">| {{ post.author_age }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">크루 성별</span>
            <span class="font-bold">| {{ post.crew_sex }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">크루 연령</span>
            <span class="font-bold">| {{ post.crew_age }}</span>
          </div>
          <div>
            <span class="inline-block w-[100px]">인원</span>
            <span class="font-bold">| {{ post.members }}</span>
          </div>
        </div>
      </div>

      <!-- 코멘트 부분 -->
      <CommentSection />
    </div>
  </div>
</template>

<style scoped></style>
