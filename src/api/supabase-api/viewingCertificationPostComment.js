import { getCurrentUser } from "./userInfo";
import { supabase } from "@/supabase";

// 특정 직관 인증 게시물의 댓글 불러오기
export const getCertificationPostComments = async (table, postId) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("post_id", postId);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("댓글 불러오기 실패: ", error);
    return null;
  }
};

// 특정 직관 인증 게시물에 댓글 추가하기(생성하기)
export const createCertificationPostComment = async (postId, content) => {
  try {
    const user = await getCurrentUser();
    if (!user) console.log("로그인을 하지 않았습니다");

    const { data, error } = await supabase
      .from("viewing_certification_post_comment")
      .insert([{ post_id: postId, member_id: user.id, content: content }])
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("댓글 추가 실패: ", error);
    return null;
  }
};

// 특정 직관 인증 게시물의 댓글 수정하기
export const updateCertificationPostComment = async (commentId, newComment) => {
  try {
    const user = await getCurrentUser();
    if (!user) console.log("로그인을 하지 않았습니다");

    // 댓글 작성자 확인
    const { data: comment, error: fetchError } = await supabase
      .from("viewing_certification_post_comment")
      .select("member_id")
      .eq("id", commentId)
      .single();

    if (fetchError) {
      console.error("댓글 정보 가져오기 실패:", fetchError.message);
      throw new Error("댓글 정보를 가져오는 데 실패했습니다.");
    }

    // 댓글 작성자와 로그인한 유저 확인
    if (comment.member_id !== user.id)
      throw new Error("본인이 작성한 댓글만 수정할 수 있습니다.");

    // 댓글 수정
    const { data, error } = await supabase
      .from("viewing_certification_post_comment")
      .update({ content: newComment })
      .eq("id", commentId)
      .select();

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    console.error("댓글 수정 실패: ", error);
    return null;
  }
};

// 특정 직관 인증 게시물의 댓글 삭제하기
export const deleteCertificationPostComment = async (commentId) => {
  try {
    const user = await getCurrentUser();
    if (!user) console.log("로그인을 하지 않았습니다");

    // 댓글 작성자 확인
    const { data: comment, error: fetchError } = await supabase
      .from("viewing_certification_post_comment")
      .select("member_id")
      .eq("id", commentId)
      .single();

    if (fetchError) {
      console.error("댓글 정보 가져오기 실패:", fetchError.message);
      throw new Error("댓글 정보를 가져오는 데 실패했습니다.");
    }

    // 댓글 작성자와 로그인한 유저 확인
    if (comment.member_id !== user.id)
      throw new Error("본인이 작성한 댓글만 삭제할 수 있습니다.");

    const { error } = await supabase
      .from("viewing_certification_post_comment")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("댓글 삭제 실패: ", error.message);
      throw new Error("댓글 삭제에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error("댓글 삭제 실패: ", error);
    return null;
  }
};
