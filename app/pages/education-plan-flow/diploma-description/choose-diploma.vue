<!-- app/pages/education-plan-flow/diploma-description/choose-diploma.vue
     The second screen of the "diploma description" plan: the user chooses the diploma they want a description for.
     The file name is the route: this page is at /education-plan-flow/diploma-description/choose-diploma (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Type diploma" });
  },
  data() {
    return {
      // The diplomas the user can choose from. For MBO the description is made by SBB and not by Nuffic,
      // so the flow after this choice will be different (that screen does not exist yet)
      diplomas: [
        { value: "vmbo-t", title: "VMBO-T", description: "Voortgezet onderwijs" },
        { value: "havo", title: "HAVO", description: "Voortgezet onderwijs" },
        { value: "vwo", title: "VWO", description: "Voortgezet onderwijs" },
        { value: "mbo", title: "MBO", description: "Middelbaar beroepsonderwijs" },
        { value: "hbo-propedeuse", title: "HBO-propedeuse", description: "Hogeschool" },
        { value: "hbo-bachelor", title: "HBO-bachelor", description: "Hogeschool" },
        { value: "hbo-master", title: "HBO-master", description: "Hogeschool" },
        { value: "wo-propedeuse", title: "WO-propedeuse", description: "Universiteit" },
        { value: "wo-bachelor", title: "WO-bachelor", description: "Universiteit" },
        { value: "wo-master", title: "WO-master", description: "Universiteit" },
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
    // Called when the user presses "Volgende": goes to the plan details
    goToNextStep() {
      // navigateTo is a Nuxt function (auto-imported) that goes to another page
      navigateTo("/education-plan-flow/diploma-description/plan-details");
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Type diploma" subtitle="Voor welk diploma wilt u een beschrijving?" />

    <div role="radiogroup" aria-label="Type diploma" class="flex flex-col gap-4">
      <EPFOptionCard
        v-for="diploma in diplomas"
        :key="diploma.value"
        v-model="selectedDiploma"
        name="diploma"
        :value="diploma.value"
        :title="diploma.title"
        :description="diploma.description"
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
    <div class="sticky bottom-7 mt-auto">
      <EPFNextButton :disabled="selectedDiploma === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
