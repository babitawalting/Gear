<!-- app/components/AppIcon.vue
     Usage: <AppIcon name="house" class="size-6 text-[#01689B]" />
     The icon takes the current text color, so use Tailwind text-* classes. -->
<script setup lang="ts">
import { icons } from "~/utils/icons";

defineProps<{ name: string }>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="icons[name]" />
  </svg>
</template>
