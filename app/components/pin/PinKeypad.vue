<!-- app/components/pin/PinKeypad.vue
     The number keypad: 1-9 in a 3 x 3 grid, then an empty spot, 0 and a delete key.
     The keypad does not remember the PIN itself. It only tells its parent what was pressed:
     - "press" with the digit as a string, for example "7"
     - "delete" when the delete key is pressed
     Usage: <PinKeypad @press="addDigit" @delete="removeDigit" /> -->
<script lang="ts">
export default defineComponent({
  // emits lists the events this component can send to its parent
  emits: ["press", "delete"],
  data() {
    return {
      // The digits of the first three rows
      digits: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    };
  },
});
</script>

<template>
  <!-- An even grid: 3 columns of 68px keys with 18px between them, as in the Figma design.
       On a low screen (short:, see app/assets/css/main.css) the keys are 64px with 12px between them, so the keypad fits.
       The digits are semibold on purpose (an exception to "buttons are regular"): the Figma design shows them that way -->
  <div class="grid grid-cols-[repeat(3,68px)] gap-4.5 short:grid-cols-[repeat(3,64px)] short:gap-3">
    <button
      v-for="digit in digits"
      :key="digit"
      type="button"
      class="flex size-17 items-center short:size-16 justify-center rounded-full border border-sand bg-white text-[28px] leading-none font-semibold text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('press', digit)"
    >
      {{ digit }}
    </button>

    <!-- The bottom left spot is empty in the design. It is a plain div, so it is not a button -->
    <div aria-hidden="true" />

    <button
      type="button"
      class="flex size-17 items-center short:size-16 justify-center rounded-full border border-sand bg-white text-[28px] leading-none font-semibold text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('press', '0')"
    >
      0
    </button>

    <!-- The delete key only has an icon, so it needs an aria-label to tell screen readers what it does -->
    <button
      type="button"
      aria-label="Laatste cijfer verwijderen"
      class="flex size-17 items-center short:size-16 justify-center rounded-full border border-sand bg-white text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="$emit('delete')"
    >
      <!-- Backspace icon from the Figma design. It is not in the shared icon list, so it lives here as an inline SVG.
           The viewBox is the 36 x 36 icon area from Figma, fill="currentColor" makes it follow text-blue -->
      <svg
        class="size-9"
        viewBox="268 591 36 36"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M303 601.667C303 599.644 301.356 598 299.333 598H281.762C280.788 598 279.854 598.384 279.167 599.071L270.539 607.705C270.195 608.049 270 608.513 270 609C270 609.487 270.195 609.951 270.539 610.295L279.167 618.929C279.854 619.616 280.788 620 281.762 620H299.333C301.356 620 303 618.356 303 616.333V601.667ZM286.277 605.11C286.815 604.571 287.686 604.571 288.219 605.11L290.161 607.052L292.103 605.11C292.642 604.571 293.513 604.571 294.045 605.11C294.578 605.648 294.584 606.519 294.045 607.052L292.103 608.994L294.045 610.936C294.584 611.475 294.584 612.346 294.045 612.879C293.507 613.411 292.636 613.417 292.103 612.879L290.161 610.936L288.219 612.879C287.68 613.417 286.809 613.417 286.277 612.879C285.744 612.34 285.738 611.469 286.277 610.936L288.219 608.994L286.277 607.052C285.738 606.514 285.738 605.643 286.277 605.11Z"
        />
      </svg>
    </button>
  </div>
</template>
