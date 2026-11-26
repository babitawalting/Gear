<!-- app/layouts/default.vue -->
<!-- A layout wraps every page. Nuxt puts the current page where <slot /> is. -->
<script lang="ts">
export default defineComponent({
  computed: {
    // $route is the current page. route.meta holds what the page set with definePageMeta.
    // Every page shows the blue background shapes, unless it sets definePageMeta({ pageBackground: false })
    showPageBackground(): boolean {
      return this.$route.meta.pageBackground !== false;
    },
    // Every page shows the top bar (back button, logo, account), unless it sets definePageMeta({ topBar: false })
    // (the start and PIN screens come before the user is logged in, so they have no top bar)
    showTopBar(): boolean {
      return this.$route.meta.topBar !== false;
    },
    // The navigation bar is the other way around: it is hidden, unless the page sets definePageMeta({ bottomNav: true }).
    // Only the home, profile, kluis and plans overview pages turn it on.
    showBottomNav(): boolean {
      return this.$route.meta.bottomNav === true;
    },
    // The height the navigation bar covers at the bottom of the screen: 60px bar + 19px space under it.
    // It is saved in the CSS variable --bottom-nav-space, so the page and sticky buttons can stay above the bar.
    // Without the bar it is 0px, so nothing changes on the other pages.
    bottomNavSpace(): string {
      return this.showBottomNav ? "79px" : "0px";
    },
  },
});
</script>

<template>
  <div class="isolate min-h-screen bg-white" :style="{ '--bottom-nav-space': bottomNavSpace }">
    <!-- isolate (on the div above): the background shapes (-z-10) stay behind the page content, but in front of this white color -->
    <PageBackground v-if="showPageBackground" />
    <!-- One phone-width column (402px, the Figma frame) with 24px side margins.
         flex-col: the top bar and the page are stacked, and the page (flex-1) fills the height that is left.
         That is why pages use flex-1 instead of min-h-screen.
         pb-[var(--bottom-nav-space)]: extra space at the bottom, so the last content can scroll above the navigation bar -->
    <div class="mx-auto flex min-h-screen w-full max-w-[402px] flex-col px-6 pb-[var(--bottom-nav-space)] md:border-x md:border-sand">
      <header v-if="showTopBar">
        <TopBar />
      </header>
      <main class="flex flex-1 flex-col">
        <slot />
      </main>
    </div>
    <BottomNav v-if="showBottomNav" />
  </div>
</template>
