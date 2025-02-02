<script setup>
import { computed } from "vue";
import deleteBtn from "@/assets/icons/delete-btn.svg";
import { teamList } from "@/constants";
import { twMerge } from "tailwind-merge";
import { useTeamStore } from "@/stores/teamStore";

const props = defineProps({
  teams: Array,
  selectedTeam: { type: Array, default: () => [] },
});
const teamStore = useTeamStore();

const emit = defineEmits(["update:selectedTeam"]);

const isSelected = (team) =>
  computed(() => (props.selectedTeam ?? []).some((t) => t.tag === team.tag));

const toggleTeam = (team) => {
  console.log(isSelected(team));
  const selectedArray = Array.isArray(props.selectedTeam)
    ? props.selectedTeam
    : props.selectedTeam.value ?? [];

  if (selectedArray.some((t) => t.tag === team.tag)) {
    const updatedList = selectedArray.filter((t) => t.tag !== team.tag);
    emit("update:selectedTeam", updatedList);
  } else {
    emit("update:selectedTeam", [...selectedArray, team]);
  }
};

// 팀이름에 따라 팀 닉네임 찾는 함수 -> css 사용
const teamNickname = computed(() => {
  const team = teamList.find(
    (team) => team.koreanName === teamStore.selectedTeam
  );
  return team ? team.nickname : null; // 팀이 없으면 null 반환
});
</script>
<template>
  <div class="w-full mx-[29px] pb-[30px] fixed bg-white01">
    <div
      class="mt-[150px] mx-[30px] min-h-[39px] overflow-x-auto scrollbar-hide"
    >
      <div class="flex items-center gap-x-[10px] w-max flex-nowrap">
        <button
          v-for="team in props.teams"
          :key="team.tag"
          @click="toggleTeam(team)"
          class="inline-flex items-center h-[39px] px-[15px] rounded-[10px] whitespace-nowrap"
          :class="
            twMerge(
              isSelected(team).value
                ? `bg-${
                    teamNickname ? `${teamNickname}_opa30` : 'gray02'
                  } text-white01 gap-[10px]`
                : `bg-${
                    teamNickname ? `${teamNickname}_opa10` : 'white02'
                  } text-black01`
            )
          "
        >
          <p>{{ team.tag }}</p>
          <img
            v-if="isSelected(team).value"
            :src="deleteBtn"
            class="cursor-pointer"
          />
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
