<script setup>
const props = defineProps({
  status: {
    type: String,
  },
});
</script>
<template>
  <div
    class="w-[96px] h-[39px] flex justify-center items-center gap-[10px] rounded-[10px] bg-opacity-10"
    :class="
      props.status === '모집 중'
        ? 'bg-progressing bg-opacity-10'
        : 'bg-Done bg-opacity-10'
    "
  >
    <div
      class="w-[10px] h-[10px] rounded-full"
      :class="props.status === '모집 중' ? 'bg-progressing ' : 'bg-Done '"
    ></div>
    <span>{{ props.status === "모집 중" ? "모집 중" : "모집 완료" }}</span>
  </div>
</template>

<style scoped></style>
