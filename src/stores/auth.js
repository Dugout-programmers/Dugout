import { defineStore } from "pinia";
import { ref } from "vue";
import {
  signInWithGoogle,
  signInWithKakao,
  signInWithEmail,
} from "@/api/supabase-api/signIn";
import { getCurrentUser, signOutUser, updateUserInfoEnCapsulation } from "@/api/supabase-api/userInfo";
import { supabase } from "@/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);

  // 사용자 정보 초기화 함수
  const initUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // 사용자 프로필 정보도 함께 가져오기
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        user.value = {
          ...session.user,
          ...profile,
        };
      }
    } catch (error) {
      console.error("사용자 정보 초기화 실패:", error);
    }
  };

  // 구글 로그인
  const loginWithGoogle = async () => {
    try {
      isLoading.value = true;
      const { success, user: userData, error } = await signInWithGoogle();
      if (!success) throw new Error(error);
      user.value = userData;
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
      isLoading.value = true;
      const { success, error } = await signOutUser();
      if (!error) {
        // 세션만 제거하고 사용자 정보는 유지
        await supabase.auth.signOut();
      } else {
        throw new Error(error);
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    } finally {
      isLoading.value = false;
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

      // 업데이트된 정보로 store의 user 정보 갱신
      user.value = {
        ...user.value,
        ...data[0],
      };

      return { success: true, data };
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      return { success: false, error: error.message };
    } finally {
      isLoading.value = false;
    }
  };

  // 인증 상태 변경 감지
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN") {
      await initUser(); // 로그인 시 사용자 정보 초기화
    } else if (event === "SIGNED_OUT") {
      // 세션이 없을 때만 user를 null로 설정
      if (!session) {
        user.value = null;
      }
    } else if (event === "USER_UPDATED") {
      // 사용자 정보가 업데이트되면 다시 초기화
      await initUser();
    }
  });

  return {
    user,
    isLoading,
    loginWithGoogle,
    loginWithKakao,
    loginWithEmail,
    logout,
    fetchCurrentUser,
    updateUserInfo,
    isAuthenticated: () => !!user.value,
  };
});
