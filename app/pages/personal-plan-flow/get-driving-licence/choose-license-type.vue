<!-- app/pages/personal-plan-flow/get-driving-licence/choose-license-type.vue
     The second screen of the personal plan flow, for the "get your driving licence" plan: the user chooses the type of driving licence.
     The file name is the route: this page is at /personal-plan-flow/get-driving-licence/choose-license-type (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Type rijbewijs" });
  },
  data() {
    return {
      // The licence types the user can choose from (the categories from rijksoverheid.nl)
      licenseTypes: [
        { value: "am", title: "Rijbewijs AM", description: "Bromfiets, scooter, speedpedelec, snorfiets en brommobiel" },
        { value: "a", title: "Rijbewijs A, A1 of A2", description: "Motor" },
        { value: "b", title: "Rijbewijs B", description: "Auto" },
        { value: "be", title: "Rijbewijs BE", description: "Auto (B) met aanhanger" },
        { value: "c", title: "Rijbewijs C", description: "Vrachtwagen" },
        { value: "ce", title: "Rijbewijs CE", description: "Vrachtwagen (C) met aanhanger" },
        { value: "c1", title: "Rijbewijs C1", description: "Lichte vrachtwagen (gewicht tussen 3500 en 7500 kilo)" },
        { value: "c1e", title: "Rijbewijs C1E", description: "Vrachtwagen (C1) met aanhanger" },
        { value: "d", title: "Rijbewijs D", description: "Bus (meer dan 8 personen)" },
        { value: "de", title: "Rijbewijs DE", description: "Bus (D) met aanhanger" },
        { value: "d1", title: "Rijbewijs D1", description: "Kleine bus (8 tot 16 personen)" },
        { value: "d1e", title: "Rijbewijs D1E", description: "Kleine bus (D1) met aanhanger" },
        { value: "t", title: "Rijbewijs T", description: "Trekker (tractor)" },
      ],
      // The chosen licence type. Empty means nothing is chosen yet
      selectedLicense: "",
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
    // Called when the user presses "Volgende": goes to the plan details with the chosen licence as the title
    goToNextStep() {
      const chosen = this.licenseTypes.find((license) => license.value === this.selectedLicense);
      if (!chosen) return;
      // navigateTo is a Nuxt function (auto-imported). The query becomes "?title=Rijbewijs BE&license=be" in the address,
      // so the next page can read it
      navigateTo({
        path: "/personal-plan-flow/get-driving-licence/plan-details",
        query: { title: chosen.title, license: chosen.value },
      });
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Type rijbewijs" subtitle="Welk rijbewijs wilt u behalen?" />

    <div role="radiogroup" aria-label="Type rijbewijs" class="flex flex-col gap-4">
      <OptionCard
        v-for="license in licenseTypes"
        :key="license.value"
        v-model="selectedLicense"
        name="license"
        :value="license.value"
        :title="license.title"
        :description="license.description"
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

    <!-- Floats at the bottom of the screen, over the list. It is always there, grey until a type is chosen -->
    <div class="sticky bottom-7 mt-auto">
      <PrimaryButton label="Volgende" :disabled="selectedLicense === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
