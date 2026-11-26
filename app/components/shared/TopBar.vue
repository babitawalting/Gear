<!-- app/components/shared/TopBar.vue
     The bar at the top of every page: a back button on the left, the Gear logo in the middle and the account button on the right.
     It is shown once in app/layouts/default.vue, so pages never add it themselves.
     A page can hide the account button with definePageMeta({ accountButton: false }).
     Usage (only in the layout): <TopBar /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The initials of the logged-in user. Sample value for now, later this comes from the user's account
    userInitials: { type: String, default: "RS" },
  },
  computed: {
    // Every page shows the account button, unless it sets definePageMeta({ accountButton: false }).
    // The profile page does this: the button opens the profile, so it is not needed on the profile itself (Figma "Profiel V3")
    showAccountButton(): boolean {
      return this.$route.meta.accountButton !== false;
    },
  },
  methods: {
    // Goes back to the page the user came from. When there is no such page (the user opened this address directly),
    // it goes to the home page instead, so the button never does nothing.
    // A page can choose a fixed page to go back to with definePageMeta({ backTo: "/plans-overview" }).
    // The plan pages do this: right after a plan is created, back should go to the overview, not to the creation screens.
    // window.history.state.back is filled in by Vue Router with the previous address of this website
    goBack() {
      const backTo = this.$route.meta.backTo;
      if (typeof backTo === "string") {
        navigateTo(backTo);
      } else if (window.history.state?.back) {
        this.$router.back();
      } else {
        navigateTo("/home");
      }
    },
  },
});
</script>

<template>
  <!-- The three parts are spread over the width: justify-between puts the logo exactly between the two round buttons,
       because both buttons have the same width -->
  <div class="flex items-center justify-between py-3">
    <!-- The circle looks 32px (size-8), but before:-inset-1.5 makes the tappable area 44px (the skill's minimum) -->
    <button
      type="button"
      aria-label="Terug"
      class="relative flex size-8 items-center justify-center rounded-full border border-sand bg-white text-blue before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      @click="goBack"
    >
      <!-- There is no arrow-left icon, so the arrow-right icon is turned around (rotate-180) -->
      <IconDisplay name="arrow-right" class="size-5 rotate-180" />
    </button>

    <!-- NuxtLink is Nuxt's link to another page of the app. The logo opens the home page.
         The logo itself is read as "Gear", aria-label tells screen readers where the link goes -->
    <NuxtLink
      to="/home"
      aria-label="Gear, naar de startpagina"
      class="flex min-h-11 items-center rounded-xl focus-visible:outline-2 focus-visible:outline-blue"
    >
      <GearLogo />
    </NuxtLink>

    <!-- The account button: a blue circle with the initials of the user. It opens the profile page -->
    <NuxtLink
      v-if="showAccountButton"
      to="/profile"
      aria-label="Mijn profiel"
      class="relative flex size-8 items-center justify-center rounded-full bg-blue text-xs font-semibold text-white before:absolute before:-inset-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
    >
      <span aria-hidden="true">{{ userInitials }}</span>
    </NuxtLink>
    <!-- Without the account button an empty space of the same size keeps the logo exactly in the middle -->
    <span v-else class="size-8" aria-hidden="true" />
  </div>
</template>
