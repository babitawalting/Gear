<!-- app/pages/index.vue
     File-based routing: this file is the "/" route (home).
     Placeholder until the home page is designed. -->
<script lang="ts">
export default defineComponent({
  // useHead is a Nuxt composable, so it runs in setup(); it sets the page title
  setup() {
    useHead({ title: "Home" });
  },
});
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <h1 class="text-3xl font-semibold text-navy">Home</h1>
    <p class="text-sm text-navy">Deze pagina wordt later gemaakt.</p>
  </main>
</template>
