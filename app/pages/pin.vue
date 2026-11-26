<!-- app/pages/pin.vue
     The file name is the route: this page is at /pin (Nuxt file-based routing).
     The page only holds the PIN and connects the components. The components themselves live in
     app/components/pin/ (PinDots, PinKeypad, PinBackground) and app/components/shared/ (GearLogo).
     A prototype of the PIN screen with a demo PIN (12312):
     - the right PIN opens the home screen (/home)
     - a wrong PIN turns the dots red, shakes them and empties them after 600ms, so the user can try again -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This screen draws its own background (PinBackground), so the shared PageBackground of the default layout is turned off.
definePageMeta({ pageBackground: false, topBar: false });

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
      // The demo PIN for this prototype. It is written in the page, so anyone can find it in the browser:
      // a real PIN check has to happen on the server later
      demoPincode: "12312",
      // True while the wrong-PIN feedback is shown (red dots + shake). The keypad is ignored during that time
      isWrongPin: false,
      // True after the right PIN, while the home screen opens. The keypad is ignored then as well
      isPinAccepted: false,
      // The timer that empties the dots after a wrong PIN, saved so it can be stopped when the user leaves the page
      resetTimer: undefined as ReturnType<typeof setTimeout> | undefined,
    };
  },
  computed: {
    // The keypad only works when no feedback is running and the home screen is not opening
    isInputBlocked(): boolean {
      return this.isWrongPin || this.isPinAccepted;
    },
  },
  // beforeUnmount runs just before the page is removed: stop the timer, so it does not run after leaving
  beforeUnmount() {
    clearTimeout(this.resetTimer);
  },
  methods: {
    // Called by the keypad's "press" event: add the digit, unless the PIN is already full or input is blocked.
    // When the 5th digit is typed, the PIN is checked straight away
    addDigit(digit: string) {
      if (this.isInputBlocked || this.pincode.length >= this.pincodeLength) {
        return;
      }
      this.pincode += digit;
      if (this.pincode.length === this.pincodeLength) {
        this.checkPincode();
      }
    },
    // Called by the keypad's "delete" event: remove the last digit (does nothing when the PIN is empty or input is blocked)
    removeDigit() {
      if (this.isInputBlocked) {
        return;
      }
      this.pincode = this.pincode.slice(0, -1);
    },
    // Compares the 5 typed digits with the demo PIN
    checkPincode() {
      if (this.pincode === this.demoPincode) {
        this.isPinAccepted = true;
        // navigateTo is a Nuxt function (auto-imported) that opens another page. /home is the home screen route
        // the whole team uses (BottomNav and TopBar link to it). Until app/pages/home.vue exists, Nuxt shows its 404 page
        navigateTo("/home");
        return;
      }
      // Wrong PIN: show the red dots and the shake, then empty the dots after 600ms so the user can try again
      this.isWrongPin = true;
      this.resetTimer = setTimeout(() => {
        this.pincode = "";
        this.isWrongPin = false;
      }, 600);
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

    <!-- The dots get the number of digits typed. When pincode changes, Vue updates the dots automatically.
         has-error turns them red and makes them shake after a wrong PIN -->
    <PinDots class="mt-11.5" :filled-count="pincode.length" :total="pincodeLength" :has-error="isWrongPin" />

    <!-- The keypad sends events up: @press calls addDigit with the digit, @delete calls removeDigit -->
    <PinKeypad class="mt-13" @press="addDigit" @delete="removeDigit" />
  </div>
</template>
