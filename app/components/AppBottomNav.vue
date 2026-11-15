<!-- app/components/AppBottomNav.vue
     Navigation bar at the bottom of the screen. The current page is shown in blue. -->
<script lang="ts">
export default defineComponent({
  data() {
    return {
      links: [
        { to: "/", label: "Home", icon: "house" },
        { to: "/plannen", label: "Plannen", icon: "file-lines" },
        { to: "/kluis", label: "Kluis", icon: "unlock" },
        { to: "/meldingen", label: "Meldingen", icon: "bell" },
      ],
    };
  },
  methods: {
    // "/" is only active on the home page, other links also on their sub pages (like /plannen/1)
    isActive(to: string): boolean {
      // $route is the current URL, Nuxt sets this up for us
      if (to === "/") {
        return this.$route.path === "/";
      }
      return this.$route.path.startsWith(to);
    },
  },
});
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white"
    aria-label="Menu onderaan"
  >
    <ul class="mx-auto flex max-w-md">
      <li v-for="link in links" :key="link.to" class="flex-1">
        <NuxtLink
          :to="link.to"
          class="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
          :class="isActive(link.to) ? 'font-semibold text-blue' : 'text-grey'"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          <AppIcon :name="link.icon" class="size-6" />
          {{ link.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
