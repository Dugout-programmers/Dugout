<script setup>
import Setting from "@/assets/icons/setting.svg";
import Signout from "@/assets/icons/signout.svg";
import Modal from "@/components/common/Modal.vue";
import { teamByClubID } from "@/constants/index";
import { useAuthStore } from "@/stores/auth";
import { useModalStore } from "@/stores/useModalStore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ProfileImage from "./ProfileImage.vue";
import ProfileTeam from "./ProfileTeam.vue";

const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();

const currentUserData = computed(() => authStore.user || {});
const isLoggedIn = computed(() => authStore.isAuthenticated());

const isEditingProfile = ref(false);
const profileImage = ref(currentUserData.value.image || "");
const profileName = ref(currentUserData.value.name || "");
const profileDescription = ref(currentUserData.value.description || "");
const profileTeamId = ref(currentUserData.value.baseball_club_id || null);
const profileTeam = ref(teamByClubID[profileTeamId.value] || "");

const tempImage = ref(null);
const tempName = ref(null);
const tempDescription = ref(null);
const tempTeam = ref(null);

const changeProfile = () => {
  isEditingProfile.value = true;
  tempName.value = profileName.value;
  tempDescription.value = profileDescription.value;
  tempTeam.value = profileTeam.value;
};

const saveProfileChanges = async () => {
  const teamId = Object.keys(teamByClubID).find(
    (key) => teamByClubID[key] === tempTeam.value
  );
  profileName.value = tempName.value || profileName.value;
  profileDescription.value = tempDescription.value || profileDescription.value;
  profileTeam.value = tempTeam.value || profileTeam.value;
  profileImage.value = tempImage.value || profileImage.value;

  isEditingProfile.value = false;

  await authStore.updateUserInfo({
    ...currentUserData.value,
    name: tempName.value,
    description: tempDescription.value,
    baseball_club_id: teamId,
    image: tempImage.value || profileImage.value,
  });
};

const cancelEditing = () => {
  isEditingProfile.value = false;
};

const updateProfileImage = (newImage) => {
  tempImage.value = newImage;
};

const updateProfileTeam = (newTeam) => {
  tempTeam.value = newTeam;
};

const onClickLogout = () => {
  modalStore.openModal({
    message: "로그아웃 시 일부 서비스가 제한됩니다\n로그아웃 하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      authStore.logout();
      modalStore.closeModal();
      router.push("/");
    },
    onCancel: modalStore.closeModal,
  });
};
</script>

<template>
  <Modal />
  <div class="flex items-center gap-[20px] mt-[52px]">
    <ProfileImage
      :isEditingProfile="isEditingProfile"
      :tempImage="tempImage"
      :profileImage="profileImage"
      :profileTeam="profileTeam"
      @update:image="updateProfileImage"
    />
    <div class="flex flex-col gap-[50px]">
      <ProfileTeam
        :isEditingProfile="isEditingProfile"
        :tempTeam="tempTeam"
        :profileTeam="profileTeam"
        @update:team="updateProfileTeam"
      />
      <div>
        <div class="flex-col items-center gap-[10px]">
          <div>
            <h2
              v-if="!isEditingProfile"
              class="text-[24px] text-black01 font-bold"
            >
              {{ isLoggedIn ? profileName : "비회원" }}
              <button @click="changeProfile">
                <img :src="Setting" class="w-[16.97px] h-[18px]" />
              </button>
            </h2>
            <input
              v-else
              v-model="tempName"
              placeholder="새 닉네임을 입력해주세요"
              class="text-[24px] text-gray02 font-bold focus:outline-none"
            />
          </div>
          <div>
            <p v-if="!isEditingProfile" class="text-[18px] text-gray03">
              {{ profileDescription }}
            </p>
            <input
              v-else
              v-model="tempDescription"
              class="text-[18px] text-gray03 p-1 rounded h-[40px] w-full focus:outline-none"
              placeholder="새 프로필 소개를 입력하세요"
              rows="4"
            />
          </div>
        </div>
        <div class="mt-[10px]">
          <button
            v-if="!isEditingProfile"
            @click="onClickLogout"
            class="flex items-center gap-[2.5px]"
          >
            <img :src="Signout" class="w-[18.28px] h-[16px]" />
            <p class="text-[18px] text-[#F50000]">로그아웃</p>
          </button>
          <div v-else class="text-[18px] flex gap-[5px]">
            <button
              @click="saveProfileChanges"
              class="rounded-[10px] bg-gray01 px-[7px] text-white01"
            >
              저장
            </button>
            <button
              @click="cancelEditing"
              class="rounded-[10px] bg-white02 px-[7px] text-gray02"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
