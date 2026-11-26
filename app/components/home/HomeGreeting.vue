<!-- app/components/home/HomeGreeting.vue
     The greeting at the top of the home screen, for example "Goedemiddag, Ravi".
     The first word follows the time in the Netherlands (see app/utils/greeting.ts) and changes by itself
     while the page stays open, for example from "Goedemiddag" to "Goedenavond" at 18:00.
     Usage: <HomeGreeting name="Ravi" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The first name of the user, shown after the greeting
    name: { type: String, required: true },
  },
  data() {
    return {
      // The current moment. It is refreshed every minute, and the greeting below follows it
      now: new Date(),
      // The timer that refreshes `now`, saved so it can be stopped when the user leaves the page
      clockTimer: undefined as ReturnType<typeof setInterval> | undefined,
    };
  },
  computed: {
    // getGreeting comes from app/utils/greeting.ts (auto-imported by Nuxt).
    // Because it is a computed value, Vue updates the text on the screen every time `now` changes
    greeting(): string {
      return getGreeting(this.now);
    },
  },
  // mounted runs once the greeting is on the screen in the browser: start refreshing the time every minute
  mounted() {
    this.now = new Date();
    this.clockTimer = setInterval(() => {
      this.now = new Date();
    }, 60 * 1000);
  },
  // beforeUnmount runs just before the greeting is removed: stop the timer, so it does not keep running after leaving
  beforeUnmount() {
    clearInterval(this.clockTimer);
  },
});
</script>

<template>
  <!-- Same size, weight and color as the title in PageHeader. The design has no subtext here,
       so the greeting is its own <h1> instead of a PageHeader -->
  <h1 class="text-[32px] leading-9 font-semibold text-navy">{{ greeting }}, {{ name }}</h1>
</template>
