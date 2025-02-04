<script setup>
import { createFreePost } from "@/api/supabase-api/freePost";
import Loading from "@/components/common/Loading.vue";
import CreateHeader from "@/components/common/CreateHeader.vue";
import { teamID } from "@/constants";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
const props = defineProps({
  team: String, // url 팀이름 불러오기
});

const isLoading = ref(false);

const authStore = useAuthStore(); // 유저 정보가 가져오기

const title = ref("");
const content = ref("");
const thumbnailUrl = ref("");
const thumbnailCount = ref(0);

const titleRef = ref(null);
const contentRef = ref(null);

const clubId = ref(teamID[props.team]); // 팀 id 가져오기

const router = useRouter();

// 첫 번째 이미지 링크 추출
const findThumbnailImage = () => {
  // 문자열을 DOM으로 파싱
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content.value;

  // 첫 번째 <img> 태그 선택
  const firstImg = tempDiv.querySelector("img");

  // src 속성 가져오기
  thumbnailUrl.value = firstImg ? firstImg.src : "";
};

// 이미지 갯수 확인하기
const findThumbnailCount = () => {
  thumbnailCount.value = (content.value.match(/<img\s[^>]*>/g) || []).length;
};

// 등록함수
const handleRegister = async () => {
  findThumbnailImage(); // 썸네일 지정하기
  findThumbnailCount(); // 이미지 갯수 확인하기

  // 만약 제목을 입력하지 않았을 경우
  if (title.value.replaceAll(" ", "") === "") {
    title.value = ""; // 공백을 입력했을 경우 초기화
    alert("제목을 입력해주세요.");
    // 포커스하기
    if (titleRef.value) {
      titleRef.value.focus();
    }

    return false;
  }
  // 만약 내용을 입력하지 않았을 경우
  if (content.value === "") {
    alert("내용을 입력해주세요.");
    // 포커스하기
    if (contentRef.value) {
      contentRef.value.focus();
    }
    return false;
  }
  try {
    isLoading.value = true;
    await createFreePost(
      authStore.user.id, // member ID
      content.value,
      title.value,
      thumbnailUrl.value, //thumbnailUrl
      thumbnailCount.value,
      clubId.value //clubId
    );
    router.push(`/${props.team}/freeboard`);
    return true;
  } catch (error) {
    console.error("게시물을 등록하는 도중 오류가 생겼습니다.");
    return false;
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <Loading v-if="isLoading" />
  <div class="flex flex-col">
    <div class="w-[1090px] flex flex-col mx-auto">
      <CreateHeader :handleRegister />
      <!-- 제목부분 -->
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          ref="titleRef"
          class="py-[15px] border-b border-white02 w-full outline-none text-3xl text-center bg-white01"
        />
      </div>
      <!-- 에디터 부분 -->
      <div>
        <QuillEditor
          v-model:content="content"
          ref="contentRef"
          placeholder="자유롭게 게시글을 작성해보세요."
          contentType="html"
          theme="snow"
          toolbar="full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
