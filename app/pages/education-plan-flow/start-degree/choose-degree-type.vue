<!-- app/pages/education-plan-flow/start-degree/choose-degree-type.vue
     The second screen of the education plan flow, for the "start a degree" plan: the user chooses the type of degree.
     The file name is the route: this page is at /education-plan-flow/start-degree/choose-degree-type (Nuxt file-based routing). -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Type opleiding" });
  },
  data() {
    return {
      // The degree types the user can choose from. The descriptions are first versions and can change after user tests
      degreeTypes: [
        { value: "mbo", title: "MBO", description: "Middelbaar beroepsonderwijs, praktijkgericht" },
        { value: "hbo", title: "HBO", description: "Hogeschool, beroepsgericht" },
        { value: "wo", title: "WO", description: "Universiteit, wetenschappelijk" },
      ],
      // The chosen degree type. Empty means nothing is chosen yet
      selectedDegree: "",
    };
  },
  methods: {
    // Called when the user presses "Volgende". The next screen of the education flow does not exist yet
    goToNextStep() {
      // Nothing to go to yet
    },
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col gap-4 pt-4 pb-7">
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <PageHeader title="Type opleiding" subtitle="Welk type opleiding wilt u volgen?" />

    <div role="radiogroup" aria-label="Type opleiding" class="flex flex-col gap-4">
      <EPFOptionCard
        v-for="degree in degreeTypes"
        :key="degree.value"
        v-model="selectedDegree"
        name="degree"
        :value="degree.value"
        :title="degree.title"
        :description="degree.description"
      />
    </div>

    <!-- mt-auto pushes the button to the bottom of the screen. It is grey until a type is chosen -->
    <div class="mt-auto">
      <EPFNextButton :disabled="selectedDegree === ''" @click="goToNextStep" />
    </div>
  </div>
</template>
