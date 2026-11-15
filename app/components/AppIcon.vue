<!-- app/components/AppIcon.vue
     Usage: <AppIcon name="house" class="size-6 text-blue" />
     The icon takes the current text color, so use Tailwind text-* classes. -->
<script lang="ts">
import { icons } from "~/utils/icons";

export default defineComponent({
  props: {
    // Name of the icon, must be a key in app/utils/icons.ts
    name: { type: String, required: true },
  },
  computed: {
    path(): string {
      return icons[this.name] ?? "";
    },
  },
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    fill="currentColor"
    aria-hidden="true"
  >
    <path :d="path" />
  </svg>
</template>
