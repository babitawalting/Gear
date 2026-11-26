<!-- app/pages/education-plan-flow/diploma-description/choose-diploma.vue
     The second screen of the "diploma description" plan: the user chooses the diploma they want a description for.
     The file name is the route: this page is at /education-plan-flow/diploma-description/choose-diploma (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Diploma keuze" });
  },
  data() {
    return {
      // The diplomas the user can choose from. For MBO the description is made by SBB and not by Nuffic,
      // so the flow after this choice will be different (that screen does not exist yet)
      diplomas: [
        { value: "vmbo-t", title: "VMBO-T" },
        { value: "havo", title: "HAVO" },
        { value: "vwo", title: "VWO" },
        { value: "mbo", title: "MBO" },
        { value: "hbo-propedeuse", title: "HBO-propedeuse" },
        { value: "hbo-bachelor", title: "HBO-bachelor" },
        { value: "hbo-master", title: "HBO-master" },
        { value: "wo-propedeuse", title: "WO-propedeuse" },
        { value: "wo-bachelor", title: "WO-bachelor" },
        { value: "wo-master", title: "WO-master" },
      ],
      // The chosen diploma. Empty means nothing is chosen yet
      selectedDiploma: "",
      // True when the page is scrolled all the way down: then the button covers nothing, so the shade goes away
      isScrolledToBottom: false,
    };
  },
  // mounted() runs once, when the page is on the screen. We start listening to scrolling and resizing
  mounted() {
    window.addEventListener("scroll", this.updateShade);
    window.addEventListener("resize", this.updateShade);
    this.updateShade();
  },
  // beforeUnmount() runs when the user leaves the page. We stop listening, so nothing keeps running
  beforeUnmount() {
    window.removeEventListener("scroll", this.updateShade);
    window.removeEventListener("resize", this.updateShade);
  },
  methods: {
    // Checks if the bottom of the page is reached (1px of room for rounding)
    updateShade() {
      const bottomOfScreen = window.scrollY + window.innerHeight;
      this.isScrolledToBottom = bottomOfScreen >= document.documentElement.scrollHeight - 1;
    },
    // Called when the user presses "Volgende": goes to the plan details, with the chosen diploma in the title
    goToNextStep() {
      const chosen = this.diplomas.find((diploma) => diploma.value === this.selectedDiploma);
      if (!chosen) return;
      // navigateTo is a Nuxt function (auto-imported). The query becomes "?title=HBO-bachelor beschrijving&diploma=HBO-bachelor" in the address,
      // so the next page can read it
      navigateTo({
        path: "/education-plan-flow/diploma-description/plan-details",
        query: { title: `${chosen.title} beschrijving`, diploma: chosen.title },
      });
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 pt-4 pb-7">
    <PageHeader title="Diploma keuze" subtitle="Welk diploma wilt u laten beschrijven?" />

    <div role="radiogroup" aria-label="Diploma keuze" class="flex flex-col gap-4">
      <OptionCard
        v-for="diploma in diplomas"
        :key="diploma.value"
        v-model="selectedDiploma"
        name="diploma"
        :value="diploma.value"
        :title="diploma.title"
      />
    </div>

    <!-- A soft shade at the bottom of the screen, under the button. It is see-through at the top and
         20% navy at the bottom, so the cards seem to fade out. pointer-events-none lets clicks go through it.
         At the bottom of the page it fades away (opacity-0), because the button covers nothing there -->
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-x-0 bottom-0 h-56 bg-linear-to-b from-transparent to-navy/20 transition-opacity duration-200"
      :class="isScrolledToBottom ? 'opacity-0' : 'opacity-100'"
    />

    <!-- Floats at the bottom of the screen, over the list. It is grey until a diploma is chosen -->
    <!-- 28px above the bottom of the screen, or above the navigation bar when a page shows it (--bottom-nav-space is set in the layout) -->
    <div class="sticky bottom-[calc(var(--bottom-nav-space)+28px)] mt-auto">
      <PrimaryButton label="Volgende" :disabled="selectedDiploma === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
