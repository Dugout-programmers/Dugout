<script setup>
import searchIcon from "@/assets/icons/search.svg";
import themeToggleIcon from "@/assets/icons/theme_toggle.svg";
import logoImg from "@/assets/images/logo.svg";
import { useTeamStore } from "@/stores/teamStore";
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import EmblemAnimation from "./EmblemAnimation.vue";
import { useAuthStore } from "@/stores/auth";
import defaultImg from "@/assets/images/defaultImg_sm.svg";
import CheerSong from "../header/CheerSong.vue";
import { useSearchStore } from "@/stores/searchStore";
import { teamList } from "@/constants";
import { twMerge } from "tailwind-merge";

const route = useRoute();
const teamStore = useTeamStore();
const authStore = useAuthStore(); // 유저 정보가 가져오기

const isPageInCommunity = ref(route.fullPath.includes("board"));
const searchStore = useSearchStore();
const searchInput = ref("");

const isSearchHovered = ref(false);

const updateSearchKeyword = () => {
  searchStore.setKeyword(searchInput.value);
};
const teams = [
  "기본",
  "히어로즈",
  "타이거즈",
  "베어스",
  "트윈스",
  "자이언츠",
  "이글스",
  "라이온즈",
  "다이노스",
  "위즈",
  "랜더스",
];

const isDropdownOpen = ref(false); // 드롭다운 유무 판단

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// 메뉴 목록
const menuList = [
  { name: "NEWS", path: "/news" },
  { name: "HIGHLIGHT", path: "/highlight" },
  { name: "GAME", path: "/game" },
];
const isActive = (path) => route.path === path; // 메뉴 활성화 목록 확인

// 팀이름에 따라 팀 닉네임 찾는 함수 -> css 사용
const teamNickname = computed(() => {
  const team = teamList.find(
    (team) => team.koreanName === teamStore.selectedTeam
  );
  return team ? team.nickname : null; // 팀이 없으면 null 반환
});
</script>

<template>
  <EmblemAnimation v-if="teamStore.isEmblemEffectOn" />
  <header
    class="w-full h-[100px] flex items-center justify-center fixed z-40 border-b border-white02 bg-white01"
  >
    <div class="flex px-[30px] py-[22px] w-full justify-between items-center">
      <!-- 왼쪽 영역(로고 / 네비게이션) -->
      <div class="flex items-center gap-[50px]">
        <!-- 로고 -->
        <RouterLink to="/" class="cursor-pointer">
          <img :src="logoImg" alt="로고 이미지" />
        </RouterLink>
        <!-- 네비게이션 -->
        <nav
          class="text-2xl font-bold gap-[30px] flex"
          :class="teamNickname ? `text-${teamNickname}_opa30` : 'text-gray01'"
        >
          <RouterLink
            v-for="menu in menuList"
            :key="menu.path"
            :to="menu.path"
            class="cursor-pointer hover:underline"
            :class="
              twMerge(
                isActive(menu.path) && 'underline',
                `hover:text-${teamNickname || 'black01'}`,
                isActive(menu.path) ? `text-${teamNickname || 'black01'}` : ''
              )
            "
          >
            {{ menu.name }}
          </RouterLink>
        </nav>
      </div>
      <!-- 가운데 영역(음악) -->
      <div>
        <CheerSong
          :selectedTeam="teamStore.selectedTeam"
          :isSearchHovered="isSearchHovered"
        />
      </div>
      <!-- 오른쪽 영역(검색 / 유저정보 / 테마) -->
      <div class="flex items-center gap-[30px]">
        <!-- 검색 -->
        <form
          :class="[
            'group h-[40px] px-[10px] flex items-center rounded-[10px] transition-all duration-300',
            isPageInCommunity
              ? 'bg-white02 w-[40px] hover:w-[320px]'
              : 'w-[40px] bg-transparent',
          ]"
          @mouseenter="isSearchHovered = true"
          @mouseleave="isSearchHovered = false"
        >
          <input
            type="text"
            v-model="searchInput"
            @input="updateSearchKeyword"
            placeholder="현재 게시판에서만 검색할 수 있습니다"
            class="w-0 opacity-0 transition-all duration-300 bg-white02 focus:outline-none group-hover:w-[290px] group-hover:opacity-100"
            v-if="isPageInCommunity"
          />
          <img :src="searchIcon" alt="검색 아이콘" class="w-[20px]" />
        </form>
        <!-- 유저정보 -->
        <RouterLink
          to="/myPage"
          class="flex items-center gap-[15px] cursor-pointer"
        >
          <img
            :src="authStore.user?.image || defaultImg"
            alt="유저 프로필"
            class="w-10 h-10 rounded-full"
          />
          <span class="font-bold text-gray03">{{
            authStore.user?.name || "비회원"
          }}</span>
        </RouterLink>
        <!-- 테마 -->
        <div
          class="relative flex items-center border border-gray01 rounded-[10px] px-[10px] py-2 h-[35px] w-[135px] cursor-pointer"
          @click="toggleDropdown"
        >
          <span class="w-full truncate text-gray02"
            >{{ teamStore.selectedTeam }} 테마</span
          >
          <img
            :src="themeToggleIcon"
            alt="테마 토글 아이콘"
            class="w-[18px] h-[10px] absolute right-2"
          />
          <!-- 드롭다운 -->
          <ul
            v-if="isDropdownOpen"
            @click.stop="toggleDropdown"
            class="absolute top-[40px] left-0 w-full bg-white rounded-[10px] border border-gray01 shadow-lg z-50"
          >
            <li
              v-for="(team, index) in teams"
              :key="team"
              class="px-4 py-2 text-sm cursor-pointer text-gray03 hover:bg-gray01 hover:text-white"
              :class="{
                'rounded-t-lg': index === 0, // 첫 번째 아이템
                'rounded-b-lg': index === teams.length - 1, // 마지막 아이템
              }"
              @click.stop="
                teamStore.selectTeam(team);
                toggleDropdown();
              "
            >
              {{ team }} 테마
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

span {
  white-space: nowrap; /* 텍스트가 넘치지 않도록 */
  overflow: hidden; /* 넘치는 부분 숨기기 */
  text-overflow: ellipsis; /* 넘치는 부분 "..."으로 표시 */
}

.right-2 {
  right: 10px;
}
</style>
