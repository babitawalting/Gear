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
  },
});
</script>

<template>
  <div class="isolate min-h-screen bg-white">
    <!-- isolate (on the div above): the background shapes (-z-10) stay behind the page content, but in front of this white color -->
    <PageBackground v-if="showPageBackground" />
    <!-- One phone-width column (402px, the Figma frame) with 24px side margins -->
    <main class="mx-auto min-h-screen w-full max-w-[402px] px-6 md:border-x md:border-sand">
      <slot />
    </main>
  </div>
</template>
