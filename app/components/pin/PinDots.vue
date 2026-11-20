<!-- app/components/pin/PinDots.vue
     The row of PIN dots. It only shows how many digits are filled in, never the digits themselves.
     The first `filledCount` dots are blue, the rest are white with a sand border.
     Usage: <PinDots :filled-count="pincode.length" :total="5" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // How many digits the user has entered so far
    filledCount: { type: Number, required: true },
    // How many dots to show (the length of the PIN)
    total: { type: Number, default: 5 },
  },
});
</script>

<template>
  <div>
    <!-- The dots are only visual, so screen readers skip them (aria-hidden) and read the text below instead -->
    <div class="flex gap-3.5" aria-hidden="true">
      <!-- v-for="index in total" counts from 1 to total. A dot is filled when its number is not higher than filledCount -->
      <span
        v-for="index in total"
        :key="index"
        class="size-6 rounded-full border"
        :class="index <= filledCount ? 'border-blue bg-blue' : 'border-sand bg-white'"
      />
    </div>
    <!-- sr-only hides this text on screen, but screen readers read it. aria-live="polite" announces each change -->
    <p class="sr-only" aria-live="polite">{{ filledCount }} van {{ total }} cijfers ingevuld</p>
  </div>
</template>
