<!-- app/components/home/HomeQuickContinue.vue
     The "Snel verder" card on the home screen: a short list of plans and documents the user worked on recently.
     For now this is only the look from the Figma design "Home V3", with sample items.
     The rows are not links or buttons yet, so tapping them does nothing. The real data and links are added later.
     Usage: <HomeQuickContinue /> -->
<script lang="ts">
export default defineComponent({
  data() {
    return {
      // Sample items from the Figma design. Later these come from the user's plans and documents
      items: [
        { label: "Afgerond plan", title: "Inschrijven cyber security cursus" },
        { label: "Recent bewijs", title: "HBO Diploma - ICT" },
        { label: "Afgerond plan", title: "Rijbewijs B" },
      ],
    };
  },
});
</script>

<template>
  <section class="rounded-xl border border-sand bg-white px-4 pt-5 pb-4" aria-labelledby="quick-continue-title">
    <!-- The title is written in normal letters, uppercase only changes the look.
         tracking-wider adds the extra space between the letters from the design -->
    <h2 id="quick-continue-title" class="mb-1 text-xs leading-4 font-semibold tracking-wider text-grey uppercase">
      Snel verder
    </h2>

    <!-- divide-y draws a sand line between the rows (not above the first or under the last) -->
    <ul class="flex flex-col divide-y divide-sand">
      <li v-for="item in items" :key="item.title" class="flex items-center gap-3 py-3">
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <span class="text-xs leading-4 font-normal text-grey">{{ item.label }}</span>
          <span class="text-sm leading-5 font-normal text-navy">{{ item.title }}</span>
        </div>
        <!-- The arrow is only decoration for now (IconDisplay hides it from screen readers) -->
        <IconDisplay name="arrow-right" class="size-6 shrink-0 text-blue" />
      </li>
    </ul>
  </section>
</template>
