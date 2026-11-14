<!-- app/components/shared/PageHeader.vue
     The title and subtext at the top of every page. The styling is always the same, the text differs per page.
     Usage: <PageHeader title="Plannen" subtitle="Een overzicht van uw plannen" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The page title (becomes the <h1> of the page), in Dutch
    title: { type: String, required: true },
    // The line under the title, in Dutch
    subtitle: { type: String, required: true },
  },
});
</script>

<template>
  <header class="flex flex-col">
    <!-- text-[32px] is a custom size: Tailwind has no class for exactly 32px -->
    <h1 class="text-[32px] leading-9 font-semibold text-navy">{{ title }}</h1>
    <p class="text-sm leading-5 font-normal text-grey">{{ subtitle }}</p>
  </header>
</template>
