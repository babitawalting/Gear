<!-- app/components/shared/BannerArrow.vue
     A banner that links to another page: a blue square with an icon, a title, a short description and an arrow.
     Tapping anywhere on the banner opens the page.
     Usage: <BannerArrow to="/vault" icon="folder" title="Mijn kluis" description="Al uw documenten op één plek." /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The page the banner opens, for example "/vault"
    to: { type: String, required: true },
    // Name of the icon in the blue square, see app/utils/icons.ts
    icon: { type: String, required: true },
    // The title of the banner, in Dutch
    title: { type: String, required: true },
    // The line under the title, in Dutch
    description: { type: String, required: true },
  },
});
</script>

<template>
  <!-- NuxtLink is Nuxt's version of <a>: it opens the page without reloading the whole site.
       The whole banner is one link, so it works with the keyboard and the touch target is big -->
  <NuxtLink
    :to="to"
    class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2.5 pr-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
  >
    <!-- Blue square with a white icon -->
    <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue text-white">
      <IconDisplay :name="icon" class="size-6" />
    </span>

    <span class="flex min-w-0 flex-1 flex-col">
      <span class="text-sm leading-5 font-semibold text-navy">{{ title }}</span>
      <span class="text-xs leading-4 font-normal text-grey">{{ description }}</span>
    </span>

    <!-- The arrow shows that the banner opens another page -->
    <IconDisplay name="arrow-right" class="size-6 shrink-0 text-blue" />
  </NuxtLink>
</template>
