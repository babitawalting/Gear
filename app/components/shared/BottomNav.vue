<!-- app/components/shared/BottomNav.vue
     The navigation bar at the bottom of the screen, from the Figma design "Home V3".
     It is shown once in app/layouts/default.vue, so pages never add it themselves.
     A page turns it on with definePageMeta({ bottomNav: true }). Pages that don't do this have no navigation bar.

     Sizes from Figma (402px frame): the bar is 60px high and floats 19px above the bottom of the screen,
     with 18px space on the left and right. On narrower phones the bar gets narrower, the items share the width evenly. -->
<script lang="ts">
export default defineComponent({
  data() {
    return {
      // The four items of the bar: where it goes, the Dutch text and the icon (see app/utils/icons.ts)
      links: [
        { to: "/home", label: "Home", icon: "house" },
        { to: "/vault", label: "Kluis", icon: "unlock" },
        { to: "/plans-overview", label: "Plannen", icon: "file-lines" },
        // The overview of shared plans is built later as app/pages/shared.vue. It is a separate screen, not the plans overview.
        { to: "/shared", label: "Gedeeld", icon: "people-arrows" },
      ],
    };
  },
  methods: {
    // True when the page of this route exists. Nuxt makes a route for every file in app/pages (file-based routing),
    // and $router.resolve() looks the address up in that list. No match means the page has not been built yet.
    // Then the item is shown, but not as a link, so tapping it does not open a 404 page.
    // As soon as a teammate adds the page (for example app/pages/shared.vue), the item becomes a link by itself.
    pageExists(to: string): boolean {
      return this.$router.resolve(to).matched.length > 0;
    },
    // An item is active on its own page and on the pages below it (for example /vault/12 for Kluis).
    // $route is the current page, Nuxt (vue-router) gives it to every component.
    isActive(to: string): boolean {
      const currentPath = this.$route.path;
      return currentPath === to || currentPath.startsWith(`${to}/`);
    },
  },
});
</script>

<template>
  <!-- fixed: the bar stays at the bottom while the page scrolls.
       left-1/2 + -translate-x-1/2: centered in the same phone-width column as the layout.
       w-[calc(100%-36px)]: 18px space on each side, max-w-[366px]: the width of the bar in Figma.
       z-40: in front of the page content. The pop-ups (dialogs) and the toast (z-50) still go in front of the bar. -->
  <nav
    class="fixed bottom-[19px] left-1/2 z-40 h-15 w-[calc(100%-36px)] max-w-[366px] -translate-x-1/2 rounded-xl border-t border-sand bg-white"
    aria-label="Hoofdmenu"
  >
    <ul class="flex h-full">
      <li v-for="link in links" :key="link.to" class="flex-1">
        <!-- NuxtLink is Nuxt's link to another page of the app (no full page reload).
             aria-current="page" tells screen readers which page is open, the color shows it visually. -->
        <NuxtLink
          v-if="pageExists(link.to)"
          :to="link.to"
          :aria-current="isActive(link.to) ? 'page' : undefined"
          :class="isActive(link.to) ? 'text-blue' : 'text-grey'"
          class="flex h-full min-h-11 flex-col items-center justify-center gap-1 rounded-xl text-sm leading-4 font-normal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue"
        >
          <IconDisplay :name="link.icon" class="size-[18px]" />
          {{ link.label }}
        </NuxtLink>
        <!-- The page does not exist yet: same look as an inactive item, but not a link (nothing happens on tap).
             aria-disabled and the hidden text tell screen readers that it is not available yet. -->
        <span
          v-else
          aria-disabled="true"
          class="flex h-full min-h-11 flex-col items-center justify-center gap-1 text-sm leading-4 font-normal text-grey"
        >
          <IconDisplay :name="link.icon" class="size-[18px]" />
          {{ link.label }}
          <span class="sr-only">(binnenkort beschikbaar)</span>
        </span>
      </li>
    </ul>
  </nav>
</template>
