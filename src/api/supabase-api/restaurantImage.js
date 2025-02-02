import { supabase } from "@/supabase";

// 이미지 추가 ✅
export const createRestaurantPostImage = async (
  postId,
  imageUrl,
  imageIndex
) => {
  const { data, error } = await supabase
    .from("restaurant_post_image")
    .insert([{ post_id: postId, url: imageUrl, order_index: imageIndex }]);

  if (error) {
    console.error("Error creating restaurant post image:", error);
    return null;
  }

  return data;
};

// 특정 게시물의 이미지 조회 ✅
export const getRestaurantPostImages = async (postId) => {
  const { data, error } = await supabase
    .from("restaurant_post_image")
    .select("*")
    .eq("post_id", postId);

  if (error) {
    console.error("Error fetching restaurant post images:", error);
    return null;
  }
  return data;
};

// 특정 게시물의 특정 번호 이미지 수정 ✅
export const updateRestaurantPostImage = async (
  postId,
  orderIndex,
  imageUrl
) => {
  const { data, error } = await supabase
    .from("restaurant_post_image")
    .update({ url: imageUrl })
    .eq("post_id", postId)
    .eq("order_index", orderIndex);

  if (error) {
    console.error("Error updating restaurant post image:", error);
    return null;
  }
  return data;
};

// 게시물에 해당 order_index 이미지가 이미 존재하는지 확인
export const checkIfImageExists = async (postId, orderIndex) => {
  const { data, error } = await supabase
    .from("restaurant_post_image")
    .select("url")
    .eq("post_id", postId)
    .eq("order_index", orderIndex)
    .single();

  if (error) {
    console.error("이미지 존재 여부 확인 실패", error);
    return null;
  }

  return data; // 이미지가 존재하면 해당 데이터를 반환
};


// 게시물 이미지 삭제 ✅
export const deleteRestaurantPostImage = async (postId, index) => {
  const { data, error } = await supabase
    .from("restaurant_post_image")
    .delete()
    .eq("post_id", postId)
    .eq("order_index", index);

  if (error) {
    console.error("Error deleting restaurant post image:", error);
    return null;
  }
  return data;
};
