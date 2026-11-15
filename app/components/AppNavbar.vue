<!-- app/components/AppNavbar.vue
     Top bar of the app: back button, Gear logo and the user's initials.
     The back button only shows when the page sets "backTo" with definePageMeta. -->
<script lang="ts">
export default defineComponent({
  props: {
    // Initials of the logged-in user (later: from the user's account)
    userInitials: { type: String, default: "RS" },
  },
  computed: {
    // $route is the current page. route.meta holds what the page set with definePageMeta.
    backTo(): string {
      return (this.$route.meta.backTo as string | undefined) ?? "";
    },
  },
});
</script>

<template>
  <nav class="flex items-center justify-between px-4 py-3" aria-label="Hoofdmenu">
    <NuxtLink
      v-if="backTo"
      :to="backTo"
      class="relative flex size-11 items-center justify-center rounded-full border border-sand bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      aria-label="Terug"
    >
      <!-- Arrow made with a line and a chevron (there is no arrow-left icon in the icon set) -->
      <span class="absolute h-0.5 w-4 rounded-xl bg-blue" aria-hidden="true" />
      <span
        class="absolute left-3.5 size-2.5 rotate-45 border-b-2 border-l-2 border-blue"
        aria-hidden="true"
      />
    </NuxtLink>
    <!-- Empty space with the same size, so the logo stays in the middle -->
    <span v-else class="size-11" aria-hidden="true" />

    <!-- NuxtLink is Nuxt's link for pages inside the website -->
    <NuxtLink
      to="/"
      class="flex min-h-11 items-center rounded-xl focus-visible:outline-2 focus-visible:outline-blue"
      aria-label="Gear, naar home"
    >
      <AppLogo />
    </NuxtLink>

    <span
      class="flex size-11 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white"
      role="img"
      :aria-label="`Ingelogd als ${userInitials}`"
    >
      {{ userInitials }}
    </span>
  </nav>
</template>
