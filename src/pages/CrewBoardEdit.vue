<script setup>
import DropdownSelect from "@/components/common/DropdownSelect.vue";
import CreateHeader from "@/components/common/CreateHeader.vue";
import { onMounted, ref, watch } from "vue";
import Baseball from "@/assets/icons/baseball.svg";
import Calendar from "@/assets/icons/calendar.svg";
import { useRoute, useRouter } from "vue-router";
import {
  getCrewRecruitmentPostDetails,
  updateCrewRecruitmentPost,
} from "@/api/supabase-api/crewRecruitmentPost";
import { useModalStore } from "@/stores/useModalStore";
import { teamID } from "@/constants";
import Loading from "@/components/common/Loading.vue";

const isLoading = ref(false);

const openDropdown = ref(null);
const router = useRouter();
const currentTeam = router.currentRoute.value.params.team;
const clubId = ref(teamID[currentTeam]); // 팀 id 가져오기
const modalStore = useModalStore();
const post = ref();
const route = useRoute();
const content = ref(post.content);
const recruitStatus = ref("");
const recruitOptions = ["모집 중", "모집 완료"];
const gameDateStatus = ref(null);
const formattedGameDate = ref(null);
const isDatePickerOpen = ref(false);
const peopleNum = ref("");
const peopleNumOptions = ["1", "2", "3", "4"];
const peopleStatus = ref("");
const peopleStatusOptions = ["이상", "이하", "명"];
const myTeam = ref("");
const myTeamOptions = [
  "LG 트윈스",
  "두산 베어스",
  "SSG 랜더스",
  "NC 다이노스",
  "한화 이글스",
  "기아 타이거즈",
  "삼성 라이온즈",
  "KT 위즈",
  "키움 히어로즈",
  "롯데 자이언츠",
];
const stadium = ref("");
const stadiumOptions = [
  "부산 사직 야구장",
  "광주 KIA 챔피언스필드",
  "대구 삼성 라이온즈파크",
  "서울종합운동장 야구장",
  "고척스카이돔",
  "인천 SSG 랜더스 필드",
  "수원 KT위즈파크",
  "대전 한화생명이글스파크",
  "창원 NC파크",
  "포항 야구장",
  "마산 야구장",
];
const myGender = ref("");
const myGenderOptions = ["여자", "남자", "비공개"];
const myAge = ref("");
const myAgeOptions = ["20대", "30대", "50대", "60대"];
const crewGender = ref("");
const crewGenderOptions = ["여자", "남자", "무관", "비공개"];
const crewAge = ref("");
const crewAgeOptions = ["20대", "30대", "50대", "60대"];
const isCrewGenderDisabled = ref(false);

// 필수 입력값 검증 함수
const validateInputs = () => {
  if (!content.value) {
    modalStore.openModal({
      message: "모집글을 작성해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!recruitStatus.value) {
    modalStore.openModal({
      message: "모집 상태를 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!formattedGameDate.value) {
    modalStore.openModal({
      message: "경기일을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!peopleNum.value) {
    modalStore.openModal({
      message: "인원을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!peopleStatus.value) {
    modalStore.openModal({
      message: "인원 상태를 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!myTeam.value) {
    modalStore.openModal({
      message: "응원팀을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!stadium.value) {
    modalStore.openModal({
      message: "경기장소를 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!myAge.value) {
    modalStore.openModal({
      message: "작성자 성별을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!myAge.value) {
    modalStore.openModal({
      message: "작성자 연령을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!crewGender.value) {
    modalStore.openModal({
      message: "크루 성별을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  if (!crewAge.value) {
    modalStore.openModal({
      message: "크루 연령을 선택해주세요.",
      type: "oneBtn",
      onConfirm: modalStore.closeModal(),
    });
    return false;
  }
  return true;
};

// 작성자 성별 변경 감지: "비공개"일 때 크루 성별을 비공개로 설정하고 선택 비활성화
watch(myGender, (newGender) => {
  if (newGender === "비공개") {
    crewGender.value = "비공개";
    isCrewGenderDisabled.value = true;
  } else {
    isCrewGenderDisabled.value = false;
  }
});

// 날짜를 포맷팅하는 함수
const formatDate = (date) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 해당 게시글 데이터 갖고오는 함수
const fetchPostDetails = async () => {
  const postId = route.params.id;
  const data = await getCrewRecruitmentPostDetails(postId);
  if (data) {
    post.value = data;
    content.value = post.value.content;
    recruitStatus.value = post.value.status;
    formattedGameDate.value = post.value.game_date;
    myTeam.value = post.value.club_name;
    stadium.value = post.value.game_stadium;
    myGender.value = post.value.author_sex;
    myAge.value = post.value.author_age;
    crewGender.value = post.value.crew_sex;
    crewAge.value = post.value.crew_age;

    // 🏆 "2명" -> "2" 숫자만 추출
    const membersData = post.value.members;
    const [numberPart, statusPart] = membersData.split(" ");
    peopleNum.value = numberPart.replace(/\D/g, ""); // 숫자만 추출
    peopleStatus.value = statusPart;
  } else {
    alert("게시물 정보를 가져오는 데 실패했습니다.");
  }
};

// 작성글 업데이트 함수
const handleUpdate = async () => {
  const postId = route.params.id;
  if (!validateInputs()) return;

  const updatedData = {
    status: recruitStatus.value,
    game_date: formattedGameDate.value,
    author_sex: myGender.value,
    author_age: myAge.value,
    crew_sex: crewGender.value,
    crew_age: crewAge.value,
    content: content.value,
    club_id: clubId.value,
    member_number: Number(peopleNum.value),
    member_range: peopleStatus.value,
    game_stadium: stadium.value,
  };

  try {
    isLoading.value = true;
    await updateCrewRecruitmentPost(postId, updatedData);
    router.push(`/${currentTeam}/crewboard/${postId}`);

    // modalStore.openModal({
    //   message: "게시글이 성공적으로 수정되었습니다.",
    //   type: "oneBtn",
    //   onConfirm: () => {
    //     modalStore.closeModal();
    //     router.push(`/${currentTeam}/crewboard/${postId}`);
    //   },
    // });
  } catch (err) {
    console.error(err.message);
  } finally {
    isLoading.value = false;
  }
};

// 게시글 작성 취소 함수 -> createHeader에 공통으로 넣었습니다 확인후 지워주세요!
// const handleCancel = () => {
//   router.push(`/${currentTeam}/crewboard/`);
// };

watch(gameDateStatus, (newDate) => {
  formattedGameDate.value = formatDate(newDate);
  isDatePickerOpen.value = false;
});

// 수정 모달 띄우기
const openEditModal = () => {
  modalStore.openModal({
    message: "수정을 완료하시겠습니까?",
    type: "twoBtn",
    onConfirm: () => {
      handleUpdate();
      modalStore.closeModal();
    },
  });
};

onMounted(() => {
  fetchPostDetails();
});

const handleDropdownToggle = (key) => {
  openDropdown.value = openDropdown.value === key ? null : key;
};
</script>
<template>
  <!-- 로딩창 -->
  <Loading v-if="isLoading" />
  <div class="px-[50px]">
    <CreateHeader :handleRegister="openEditModal" />
    <div class="gap-[50px]">
      <div class="mt-[40px] mb-[85px] gap-[30px]">
        <div>
          <div class="w-full pb-[30px] border-b-gray01 border-b-[1px]">
            <p class="w-full text-[30px] text-center outline-none">
              직관 크루 조건을 수정해주세요.
            </p>
          </div>
          <div class="pt-[30px]">
            <textarea
              type="text"
              v-model="content"
              class="w-full p-0 outline-none resize-none text-4 placeholder-gray01 placeholder-4 bg-white01"
              placeholder="직관 크루 모집글을 작성해보세요"
            />
          </div>
        </div>
        <div class="flex flex-col gap-[30px]">
          <div class="flex justify-between items-center h-[40px] gap-2">
            <div class="w-[100px]">
              <span class="text-black01 text-bold text-[18px] whitespace-nowrap"
                >모집 상태</span
              >
            </div>
            <DropdownSelect
              v-model:selectedOption="recruitStatus"
              :options="recruitOptions"
              part="모집 상태"
              :isOpen="openDropdown === 'recruitStatus'"
              @toggle="handleDropdownToggle('recruitStatus')"
            />
          </div>
          <div class="flex justify-between">
            <div
              class="flex justify-between items-center h-[40px] w-[425px] gap-2"
            >
              <div class="w-[100px]">
                <span
                  class="text-black01 text-bold text-[18px] whitespace-nowrap"
                  >경기일</span
                >
              </div>
              <div
                class="flex justify-between items-center h-[40px] w-[425px] gap-2"
              >
                <div class="relative w-full">
                  <button
                    @click="isDatePickerOpen = !isDatePickerOpen"
                    class="flex items-center justify-between w-full h-[40px] px-[15px] bg-white02 text-black01 text-[18px] rounded-[8px] border"
                  >
                    <span>{{ formattedGameDate || "날짜를 선택하세요" }}</span>
                    <img :src="Calendar" class="w-[18px] h-[18px]" />
                  </button>
                  <div
                    v-if="isDatePickerOpen"
                    class="absolute z-10 mt-2 left-[350px] top-[-10px]"
                  >
                    <VDatePicker v-model="gameDateStatus" mode="single" />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex justify-between items-center h-[40px] gap-2 w-[425px]"
            >
              <div class="w-[100px]">
                <span
                  class="text-black01 text-bold text-[18px] whitespace-nowrap"
                  >인원</span
                >
              </div>
              <div class="flex gap-[10px] w-full">
                <DropdownSelect
                  v-model:selectedOption="peopleNum"
                  :options="peopleNumOptions"
                  part="인원"
                  :isOpen="openDropdown === 'peopleNum'"
                  @toggle="handleDropdownToggle('peopleNum')"
                />
                <DropdownSelect
                  v-model:selectedOption="peopleStatus"
                  :options="peopleStatusOptions"
                  part="인원 상태"
                  :isOpen="openDropdown === 'peopleStatus'"
                  @toggle="handleDropdownToggle('peopleStatus')"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[15.5px]">
            <div class="flex gap-[10px] items-center">
              <img :src="Baseball" class="w-[18px] h-[18px]" />
              <p class="text-[14px] text-gray03">
                응원팀과 경기 장소는 홈 | 원정 여부에 따라 다르니 꼼꼼히
                확인해주세요!
              </p>
            </div>
            <div class="flex justify-between">
              <div
                class="flex justify-between items-center h-[40px] w-[425px] gap-2"
              >
                <div class="w-[100px]">
                  <span
                    class="text-black01 text-bold text-[18px] whitespace-nowrap"
                    >응원팀</span
                  >
                </div>
                <DropdownSelect
                  v-model:selectedOption="myTeam"
                  :options="myTeamOptions"
                  part="응원팀"
                  :isOpen="openDropdown === 'myTeam'"
                  @toggle="handleDropdownToggle('myTeam')"
                />
              </div>
              <div
                class="flex justify-between items-center h-[40px] w-[425px] gap-2"
              >
                <div class="w-[100px]">
                  <span
                    class="text-black01 text-bold text-[18px] whitespace-nowrap"
                    >경기 장소</span
                  >
                </div>
                <DropdownSelect
                  v-model:selectedOption="stadium"
                  :options="stadiumOptions"
                  part="경기 장소"
                  :isOpen="openDropdown === 'stadium'"
                  @toggle="handleDropdownToggle('stadium')"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[15.5px]">
            <div class="flex gap-[10px] items-center">
              <img :src="Baseball" class="w-[18px] h-[18px]" />
              <p class="text-[14px] text-gray03">
                응원팀과 경기 장소는 홈 | 원정 여부에 따라 다르니 꼼꼼히
                확인해주세요!
              </p>
            </div>
            <div class="flex justify-between">
              <div
                class="flex justify-between items-center h-[40px] w-[425px] gap-2"
              >
                <div class="w-[100px]">
                  <span
                    class="text-black01 text-bold text-[18px] whitespace-nowrap"
                    >작성자 성별</span
                  >
                </div>
                <DropdownSelect
                  v-model:selectedOption="myGender"
                  :options="myGenderOptions"
                  part="작성자 성별"
                  :isOpen="openDropdown === 'myGender'"
                  @toggle="handleDropdownToggle('myGender')"
                />
              </div>
              <div
                class="flex justify-between items-center h-[40px] w-[425px] gap-2"
              >
                <div class="w-[100px]">
                  <span
                    class="text-black01 text-bold text-[18px] whitespace-nowrap"
                    >작성자 연령</span
                  >
                </div>
                <DropdownSelect
                  v-model:selectedOption="myAge"
                  :options="myAgeOptions"
                  part="작성자 연령"
                  :isOpen="openDropdown === 'myAge'"
                  @toggle="handleDropdownToggle('myAge')"
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <div
              class="flex justify-between items-center h-[40px] w-[425px] gap-2"
            >
              <div class="w-[100px]">
                <span
                  class="text-black01 text-bold text-[18px] whitespace-nowrap"
                  >크루 성별</span
                >
              </div>
              <DropdownSelect
                v-model:selectedOption="crewGender"
                :options="crewGenderOptions"
                :disabled="isCrewGenderDisabled"
                part="크루 성별"
                :isOpen="openDropdown === 'crewGender'"
                @toggle="handleDropdownToggle('crewGender')"
              />
            </div>
            <div
              class="flex justify-between items-center h-[40px] w-[425px] gap-2"
            >
              <div class="w-[100px]">
                <span
                  class="text-black01 text-bold text-[18px] whitespace-nowrap"
                  >크루 연령</span
                >
              </div>
              <DropdownSelect
                v-model:selectedOption="crewAge"
                :options="crewAgeOptions"
                part="크루 연령"
                :isOpen="openDropdown === 'crewAge'"
                @toggle="handleDropdownToggle('crewAge')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
