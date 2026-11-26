<!-- app/components/pin/PinDots.vue
     The row of PIN dots. It only shows how many digits are filled in, never the digits themselves.
     The first `filledCount` dots are blue, the rest are white with a sand border.
     With `has-error` the filled dots turn red and the row shakes once, to show the PIN was wrong.
     Usage: <PinDots :filled-count="pincode.length" :total="5" :has-error="isWrongPin" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // How many digits the user has entered so far
    filledCount: { type: Number, required: true },
    // How many dots to show (the length of the PIN)
    total: { type: Number, default: 5 },
    // True for a moment after a wrong PIN: the filled dots turn red and the row shakes
    hasError: { type: Boolean, default: false },
  },
  computed: {
    // The colors of a filled dot: red after a wrong PIN, blue otherwise.
    // The red (#D52B1E) is not one of the five team colors. It is only used here, for this error state
    filledDotClasses(): string {
      return this.hasError ? "border-[#D52B1E] bg-[#D52B1E]" : "border-blue bg-blue";
    },
    // The text for screen readers: the error, or how many digits are filled in
    statusText(): string {
      if (this.hasError) {
        return "Onjuiste pincode, probeer het opnieuw";
      }
      return `${this.filledCount} van ${this.total} cijfers ingevuld`;
    },
  },
});
</script>

<template>
  <div>
    <!-- The dots are only visual, so screen readers skip them (aria-hidden) and read the text below instead.
         The pin-dots-shake class (see <style>) is only added while hasError is true -->
    <div class="flex gap-3.5" :class="{ 'pin-dots-shake': hasError }" aria-hidden="true">
      <!-- v-for="index in total" counts from 1 to total. A dot is filled when its number is not higher than filledCount -->
      <span
        v-for="index in total"
        :key="index"
        class="size-6 rounded-full border"
        :class="index <= filledCount ? filledDotClasses : 'border-sand bg-white'"
      />
    </div>
    <!-- sr-only hides this text on screen, but screen readers read it. aria-live="polite" announces each change -->
    <p class="sr-only" aria-live="polite">{{ statusText }}</p>
  </div>
</template>

<!-- Tailwind has no class for a shake, so the animation is written here. "scoped": it only works in this component -->
<style scoped>
/* A short shake from left to right (0.4s), like a standard phone PIN screen.
   It only moves the row (transform), so nothing else on the page shifts */
.pin-dots-shake {
  animation: pin-dots-shake 0.4s ease-in-out;
}

@keyframes pin-dots-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-5px);
  }
  80% {
    transform: translateX(5px);
  }
}

/* People who turned on "reduce motion" don't get the shake. The red dots still show the error */
@media (prefers-reduced-motion: reduce) {
  .pin-dots-shake {
    animation: none;
  }
}
</style>
