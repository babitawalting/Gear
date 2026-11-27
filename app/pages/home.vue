<!-- app/pages/home.vue
     The file name is the route: this page is at /home (Nuxt file-based routing).
     The home screen from the Figma design "Home V3". The PIN screen (/pin) opens this page after the right PIN.
     The top bar (TopBar), the background shapes (PageBackground) and the navigation bar (BottomNav)
     come from the default layout, so this page only holds its own content. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This page shows the navigation bar at the bottom (BottomNav in the default layout). Home is active there by itself on /home.
definePageMeta({ bottomNav: true });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Home" });
  },
  data() {
    return {
      // The demo user of this prototype. Later the name comes from the user's account
      userFirstName: "Ravi",
      // The same addresses as the Kluis and Plannen items in BottomNav
      vaultRoute: "/vault",
      plansRoute: "/plans-overview",
    };
  },
  computed: {
    // True when the vault page exists. Nuxt makes a route for every file in app/pages, and $router.resolve()
    // looks the address up in that list (the same check BottomNav uses). The vault page is not built yet,
    // so for now the "Mijn kluis" card can't be tapped instead of opening a 404 page.
    // As soon as a teammate adds app/pages/vault.vue, the card works by itself.
    isVaultAvailable(): boolean {
      return this.$router.resolve(this.vaultRoute).matched.length > 0;
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col pt-4 pb-7">
    <!-- flex-1 (on the div above): the page fills the height of the screen (between the top bar and the navigation bar),
         so the two empty spaces below can grow and shrink with the screen height.
         pt-4: the same 16px above the title as on every other page, so the title does not move when the user switches pages -->
    <HomeGreeting :name="userFirstName" />

    <!-- Flexible empty space between the greeting and the cards. It is at least 16px (basis-4) and grows
         to 120px (max-h-30), the space in the Figma design (an 874px high screen). On shorter phones it shrinks,
         so the home screen fits without scrolling. grow-10 and grow-7 (below) share the extra space
         in the same ratio as in Figma (120px : 84px) -->
    <div class="max-h-30 shrink-0 grow-10 basis-4" aria-hidden="true" />

    <div class="flex flex-col gap-6">
      <!-- inert: while the vault page does not exist, the card looks the same but can't be tapped or focused.
           The BannerArrow component itself is not changed for this -->
      <div :inert="!isVaultAvailable">
        <BannerArrow :to="vaultRoute" icon="unlock" title="Mijn kluis" description="Al uw documenten op één plek." />
      </div>
      <!-- inert also hides the card from screen readers, so they hear this sentence instead -->
      <p v-if="!isVaultAvailable" class="sr-only">Mijn kluis is binnenkort beschikbaar.</p>

      <BannerArrow :to="plansRoute" icon="file-lines" title="Mijn plannen" description="Werk aan uw volgende stap." />
    </div>

    <!-- Flexible empty space above Snel verder: at least 16px, at most 84px (max-h-21) as in Figma -->
    <div class="max-h-21 shrink-0 grow-7 basis-4" aria-hidden="true" />

    <HomeQuickContinue />
  </div>
</template>
