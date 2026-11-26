<!-- app/components/profile/ProfileAvatar.vue
     A blue circle with the initials of a person, from the Figma profile screens (RS for Ravi, BK for Ben Kampen).
     The name is always written next to the avatar, so the initials themselves are hidden from screen readers.
     Usage: <ProfileAvatar initials="RS" size="large" />
            <ProfileAvatar initials="BK" size="medium" has-notification /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // One or two letters, for example "RS"
    initials: { type: String, required: true },
    // "small" (32px, message screen), "medium" (36px, messages overview) or "large" (70px, profile card)
    size: { type: String, default: "medium" },
    // True shows a red dot at the top right, for example for an unread message (static for now)
    hasNotification: { type: Boolean, default: false },
  },
  computed: {
    // The size of the circle and of the letters per size. The two custom sizes come from Figma (Tailwind has no class for them)
    sizeClasses(): string {
      const sizes: Record<string, string> = {
        small: "size-8 text-sm",
        medium: "size-9 text-base",
        large: "size-[70px] text-[28px]",
      };
      return sizes[this.size] ?? sizes.medium!;
    },
  },
});
</script>

<template>
  <!-- `relative` lets the notification dot sit on top of the circle -->
  <span
    class="relative flex shrink-0 items-center justify-center rounded-full bg-blue leading-none font-normal text-white"
    :class="sizeClasses"
  >
    <span aria-hidden="true">{{ initials }}</span>
    <!-- Red dot (decoration). The component that uses the avatar says "ongelezen" in words for screen readers -->
    <span
      v-if="hasNotification"
      class="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-red"
      aria-hidden="true"
    />
  </span>
</template>
