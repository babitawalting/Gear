<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useHead, which sets <html lang="nl"> once for the whole site
  setup() {
    useHead({ htmlAttrs: { lang: "nl" } });
  },
});
</script>

<template>
  <div>
    <!-- Announces page changes to screen readers -->
    <NuxtRouteAnnouncer />
    <!-- The layout (app/layouts/default.vue) wraps the current page -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
