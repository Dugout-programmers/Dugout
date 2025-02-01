import { supabase } from "./../../../src/supabase.js";

// 자유 게시물 작성
export const createFreePost = async (
  memberId,
  content,
  title,
  thumbnailUrl,
  thumbnailCount,
  clubId
) => {
  const { data, error } = await supabase
    .from("free_post")
    .insert([
      {
        member_id: memberId,
        content,
        title,
        thumbnail_url: thumbnailUrl,
        thumbnail_count: thumbnailCount,
        club_id: clubId,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating free post:", error);
    return null;
  }

  return data;
};

// 자유 게시물에 좋아요 추가
export const createFreePostLike = async (memberId, postId) => {
  const { data, error } = await supabase
    .from("free_post_like")
    .insert([{ member_id: memberId, post_id: postId }]);

  if (error) {
    console.error("Error creating free post like:", error);
    return null;
  }
  return data;
};

// 자유 게시물에 댓글 추가
export const createFreePostComment = async (memberId, postId, content) => {
  const { data, error } = await supabase
    .from("free_post_comment")
    .insert([{ member_id: memberId, post_id: postId, content }]);

  if (error) {
    console.error("Error creating free post comment:", error);
    return null;
  }
  return data;
};

// 특정 구단의 전체 게시물 조회
export const getFreePostsByClub = async (clubId) => {
  const { data, error } = await supabase.rpc("get_free_posts_by_club", {
    input_club_id: clubId,
  });

  if (error) {
    console.error("Error fetching free posts for the club:", error);
    return null;
  }
  return data;
};

// 특정 자유 게시물의 상세 정보 조회
export const getFreePostDetailsById = async (postId) => {
  const { data, error } = await supabase.rpc("get_free_post_details_by_id", {
    input_post_id: postId,
  });

  if (error) {
    console.error("Error fetching free post details:", error);
    return null;
  }
  return data;
};

// 자유 게시물 좋아요 조회
export const getFreePostLikes = async (postId) => {
  const { data, error } = await supabase
    .from("free_post_like")
    .select("*")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching free post likes:", error);
    return null;
  }
  return data;
};

// 자유 게시물 댓글 조회
export const getFreePostComments = async (postId) => {
  const { data, error } = await supabase
    .from("free_post_comment")
    .select("*")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching free post comments:", error);
    return null;
  }
  return data;
};

// 자유 게시물 수정
export const updateFreePost = async (
  postId,
  content,
  title,
  thumbnailUrl,
  thumbnailCount
) => {
  const { data, error } = await supabase
    .from("free_post")
    .update({
      content,
      title,
      thumbnail_url: thumbnailUrl,
      thumbnail_count: thumbnailCount,
    })
    .eq("id", postId);

  if (error) {
    console.error("Error updating free post:", error);
    return null;
  }
  return data;
};

// 자유 게시물 좋아요 취소
export const updateFreePostLike = async (postId, memberId) => {
  const { data, error } = await supabase
    .from("free_post_like")
    .delete()
    .eq("post_id", postId)
    .eq("member_id", memberId);

  if (error) {
    console.error("Error updating free post like:", error);
    return null;
  }
  return data;
};

// 자유 게시물 댓글 수정
export const updateFreePostComment = async (commentId, content) => {
  const { data, error } = await supabase
    .from("free_post_comment")
    .update({ content })
    .eq("id", commentId);

  if (error) {
    console.error("Error updating free post comment:", error);
    return null;
  }
  return data;
};

// 자유 게시물 삭제
export const deleteFreePost = async (postId) => {
  const { data, error } = await supabase
    .from("free_post")
    .delete()
    .eq("id", postId);

  if (error) {
    console.error("Error deleting free post:", error);
    return null;
  }
  return data;
};

// 자유 게시물 댓글 삭제
export const deleteFreePostComment = async (commentId) => {
  const { data, error } = await supabase
    .from("free_post_comment")
    .delete()
    .eq("id", commentId);

  if (error) {
    console.error("Error deleting free post comment:", error);
    return null;
  }
  return data;
};
