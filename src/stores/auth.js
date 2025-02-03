import { defineStore } from "pinia";
import { ref } from "vue";
import {
  signInWithGoogle,
  signInWithKakao,
  signInWithEmail,
} from "@/api/supabase-api/signIn";
import {
  getCurrentUser,
  updateUserInfoEnCapsulation,
} from "@/api/supabase-api/userInfo";
import { supabase } from "@/supabase";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const isLoading = ref(false);

    // 세션 리스너 설정
    // const setupAuthListener = () => {
    //   supabase.auth.onAuthStateChange(async (event, session) => {
    //     console.log("Auth state changed:", event, session);

    //     if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    //       if (session?.user) {
    //         const { data: userInfo } = await supabase
    //           .from("user_info")
    //           .select("*")
    //           .eq("id", session.user.id)
    //           .single();

    //         user.value = {
    //           ...session.user,
    //           ...userInfo,
    //         };
    //       }
    //     } else {
    //       user.value = null;
    //     }
    //   });
    // };

    // 사용자 정보 초기화 함수
    // const initUser = async () => {
    //   try {
    //     const {
    //       data: { session },
    //     } = await supabase.auth.getSession();
    //     console.log("Initial session check:", session);

    //     if (session?.user) {
    //       const { data: userInfo } = await supabase
    //         .from("user_info")
    //         .select("*")
    //         .eq("id", session.user.id)
    //         .single();

    //       user.value = {
    //         ...session.user,
    //         ...userInfo,
    //       };
    //     }
    //   } catch (error) {
    //     console.error("사용자 정보 초기화 실패:", error);
    //     user.value = null;
    //   }
    // };

    // 구글 로그인
    const loginWithGoogle = async () => {
      try {
        isLoading.value = true;
        const { success, user: userData, error } = await signInWithGoogle();
        if (!success) throw new Error(error);
        user.value = userData;
        console.log("구글로그인", userData);
      } catch (error) {
        console.error("구글 로그인 실패:", error);
        throw error;
      } finally {
        isLoading.value = false;
      }
    };

    // 카카오 로그인
    const loginWithKakao = async () => {
      try {
        isLoading.value = true;
        const { success, user: userData, error } = await signInWithKakao();
        if (!success) throw new Error(error);
        user.value = userData;
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        throw error;
      } finally {
        isLoading.value = false;
      }
    };

    // 이메일 로그인
    const loginWithEmail = async (email, password) => {
      try {
        isLoading.value = true;
        const {
          success,
          user: userData,
          error,
        } = await signInWithEmail(email, password);
        if (!success) throw new Error(error);
        user.value = userData;
      } catch (error) {
        console.error("이메일 로그인 실패:", error);
        throw error;
      } finally {
        isLoading.value = false;
      }
    };

    // 로그아웃
    const logout = async () => {
      try {
        supabase.auth.signOut();

        isLoading.value = true;
        user.value = null;

        // 로컬 스토리지 삭제
        // localStorage.removeItem("auth");
        // window.localStorage.removeItem(
        //   "sb-" + import.meta.env.VITE_SUPABASE_PROJECT_REF + "-auth-token"
        // );
        // window.location.href = "/";

        return { success: true };
      } catch (error) {
        console.error("로그아웃 실패:", error);
        return { success: false, error: error.message };
      } finally {
        isLoading.value = false;
        console.log("로그아웃 프로세스 완료");
      }
    };

    // 현재 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      try {
        const userData = await getCurrentUser();
        user.value = userData;
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        user.value = null;
      }
    };

    // 사용자 정보 업데이트 함수 추가
    const updateUserInfo = async (updateData) => {
      try {
        isLoading.value = true;
        if (!user.value?.id) {
          throw new Error("사용자 정보가 없습니다");
        }

        const { success, data, error } = await updateUserInfoEnCapsulation(
          user.value.id,
          updateData
        );

        if (!success) throw new Error(error);
        user.value = { ...user.value, ...data[0] };
        return { success: true, data };
      } catch (error) {
        console.error("사용자 정보 업데이트 실패:", error);
        return { success: false, error: error.message };
      } finally {
        isLoading.value = false;
      }
    };

    // 인증 상태 변경 감지
    // supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (event === "SIGNED_IN") {
    //     const { data: profile } = await supabase
    //       .from("profiles")
    //       .select("*")
    //       .eq("id", session.user.id)
    //       .single();

    //     user.value = {
    //       ...session.user,
    //       ...profile,
    //     };
    //   } else if (event === "SIGNED_OUT") {
    //     user.value = null;
    //   }
    // });

    return {
      user,
      isLoading,
      // setupAuthListener,
      // initUser,
      loginWithGoogle,
      loginWithKakao,
      loginWithEmail,
      logout,
      fetchCurrentUser,
      updateUserInfo,
      isAuthenticated: () => !!user.value,
    };
  },
  {
    // 유저정보만 persist로 저장
    persist: {
      pick: ["user"],
    },
  }
);
