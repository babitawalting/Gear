<!-- app/pages/plannen/index.vue
     File-based routing: this file is the "/plannen" route.
     Overview of all application plans of the user. -->
<script lang="ts">
export default defineComponent({
  // useHead is a Nuxt composable, so it runs in setup(); it sets the page title
  setup() {
    useHead({ title: "Plannen" });
  },
  data() {
    return {
      // examplePlans comes from app/utils/examplePlans.ts (auto-imported)
      plans: examplePlans,
    };
  },
});
</script>

<template>
  <main class="flex flex-col gap-4 px-4">
    <h1 class="text-3xl font-semibold text-navy">Plannen</h1>

    <p v-if="plans.length === 0" class="text-sm text-navy">
      U heeft nog geen plannen.
    </p>
    <ul v-else class="flex flex-col gap-3">
      <li v-for="plan in plans" :key="plan.id">
        <PlanCard
          :id="plan.id"
          :title="plan.title"
          :type="plan.type"
          :progress="plan.progress"
        />
      </li>
    </ul>
  </main>
</template>
