<script setup>
import { createRestaurantPostImage } from "@/api/supabase-api/restaurantImage";
import {
  createRestaurantLocation,
  createRestaurantPost,
} from "@/api/supabase-api/restaurantPost";
import { getCurrentUser } from "@/api/supabase-api/userInfo";
import Baseball from "@/assets/icons/baseball.svg";
import CreateHeader from "@/components/CreateHeader.vue";
import MapSelectAndView from "@/components/foodboard/foodBoardCreate/MapSelectAndView.vue";
import PhotoUpload from "@/components/foodboard/foodBoardCreate/PhotoUpload.vue";
import TagsSelect from "@/components/foodboard/foodBoardCreate/TagsSelect.vue";
import { teamID } from "@/constants/index";
import { useMapStore } from "@/stores/mapStore";
import { useImageStore } from "@/stores/useImageStore";
import { QuillEditor } from "@vueup/vue-quill";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const imageStore = useImageStore();
const mapStore = useMapStore();
const router = useRouter();
const route = useRoute();
const teamName = ref(route.params.team);
const clubId = ref(teamID[teamName.value]);

const title = ref("");
const content = ref("");
const selectedTags = ref([]);
const isMapNull = ref(false)
const finalSelectedLocation = computed(() => mapStore.finalSelectedLocation);

const tagErrorClass = ref("");
const errorMessage = ref(['장소를 지도에서 선택해주세요', '태그를 1개 이상 선택해주세요']);
const mapNullErrorClass = ref("")

const handleTagUpdate = (tags) => {
  selectedTags.value = tags;
  if (selectedTags.value.length > 0) {
    tagErrorClass.value = "";
  }
};

const submitRestaurantPost = async () => {
  const filteredImg = imageStore.filterNullImage();
  const userData = await getCurrentUser();

  if (!title.value.trim()) {
    const titleElement = document.querySelector('input[type="text"]');
    titleElement.focus();
    return;
  }

  if (!content.value.trim()) {
    const contentElement = document.querySelector(".ql-editor");
    contentElement.focus();
    contentElement.scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (selectedTags.value.length === 0) {
    tagErrorClass.value = "error";
    const tagSelectElement = document.getElementById("tags-select");
    tagSelectElement.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      tagErrorClass.value = "";
    }, 3000);

    return;
  }

  if (!mapStore.finalSelectedLocation) {
    isMapNull.value = true;
    mapNullErrorClass.value = "error";
    setTimeout(() => {
      mapNullErrorClass.value = "";
    }, 3000);
    return;
  }
  try {
    const data = await createRestaurantPost(
      userData.id,
      content.value,
      title.value,
      filteredImg[0],
      selectedTags.value,
      clubId.value
    );
    console.log("포스팅된 전체 데이터를 확인합니다", data);

    const locationData = await createRestaurantLocation(
      data[0].id,
      finalSelectedLocation.value.place_name,
      finalSelectedLocation.value.address_name,
      finalSelectedLocation.value.category_name,
      finalSelectedLocation.value.y,
      finalSelectedLocation.value.x,
      finalSelectedLocation.value.phone,
      finalSelectedLocation.value.place_url
    );

    const imagesData = [];
    for (const [i, image] of filteredImg.entries()) {
      try {
        console.log(`이미지 업로드 요청 데이터 (index: ${i})`, {
          postId: data[0].id,
          imageUrl: image,
          index: i,
        });

        const imageData = await createRestaurantPostImage(data[0].id, image, i);
        console.log("이미지 업로드 성공", imageData);
        imagesData.push(imageData);
        imageStore.resetImageData();
      } catch (err) {
        console.error(`이미지 업로드 실패 (index: ${i})`, err);
      }
    }

    console.log("맛집 게시물 등록 성공", data, locationData, imagesData);
    router.push(`/${teamName.value}/foodboard`);

    mapStore.resetLocationData();
    imageStore.resetImageData();
  } catch (error) {
    console.log("맛집 게시물 등록 실패", error);
  }
};

const cancelRestaurantPost = () => {
  router.go(-1);
  mapStore.resetLocationData();
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
  <section class="flex flex-col items-center">
    <div class="w-[1090px] flex flex-col">
      <CreateHeader
        :handleRegister="submitRestaurantPost"
        :handleCancel="cancelRestaurantPost"
      />
      <div>
        <input
          v-model="title"
          type="text"
          placeholder="제목"
          class="border-b w-full outline-none text-center py-[15px] text-3xl bg-white01"
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
        <MapSelectAndView />
        <div class="w-full border border-white02">
          <QuillEditor
            v-model:content="content"
            contentType="html"
            :placeholder="'맛집을 마구 공유해주세요!\n맛집 사진은 최대 3개까지 업로드할 수 있습니다.'"
            theme="snow"
            :toolbar="toolbarOptions"
          />
        </div>
        <PhotoUpload />
        <div id="tags-select" class="flex flex-col gap-[20px]">
          <div class="flex gap-[10px] items-center">
            <img :src="Baseball" class="w-[18px] h-[18px]" />
            <p :class="tagErrorClass" class="text-[14px] text-gray03">
              {{ errorMessage[1] }}
            </p>
          </div>
          <TagsSelect @update:selectedTag="handleTagUpdate" />
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
