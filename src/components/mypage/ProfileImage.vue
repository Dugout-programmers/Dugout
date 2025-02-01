<script setup>
import Baseball from "@/assets/icons/baseball.svg";
import Camera from "@/assets/icons/camera.svg";
import { teamColors } from "@/constants/index";
import { supabase } from "@/supabase.js";
import { defineEmits, defineProps, ref } from "vue";
const props = defineProps({
  isEditingProfile: Boolean,
  profileImage: String,
  profileTeam: String,
  tempImage: String,
});

const emit = defineEmits(["update:image"]);
const errorMessage = ref("");

const handleProfileImageUpload = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value =
        "파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.";
      return;
    } else {
      errorMessage.value = "";
    }

    const fileName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFileName = `${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}_${fileName}`;
    const uploadPath = `profile_images/${uniqueFileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(uploadPath, file, {
          cacheControl: "5000",
          upsert: false,
          contentType: file.type,
        });

      if (error) {
        console.error("업로드 오류:", error.message);
        errorMessage.value = "이미지 업로드 중 오류가 발생했습니다.";
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(uploadPath);

        if (publicUrlData) {
          console.log("이미지 URL:", publicUrlData.publicUrl);
          emit("update:image", publicUrlData.publicUrl);
        } else {
          console.error("공개 URL을 가져오는 데 실패했습니다.");
          errorMessage.value = "이미지 URL을 가져오는 데 실패했습니다.";
        }
      }
    } catch (error) {
      console.error("파일 업로드 중 예외 발생:", error);
      errorMessage.value = "파일 업로드 중 예외가 발생했습니다.";
    }
  };

  input.click();
};
</script>

<template>
  <div
    class="w-[240px] h-[240px] rounded-full sticky flex flex-shrink-0"
    :style="
      !isEditingProfile && props.profileTeam
        ? { outline: `5px solid ${teamColors[props.profileTeam]}` }
        : {}
    "
  >
    <figure class="w-[240px] h-[240px] rounded-full object-cover relative">
      <img
        v-if="isEditingProfile && tempImage"
        :src="tempImage"
        class="w-[240px] h-[240px] rounded-full object-cover"
      />
      <img
        v-else-if="profileImage"
        :src="profileImage"
        class="w-[240px] h-[240px] rounded-full object-cover"
      />
      <img v-else-if="!isEditingProfile && !profileImage" :scr="Baseball" />
      <!-- 필터: isEditing일 때만 -->
      <button
        v-if="isEditingProfile"
        @click="handleProfileImageUpload"
        class="absolute inset-0 bg-black opacity-50 rounded-full flex justify-center items-center"
      >
        <img
          :src="Camera"
          alt="프로필 사진 수정 버튼"
          class="w-[40px] h-auto"
        />
      </button>
    </figure>
  </div>
  <div v-if="errorMessage" class="text-red-500 mt-2">
    {{ errorMessage }}
  </div>
</template>
