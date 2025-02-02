<script setup>
import myTeamToggle from "@/assets/icons/my_team_toggle.svg";
import { teamByClubID, teamColors } from "@/constants/index.js";
import { ref } from "vue";

const props = defineProps({
  isEditingProfile: Boolean,
  tempTeam: String,
  profileTeam: String,
});

const emit = defineEmits(["update:team"]);

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  if (props.isEditingProfile) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

const selectTeam = (team) => {
  emit("update:team", team); // 부모에게 선택한 팀 전달
  isDropdownOpen.value = false;
};

const displayedTeamText = () => {
  if (props.isEditingProfile) {
    if (props.tempTeam) return props.tempTeam;
    if (props.profileTeam) return props.profileTeam;
    else return "팀을 선택해주세요";
  } else {
    if (props.profileTeam) return props.profileTeam;
    else return "팀을 선택해주세요";
  }
};
</script>

<template>
  <div class="relative inline-block w-auto">
    <button
      @click="toggleDropdown"
      :class="[
        'relative inline-flex items-center text-4 transition-all cursor-pointer',
        props.isEditingProfile
          ? 'w-[173px] h-[39px] px-[15px] py-[10px] bg-white02 rounded-[10px]'
          : 'px-[15px] py-[10px] bg-white02 rounded-[10px]',
      ]"
      :style="
        !props.isEditingProfile && props.profileTeam
          ? { backgroundColor: teamColors[props.profileTeam], color: 'white' }
          : {}
      "
    >
      {{ displayedTeamText() }}
      <img
        v-if="props.isEditingProfile"
        :src="myTeamToggle"
        class="absolute right-[10px] w-[18px] h-[10.28px]"
      />
    </button>
    <div
      v-if="isDropdownOpen"
      class="absolute left-0 top-full w-[173px] bg-white01 border rounded-[10px] overflow-hidden transition-all z-10"
    >
      <ul>
        <li
          v-for="(team, index) in teamByClubID"
          :key="index"
          @click="selectTeam(team)"
          class="px-4 py-2 text-gray02 text-4 cursor-pointer hover:bg-gray-200"
        >
          {{ team }} 팬
        </li>
      </ul>
    </div>
  </div>
</template>
