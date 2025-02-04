<script setup>
import { createRestaurantPostImage } from "@/api/supabase-api/restaurantImage";
import {
  createRestaurantLocation,
  createRestaurantPost,
} from "@/api/supabase-api/restaurantPost";
import { getCurrentUser } from "@/api/supabase-api/userInfo";
import Baseball from "@/assets/icons/baseball.svg";
import Loading from "@/components/common/Loading.vue";
import CreateHeader from "@/components/common/CreateHeader.vue";
import MapSelectAndView from "@/components/foodboard/foodBoardCreate/MapSelectAndView.vue";
import PhotoUpload from "@/components/foodboard/foodBoardCreate/PhotoUpload.vue";
import TagsSelect from "@/components/foodboard/foodBoardCreate/TagsSelect.vue";
import { teamID } from "@/constants/index";
import { QuillEditor } from "@vueup/vue-quill";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const isLoading = ref(false);

const router = useRouter();
const route = useRoute();
const teamName = ref(route.params.team);
const clubId = ref(teamID[teamName.value]);

const title = ref("");
const finalSelectedLocation = ref({});
const content = ref("");
const imageUrls = ref([null, null, null]);
const selectedTags = ref([]);

const currentPostId = ref(null);

const updateImages = (newImages) => {
  imageUrls.value = newImages;
};

const updateTags = (tags) => {
  selectedTags.value = tags;
  if (selectedTags.value.length > 0) {
    tagErrorClass.value = "";
  }
};

const isMapNull = ref(false);
const tagErrorClass = ref("");
const mapNullErrorClass = ref("");
const errorMessage = ref([
  "장소를 지도에서 선택해주세요",
  "태그를 1개 이상 선택해주세요",
]);

const updateFinalLocation = (newLocation) => {
  finalSelectedLocation.value = newLocation;
};

const postFormValidation = () => {
  if (!title.value.trim()) {
    const titleElement = document.querySelector(".title-input");
    titleElement.focus();
    return false; // 유효성 검사 실패
  }

  if (!content.value.trim()) {
    const contentElement = document.querySelector(".ql-editor");
    contentElement.focus();
    contentElement.scrollIntoView({ behavior: "smooth" });
    return false;
  }

  if (selectedTags.value.length === 0) {
    tagErrorClass.value = "error";
    const tagSelectElement = document.getElementById("tags-select");
    tagSelectElement.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      tagErrorClass.value = "";
    }, 3000);
    return false;
  }

  if (!finalSelectedLocation.value) {
    isMapNull.value = true;
    mapNullErrorClass.value = "error";
    setTimeout(() => {
      mapNullErrorClass.value = "";
    }, 3000);
    return false;
  }

  return true; // 유효성 검사 통과
};

const registerImage = async () => {
  const filteredImg = imageUrls.value.filter((url) => url !== null);
  const imagesData = [];

  for (const [i, image] of filteredImg.entries()) {
    try {
      console.log(`이미지 업로드 요청 데이터 (index: ${i})`, {
        postId: currentPostId.value,
        imageUrl: image,
        index: i,
      });

      const imageData = await createRestaurantPostImage(
        currentPostId.value,
        image,
        i
      );
      imagesData.push(imageData);
    } catch (err) {
      console.error(`이미지 업로드 실패 (index: ${i})`, err);
    }
  }
};

const registerLocation = async () => {
  await createRestaurantLocation(
    currentPostId.value,
    finalSelectedLocation.value.place_name,
    finalSelectedLocation.value.address_name,
    finalSelectedLocation.value.category_name,
    finalSelectedLocation.value.y,
    finalSelectedLocation.value.x,
    finalSelectedLocation.value.phone,
    finalSelectedLocation.value.place_url
  );
};

const submitRestaurantPost = async () => {
  const filteredImg = imageUrls.value.filter((url) => url !== null);
  const userData = await getCurrentUser();

  if (!postFormValidation()) return false;

  try {
    isLoading.value = true;
    const data = await createRestaurantPost(
      userData.id,
      content.value,
      title.value,
      filteredImg[0] || null,
      selectedTags.value,
      clubId.value
    );

    currentPostId.value = data[0].id;

    await Promise.all([
      filteredImg.length > 0 ? registerImage() : Promise.resolve(),
      registerLocation(),
    ]);

    router.push(`/${teamName.value}/foodboard`);
    finalSelectedLocation.value = null;
    return true;
  } catch (error) {
    console.log("맛집 게시물 등록 실패", error);
    return false;
  } finally {
    isLoading.value = false;
  }
};

const cancelRestaurantPost = () => {
  router.go(-1);
  finalSelectedLocation.value = null;
};

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  ["link"],
  [{ align: [] }],
];
</script>
<template>
  <Loading v-if="isLoading" />
  <section class="flex flex-col">
    <div class="w-[1090px] flex flex-col mx-auto">
      <CreateHeader
        :handleRegister="submitRestaurantPost"
        :handleCancel="cancelRestaurantPost"
      />
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="title-input border-b w-full outline-none text-center py-[15px] text-3xl bg-white01"
        />
      </div>
      <section
        id="post_content--input"
        class="flex flex-col gap-[30px] mb-[142px] w-full"
      >
        <div v-if="isMapNull" class="flex gap-[10px] items-center pt-[20px]">
          <img :src="Baseball" class="w-[18px] h-[18px]" />
          <p :class="mapNullErrorClass" class="text-[14px] text-gray03">
            {{ errorMessage[0] }}
          </p>
        </div>
        <MapSelectAndView
          :finalSelectedLocation="finalSelectedLocation"
          @updateFinalLocation="updateFinalLocation"
        />
        <div class="w-full border border-white02">
          <QuillEditor
            v-model:content="content"
            contentType="html"
            :placeholder="'맛집을 마구 공유해주세요!\n맛집 사진은 최대 3개까지 업로드할 수 있습니다.'"
            theme="snow"
            :toolbar="toolbarOptions"
          />
        </div>
        <PhotoUpload :images="imageUrls" @update:images="updateImages" />
        <div id="tags-select" class="flex flex-col gap-[20px]">
          <div class="flex gap-[10px] items-center">
            <img :src="Baseball" class="w-[18px] h-[18px]" />
            <p :class="tagErrorClass" class="text-[14px] text-gray03">
              {{ errorMessage[1] }}
            </p>
          </div>
          <TagsSelect @update:selectedTag="updateTags" />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
/* 반짝임 효과 */
.error {
  color: red;
  animation: blink 1s linear 0s 3; /* 3번 반복 */
}

@keyframes blink {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 0.8;
  }
}

::v-deep(.ql-editor) {
  width: 100%;
  height: auto;
  text-align: center;
  color: #0a0a0a;
  font-size: 18px;
  white-space: normal;
  position: relative;
  overflow-y: hidden; /* 스크롤바 숨김 */
}
</style>
