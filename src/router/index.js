import { createRouter, createWebHistory } from "vue-router";

import News from "@/pages/News.vue";
import Highlight from "@/pages/Highlight.vue";
import SignIn from "@/pages/SignIn.vue";
import SignUp from "@/pages/SignUp.vue";
import MyPage from "@/pages/MyPage.vue";
import Main from "@/pages/Main.vue";
import { teamList } from "@/constants";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "RootLayout",
      component: () => import("@/layouts/RootLayout.vue"),
      children: [
        { path: "", name: "main", component: Main },
        { path: "news", name: "news", component: News },
        { path: "highlight", name: "highlight", component: Highlight },
        {
          path: "myPage",
          name: "myPage",
          component: MyPage,
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/game",
      name: "Game",
      component: () => import("@/pages/Game.vue"),
    },
    {
      path: "/game",
      name: "GameLayout",
      component: () => import("@/layouts/GameLayout.vue"),
      children: [
        {
          path: "baseballgame",
          name: "baseballgame",
          component: () => import("@/pages/BaseballGame.vue"),
        },
        {
          path: "quizselect",
          name: "quizselect",
          component: () => import("@/pages/QuizSelect.vue"),
        },
        {
          path: "quizselect/triviaquiz",
          name: "triviaquiz",
          component: () => import("@/pages/QuizTrivia.vue"),
        },
        {
          path: "quizselect/playerquiz",
          name: "playerquiz",
          component: () => import("@/pages/QuizPlayer.vue"),
        },
        {
          path: "quizselect/recordquiz",
          name: "recordquiz",
          component: () => import("@/pages/QuizRecord.vue"),
        },
        {
          path: "tournamentselect",
          name: "tournamentselect",
          component: () => import("@/pages/TournamentSelect.vue"),
        },
        {
          path: "tournamentselect/traitor",
          name: "traitor",
          component: () => import("@/pages/TournamentTraitor.vue"),
        },
        {
          path: "tournamentselect/hero",
          name: "hero",
          component: () => import("@/pages/TournamentHero.vue"),
        },
        {
          path: "tournamentselect/handsome",
          name: "handsome",
          component: () => import("@/pages/TournamentHandsome.vue"),
        },
      ],
    },
    {
      path: "/:team",
      name: "BoardLayout",
      component: () => import("@/layouts/BoardLayout.vue"),
      beforeEnter: (to, from, next) => {
        const teamName = to.params.team;
        const isTeamValid = teamList.some((team) => team.name === teamName);

        if (isTeamValid) {
          next(); // 팀이 유효하면 페이지 렌더링
        } else {
          next({ name: "NotFound" }); // 유효하지 않으면 404 페이지로 이동
        }
      },
      children: [
        {
          path: "freeboard",
          name: "freeboard",
          component: () => import("@/pages/FreeBoard.vue"),
          props: true,
        },
        {
          path: "freeboard/:id/edit",
          name: "freeboardEdit",
          component: () => import("@/pages/FreeBoardEdit.vue"),
          meta: { requiresAuth: true },
          props: true,
        },
        {
          path: "freeboard/:id",
          name: "freeboardDetail",
          component: () => import("@/pages/FreeBoardDetail.vue"),
          props: true,
        },

        {
          path: "freeboard/create",
          name: "freeboardCreate",
          component: () => import("@/pages/FreeBoardCreate.vue"),
          meta: { requiresAuth: true },
          props: true,
        },

        {
          path: "crewboard",
          name: "crewboard",
          component: () => import("@/pages/CrewBoard.vue"),
        },
        {
          path: "crewboard/:id",
          name: "crewboardDetail",
          component: () => import("@/pages/CrewBoardDetail.vue"),
        },
        {
          path: "crewboard/create",
          name: "crewboardCreate",
          component: () => import("@/pages/CrewBoardCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "crewboard/:id/edit",
          name: "crewboardEdit",
          component: () => import("@/pages/CrewBoardEdit.vue"),
          meta: { requiresAuth: true },
        },

        {
          path: "photoboard",
          name: "photoboard",
          component: () => import("@/pages/PhotoBoard.vue"),
        },
        {
          path: "photoboard/:id",
          name: "photoboardDetail",
          component: () => import("@/pages/PhotoBoardDetail.vue"),
        },
        {
          path: "photoboard/create",
          name: "photoboardCreate",
          component: () => import("@/pages/PhotoBoardCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "photoboard/:id/edit",
          name: "photoboardEdit",
          component: () => import("@/pages/PhotoBoardEdit.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "foodboard",
          name: "foodboard",
          component: () => import("@/pages/FoodBoard.vue"),
        },
        {
          path: "foodboard/:id",
          name: "foodboardDetail",
          component: () => import("@/pages/FoodBoardDetail.vue"),
        },
        {
          path: "foodboard/create",
          name: "foodboardCreate",
          component: () => import("@/pages/FoodBoardCreate.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "foodboard/:id/edit",
          name: "foodboardEdit",
          component: () => import("@/pages/FoodBoardEdit.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    { path: "/signin", name: "SignIn", component: SignIn },
    { path: "/signup", name: "SignUp", component: SignUp },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/pages/NotFound.vue"),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore();
  // console.log("유저정보", authStore.user);
  // console.log("어디로 가는지", to.path);
  // 비로그인일때 private페이지 접근할때
  if (to.meta.requiresAuth && !authStore.user) {
    next("/signin");
  }
  // 로그인상태일때 회원가입페이지, 로그인페이지 막기
  else if (to.path === "/signin" && to.path === "/login" && authStore.user) {
    next("/");
  }
  next(); // 이게 있어야 렌더링된다.
});

export default router;
