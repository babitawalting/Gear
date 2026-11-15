<!-- app/pages/meldingen.vue
     File-based routing: this file is the "/meldingen" route.
     Placeholder until notifications are made. -->
<script lang="ts">
export default defineComponent({
  // useHead is a Nuxt composable, so it runs in setup(); it sets the page title
  setup() {
    useHead({ title: "Meldingen" });
  },
});
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <h1 class="text-3xl font-semibold text-navy">Meldingen</h1>
    <p class="text-sm text-navy">Deze pagina wordt later gemaakt.</p>
  </main>
</template>
