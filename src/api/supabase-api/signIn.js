import { supabase } from "@/supabase";

// 구글 로그인
export const signInWithGoogle = async () => {
  try {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://lhpfyozvberhdwovcvoh.supabase.co/auth/v1/callback",
      },
    });
    if (error) throw error;

    console.log("User Signed In With Google: ", user);
    return { success: true, user, session };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

// 카카오 로그인
export const signInWithKakao = async () => {
  try {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: "https://lhpfyozvberhdwovcvoh.supabase.co/auth/v1/callback",
      },
    });

    if (error) throw error;

    console.log("User Signed In With Kakao:", user);
    return { success: true, user, session };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

// 이메일 로그인
export const signInWithEmail = async (email, password) => {
  try {
    const { data: beforeLoginInfo } = await supabase
      .from("user_info")
      .select("*")
      .eq("email", email)
      .single();

    console.log("로그인 전 user_info 데이터:", beforeLoginInfo);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("이메일 로그인 중 오류 발생:", error.message);
      return { success: false, error: error.message };
    }

    if (data?.user) {
      const { data: userInfo, error: userInfoError } = await supabase
        .from("user_info")
        .select("*")
        .eq("id", data.user.id)
        .single();

      console.log("로그인 후 user_info 데이터:", userInfo);

      if (userInfoError) {
        console.error("사용자 정보 조회 실패:", userInfoError);
        return { success: false, error: userInfoError.message };
      }

      // 4. name이 null로 변경되었다면 원래 값으로 복구
      if (!userInfo.name && beforeLoginInfo?.name) {
        const { error: updateError } = await supabase
          .from("user_info")
          .update({ name: beforeLoginInfo.name })
          .eq("id", data.user.id);

        if (updateError) {
          console.error("이름 복구 실패:", updateError);
        } else {
          console.log("이름 복구됨:", beforeLoginInfo.name);
          userInfo.name = beforeLoginInfo.name;
        }
      }

      return {
        success: true,
        user: {
          ...data.user,
          name: userInfo.name,
        },
      };
    }

    return { success: false, error: "로그인 실패" };
  } catch (error) {
    console.error("이메일 로그인 중 알 수 없는 오류 발생:", error);
    return { success: false, error: error.message };
  }
};
