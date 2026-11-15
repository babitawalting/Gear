<!-- app/pages/plannen/[id].vue
     File-based routing: [id] in the file name is a variable part of the URL.
     So /plannen/1 and /plannen/2 both open this page, with a different id. -->
<script lang="ts">
import type { Plan } from "~/utils/examplePlans";

// definePageMeta gives the page extra settings. backTo is read by AppNavbar for the back arrow.
definePageMeta({ backTo: "/plannen" });

export default defineComponent({
  // useHead and useRoute are Nuxt composables, so they run in setup(); this sets the page title
  setup() {
    const plan = findPlan(Number(useRoute().params.id));
    useHead({ title: plan ? plan.title : "Plan niet gevonden" });
  },
  data() {
    return {
      vaultItems: exampleVault,
    };
  },
  computed: {
    // The plan that belongs to the id in the URL
    plan(): Plan | undefined {
      return findPlan(Number(this.$route.params.id));
    },
  },
});
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <template v-if="plan">
      <PlanHeader :title="plan.title" :subtitle="plan.type" />
      <PrelaunchStep
        :vault-items="vaultItems"
        :initial-selected-ids="plan.selectedVaultIds"
      />
      <RequirementsStep :requirements="plan.requirements" />
    </template>

    <template v-else>
      <h1 class="text-3xl font-semibold text-navy">Plan niet gevonden</h1>
      <NuxtLink to="/plannen" class="text-sm text-blue underline">Naar alle plannen</NuxtLink>
    </template>
  </main>
</template>
