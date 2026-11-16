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
      // The diplomas Nuffic makes a description for (an mbo diploma is not in the list: that goes through SBB)
      diplomas: [
        { value: "vmbo-t", title: "VMBO-T", description: "Voortgezet onderwijs" },
        { value: "havo", title: "HAVO", description: "Voortgezet onderwijs" },
        { value: "vwo", title: "VWO", description: "Voortgezet onderwijs" },
        { value: "hbo", title: "HBO", description: "Propedeuse, bachelor of master" },
        { value: "wo", title: "WO", description: "Propedeuse, bachelor of master" },
      ],
      // The chosen diploma. Empty means nothing is chosen yet
      selectedDiploma: "",
    };
  },
  methods: {
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

    <!-- An MBO diploma is not in the list: Nuffic does not describe it, SBB does -->
    <p class="text-xs leading-4 font-normal text-grey">Een MBO-diploma? Neem dan contact op met SBB.</p>

    <!-- mt-auto pushes the button to the bottom of the screen. It is grey until a diploma is chosen -->
    <div class="mt-auto">
      <EPFNextButton :disabled="selectedDiploma === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
