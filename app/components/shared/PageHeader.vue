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
  <!-- min-w-0: when the header sits in a row (for example next to the three dots), it may get narrower than its text -->
  <header class="flex min-w-0 flex-col">
    <!-- text-[32px] is a custom size: Tailwind has no class for exactly 32px.
         A long word like "Diplomabeschrijving" does not fit on a small phone (320px).
         hyphens-auto splits it with a hyphen where Dutch allows it (the page is lang="nl"),
         wrap-break-word breaks it anyway when the browser can't hyphenate, so it never runs off the screen -->
    <h1 class="text-[32px] leading-9 font-semibold wrap-break-word hyphens-auto text-navy">{{ title }}</h1>
    <p class="text-sm leading-5 font-normal text-grey">{{ subtitle }}</p>
  </header>
</template>
