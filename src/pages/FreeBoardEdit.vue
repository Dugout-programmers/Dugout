<script setup>
import { onMounted, ref } from "vue";
import CreateHeader from "@/components/CreateHeader.vue";
import { useRouter } from "vue-router";
import { teamID } from "@/constants";
import {
  getFreePostDetailsById,
  updateFreePost,
} from "@/api/supabase-api/freePost";
import { useModalStore } from "@/stores/useModalStore";

const props = defineProps({
  id: String, // post_id
  team: String, // 팀 이름
});

const title = ref("");
const content = ref("");
const thumbnailUrl = ref("");
const thumbnailCount = ref(0);

const router = useRouter();
const modalStore = useModalStore();

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

// 게시물 수정 등록 함수
const handleRegister = async () => {
  findThumbnailImage(); // 썸네일 지정하기
  findThumbnailCount(); // 썸네일 개수 확인하기
  try {
    await updateFreePost(
      props.id,
      content.value,
      title.value,
      thumbnailUrl.value,
      thumbnailCount.value
    );
    router.push(`/${props.team}/freeboard`);
  } catch (error) {
    console.error("게시물을 수정하는 도중 오류가 생겼습니다.");
  }
};

// 게시물 상세 정보를 가져오는 함수
const fetchFreeboardDetail = async () => {
  try {
    const data = await getFreePostDetailsById(props.id);
    title.value = data.title;
    content.value = data.content;
  } catch (error) {
    console.error("데이터를 불러오는 도중에 오류가 발생했습니다.");
  }
};

// 취소 버튼 눌렀을 때 실행되는 함수
const handleCancel = () => {
  console.log("취소");
  alert("등록이 취소되었습니다");
  router.push(`/${props.team}/freeboard/${props.id}`);
};

// 이미지 갯수 확인하기
const findThumbnailCount = () => {
  thumbnailCount.value = (content.value.match(/<img\s[^>]*>/g) || []).length;
};

// 수정 모달 띄우기
const openEditModal = () => {
  modalStore.openModal({
    message: "수정을 완료하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      handleRegister();
      modalStore.closeModal();
    },
  });
};

onMounted(() => {
  fetchFreeboardDetail();
});
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="w-[1090px] flex flex-col">
      <CreateHeader :handleRegister="openEditModal" :handleCancel />
      <!-- 제목부분 -->
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="py-[15px] border-b border-white02 w-full outline-none text-3xl text-center bg-white01"
        />
      </div>
      <!-- 에디터 부분 -->
      <div>
        <QuillEditor
          v-model:content="content"
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
