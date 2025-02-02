<script setup>
import ToggleDropdown from "@/assets/icons/theme_toggle.svg";
import { twMerge } from "tailwind-merge";

const props = defineProps({
  disabled: Boolean,
  part: String,
  selectedOption: String,
  options: Array,
  isOpen: Boolean, 
});

const emit = defineEmits(["update:selectedOption", "toggle"]);

const selectOption = (option) => {
  emit("update:selectedOption", option);
  emit("toggle");
};
</script>

<template>
  <div class="relative w-full">
    <button
      :disabled="props.disabled"
      @click="emit('toggle')"
      :class="
        twMerge(
          'flex items-center justify-between w-full h-[40px] px-[15px] bg-white02 text-black01 text-[18px] rounded-[8px]',
          props.isOpen && 'rounded-b-[0px]'
        )
      "
    >
      {{ props.selectedOption }}
      <img :src="ToggleDropdown" class="w-[18px] h-[10.28px]" />
    </button>

    <div
      v-if="props.isOpen"
      :class="
        twMerge(
          'absolute left-0 top-full w-full bg-white02 text-black01 text-[18px] rounded-[8px] z-10',
          props.isOpen && 'rounded-t-[0px]'
        )
      "
    >
      <ul>
        <li
          v-for="option in props.options"
          :key="option"
          @click="selectOption(option)"
          class="flex items-center w-full h-[40px] px-[15px] cursor-pointer"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>
