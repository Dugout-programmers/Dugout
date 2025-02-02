<script setup>
import {
  checkIfImageExists,
  getNextOrderIndex,
  insertNewRestaurantPostImage,
  updateRestaurantPostImage,
} from "@/api/supabase-api/restaurantImage";
import {
  getRestaurantPostDetailsById,
  updateRestaurantLocation,
  updateRestaurantPost,
} from "@/api/supabase-api/restaurantPost";
import Baseball from "@/assets/icons/baseball.svg";
import CreateHeader from "@/components/CreateHeader.vue";
import MapSelectAndView from "@/components/foodboard/foodBoardCreate/MapSelectAndView.vue";
import PhotoUpload from "@/components/foodboard/foodBoardCreate/PhotoUpload.vue";
import TagsSelect from "@/components/foodboard/foodBoardCreate/TagsSelect.vue";
import { useAuthStore } from "@/stores/auth";

import { useModalStore } from "@/stores/useModalStore";
import { QuillEditor } from "@vueup/vue-quill";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const authStore = useAuthStore();

const router = useRouter();
const modalStore = useModalStore();
const route = useRoute();
const postId = route.params.id;
const teamName = ref(route.params.team);

const tagErrorClass = ref("");
const tagErrorMessage = ref("태그를 1개 이상 선택해주세요");

const postDetails = ref({});
const title = ref("");
const location = ref({});
const content = ref("");
const imageUrls = ref([null, null, null]);
const selectedTags = ref([]);
const finalSelectedLocation = ref({});
const isMapViewVisable = ref(true);
// 기존 포스트 로드
const loadPostDetail = async () => {
  const data = await getRestaurantPostDetailsById(postId);

  if (!data) throw new Error("게시물 데이터를 가져올 수 없습니다.");

  const {
    title: postTitle,
    content: postContent,
    tags,
    location: postLocation,
    member_id,
    images,
  } = data;

  if (member_id !== authStore.user?.id) {
    return router.push({ name: "NotFound" });
  }

  postDetails.value = {
    ...data,
    images: images?.map((img) => img.url) || [],
  };

  title.value = postTitle;
  content.value = postContent;
  selectedTags.value = tags || [];
  location.value = postLocation || {};

  finalSelectedLocation.value = {
    place_name: location.value.name || "",
    address_name: location.value.address || "",
    category_name: location.value.category || "",
    x: location.value.longitude || "",
    y: location.value.latitude || "",
    phone: location.value.contact || "",
    place_url: location.value.url || "",
  };

  const loadedImages = postDetails.value.images;
  imageUrls.value = [
    ...loadedImages,
    ...Array(3 - loadedImages.length).fill(null),
  ].slice(0, 3);
};

onMounted(loadPostDetail);

const updateImages = (newImages) => {
  imageUrls.value = newImages;
};

const updateTags = (tags) => {
  selectedTags.value = tags;
  if (selectedTags.value.length > 0) {
    tagErrorClass.value = "";
  }
};

const registerEditedPost = async () => {
  const filteredUrls = imageUrls.value.filter((url) => url !== null);
  try {
    // 첫 번째 이미지가 없다면 null을 전달
    await updateRestaurantPost(
      postId,
      title.value,
      content.value,
      filteredUrls[0] || null,
      selectedTags.value
    );

    getFinalLocation();
    const { name, address, category, longitude, latitude, contact, url } =
      location.value;

    await updateRestaurantLocation(
      postId,
      name,
      address,
      category,
      latitude,
      longitude,
      contact,
      url
    );
    await uploadImages(); // 이미지 업로드 후 다시 저장
    router.push(`/${teamName.value}/foodboard`);
    finalSelectedLocation.value = null;
  } catch (error) {
    console.error("게시물 수정 실패", error);
  }
};

const updateFinalLocation = (newLocation) => {
  finalSelectedLocation.value = newLocation;
  console.log("최종장소", finalSelectedLocation.value);
};

const getFinalLocation = () => {
  const newLocation = finalSelectedLocation.value;
  location.value = {
    name: newLocation.place_name,
    address: newLocation.address_name,
    category: newLocation.category_name,
    longitude: newLocation.x,
    latitude: newLocation.y,
    contact: newLocation.phone,
    url: newLocation.place_url,
  };
};

const isValidForm = () => {
  if (!title.value.trim()) {
    focusElement(".title-input");
    return false;
  }

  if (!content.value.trim()) {
    focusElement(".ql-editor");
    return false;
  }

  if (selectedTags.value.length === 0) {
    handleTagError();
    return false;
  }

  return true;
};

const focusElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const handleTagError = () => {
  tagErrorClass.value = "error";
  const tagsSelectElement = document.getElementById("tags-select");
  if (tagsSelectElement) {
    tagsSelectElement.scrollIntoView({ behavior: "smooth" });
  }
  setTimeout(() => {
    tagErrorClass.value = "";
  }, 3000);
};

const uploadImages = async () => {
  const filteredUrls = imageUrls.value.filter((url) => url !== null);

  try {
    if (filteredUrls.length === 0) return;

    for (const [i, image] of filteredUrls.entries()) {
      // 먼저 해당 order_index에 이미지가 존재하는지 확인
      const existingImage = await checkIfImageExists(postId, i);

      if (existingImage) {
        // 이미지가 존재하면 덮어쓰기
        const imageData = await updateRestaurantPostImage(postId, i, image);
        console.log("이미지 업로드 성공", imageData);
        imageUrls.value[i] = imageData.url;
      } else {
        const newOrderIndex = await getNextOrderIndex(postId);
        const imageData = await insertNewRestaurantPostImage(
          postId,
          newOrderIndex,
          image
        );
        console.log("새 이미지 업로드 성공", imageData);
        imageUrls.value.push(imageData.url);
      }
    }
  } catch (err) {
    console.error("이미지 업로드 실패", err);
  }
};

const onClickCompleteEdit = () => {
  if (!isValidForm()) return;

  modalStore.openModal({
    message: "수정을 완료하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      registerEditedPost();
      modalStore.closeModal();
      router.go(-1);
    },
    onCancel: modalStore.closeModal,
  });
};

const cancelRestaurantPost = () => {
  router.go(-1);
};
</script>

<template>
  <section class="flex flex-col items-center">
    <div class="w-[1090px] flex flex-col">
      <CreateHeader
        :handleRegister="onClickCompleteEdit"
        :handleCancel="cancelRestaurantPost"
      />
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="border-b w-full outline-none text-center py-[15px] text-3xl bg-white01 title-input"
        />
      </div>
      <section
        id="post_content--input"
        class="flex flex-col gap-[30px] mb-[142px] w-full"
      >
        <MapSelectAndView
          :finalSelectedLocation="finalSelectedLocation"
          :isMapViewVisable="isMapViewVisable"
          @updateFinalLocation="updateFinalLocation"
        />
        <div class="w-full border border-white02">
          <QuillEditor
            v-model:content="content"
            contentType="html"
            :placeholder="'맛집을 마구 공유해주세요!\n맛집 사진은 최대 3개까지 업로드할 수 있습니다.'"
            theme="snow"
          />
        </div>
        <PhotoUpload :images="imageUrls" @update:images="updateImages" />
        <div id="tags-select" class="flex flex-col gap-[20px]">
          <div class="flex gap-[10px] items-center">
            <img :src="Baseball" class="w-[18px] h-[18px]" />
            <p :class="tagErrorClass" class="text-[14px] text-gray03">
              {{ tagErrorMessage }}
            </p>
          </div>
          <TagsSelect
            :initial-tags="selectedTags"
            @update:selectedTag="updateTags"
          />
        </div>
      </section>
    </div>
  </section>
</template>
