<!-- app/pages/pin.vue
     The file name is the route: this page is at /pin (Nuxt file-based routing).
     The page only holds the PIN and connects the components. The components themselves live in
     app/components/pin/ (PinDots, PinKeypad, PinBackground) and app/components/shared/ (GearLogo).
     A prototype of the PIN screen: the user can type up to 5 digits and delete them again.
     There is no real PIN check or navigation yet. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This screen draws its own background (PinBackground), so the shared PageBackground of the default layout is turned off.
definePageMeta({ pageBackground: false });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Pincode" });
  },
  data() {
    return {
      // The digits typed so far, as text (for example "381"). The page is the only place that knows the PIN
      pincode: "",
      // How many digits a PIN has
      pincodeLength: 5,
    };
  },
  methods: {
    // Called by the keypad's "press" event: add the digit, unless the PIN is already full
    addDigit(digit: string) {
      if (this.pincode.length < this.pincodeLength) {
        this.pincode += digit;
      }
    },
    // Called by the keypad's "delete" event: remove the last digit (does nothing when the PIN is empty)
    removeDigit() {
      this.pincode = this.pincode.slice(0, -1);
    },
  },
});
</script>

<template>
  <div class="relative isolate flex min-h-screen flex-col items-center pt-16.5 pb-8">
    <!-- relative + isolate on this div: PinBackground is positioned inside it and stays behind the content.
         The spacing (pt-16.5, mt-16, ...) follows the positions in the Figma design -->
    <PinBackground />

    <!-- Shared logo component, see app/components/shared/GearLogo.vue -->
    <GearLogo />

    <!-- The design has a centered title without subtext. PageHeader is left aligned and needs a subtitle,
         so this page writes its own <h1>, with the same font size, weight and color as the PageHeader title -->
    <h1 class="mt-16 text-center text-[32px] leading-9 font-semibold text-navy">Vul uw pincode in</h1>

    <!-- The dots get the number of digits typed. When pincode changes, Vue updates the dots automatically -->
    <PinDots class="mt-11.5" :filled-count="pincode.length" :total="pincodeLength" />

    <!-- The keypad sends events up: @press calls addDigit with the digit, @delete calls removeDigit -->
    <PinKeypad class="mt-13" @press="addDigit" @delete="removeDigit" />
  </div>
</template>
