<!-- app/pages/profile/index.vue
     The file name is the route: index.vue in the folder profile/ is the page /profile (Nuxt file-based routing).
     The profile screen from the Figma design "Profiel V3". The account button (RS) in the top bar opens this page.
     The top bar, the background shapes and the navigation bar come from the default layout, so this page only holds its own content. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// bottomNav: show the navigation bar. None of its items is active here, because /profile is not one of its pages.
// accountButton: false hides the RS button in the top bar, because that button opens this page (Figma shows no button here).
// There is no backTo: the back button goes back to the page the user came from (the home screen), see TopBar.
// The two message pages don't use backTo either, so back always follows the path the user took.
definePageMeta({ bottomNav: true, accountButton: false });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Profiel" });
  },
  data() {
    return {
      // The demo user of this prototype. Later this comes from the user's account
      user: { firstName: "Ravi", fullName: "Ravi Santos", initials: "RS" },
      // The cards under the profile card. Only Berichten has a page now. The other pages are built later:
      // their cards are already shown as in Figma, but can't be tapped until the page exists (see isPageAvailable)
      menuItems: [
        { to: "/profile/messages", icon: "bell", title: "Berichten", description: "Bekijk uw berichten" },
        { to: "/profile/information", icon: "user", title: "Profielinformatie", description: "Beheer uw gegevens" },
        { to: "/profile/settings", icon: "gear", title: "Instellingen", description: "Beheer algemene app voorkeuren" },
        { to: "/profile/contact", icon: "envelope", title: "Contact", description: "Bij vragen en hulp over Gear" },
      ],
    };
  },
  computed: {
    // The page title, for example "Ravi’s profiel"
    pageTitle(): string {
      return `${this.user.firstName}’s profiel`;
    },
    // True when there are unread messages: then the bell on "Berichten" gets a red dot (static example data for now)
    hasUnreadMessages(): boolean {
      return hasUnreadProfileMessages();
    },
  },
  methods: {
    // True when the page exists. Nuxt makes a route for every file in app/pages, and $router.resolve()
    // looks the address up in that list (the same check as BottomNav and the home screen use).
    // As soon as someone adds for example app/pages/profile/settings.vue, that card works by itself.
    isPageAvailable(to: string): boolean {
      return this.$router.resolve(to).matched.length > 0;
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 py-4">
    <PageHeader :title="pageTitle" subtitle="Beheer uw gegevens en instellingen" />

    <ProfileUserCard :name="user.fullName" :initials="user.initials" />

    <ul class="flex flex-col gap-4">
      <li v-for="item in menuItems" :key="item.to">
        <!-- inert: while the page does not exist, the card looks the same but can't be tapped or focused (no 404 page).
             The BannerArrow component itself is not changed for this -->
        <div :inert="!isPageAvailable(item.to)">
          <BannerArrow
            :to="item.to"
            :icon="item.icon"
            :title="item.title"
            :description="item.description"
            :has-notification="item.to === '/profile/messages' && hasUnreadMessages"
          />
        </div>
        <!-- inert also hides the card from screen readers, so they hear this sentence instead -->
        <p v-if="!isPageAvailable(item.to)" class="sr-only">{{ item.title }} is binnenkort beschikbaar.</p>
      </li>
    </ul>
  </div>
</template>
