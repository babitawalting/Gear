<!-- app/components/vault/VaultDocumentCard.vue
     One document in the vault ("Mijn kluis"): the category icon, the name and the date it was added.
     The whole card is a link to the page of the document, where the user can look at it and change it.
     Usage: <VaultDocumentCard title="CV" category="career" date="2026-09-17" to="/vault/cv" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The name of the document, in Dutch
    title: { type: String, required: true },
    // The category of the document, it decides the icon (see app/utils/vaultDocuments.ts)
    category: { type: String, required: true },
    // The date the document was added, written as "2026-09-17"
    date: { type: String, required: true },
    // The address of the page of this document, for example "/vault/cv"
    to: { type: String, required: true },
  },
  computed: {
    // vaultCategoryIcon, vaultCategoryLabel and formatVaultDate come from app/utils/vaultDocuments.ts (auto-imported by Nuxt)
    icon(): string {
      return vaultCategoryIcon(this.category);
    },
    categoryLabel(): string {
      return vaultCategoryLabel(this.category);
    },
    formattedDate(): string {
      return formatVaultDate(this.date);
    },
  },
});
</script>

<template>
  <!-- `relative` is needed for the link below: its ::after covers the card, so it must know where the card is -->
  <article class="relative flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2">
    <!-- The category icon. The icon is decorative, so the category name is there for screen readers -->
    <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue">
      <IconDisplay :name="icon" class="size-5 text-white" />
      <span class="sr-only">Categorie {{ categoryLabel }}</span>
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <h2 class="truncate text-sm leading-5 font-semibold text-navy">
        <!-- NuxtLink is Nuxt's link to another page of the app. Its ::after stretches over the whole card,
             so tapping anywhere on the card (the three dots too) opens the document -->
        <NuxtLink
          :to="to"
          class="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
        >{{ title }}</NuxtLink>
      </h2>
      <!-- <time> tells the browser and screen readers that this is a date -->
      <p class="flex items-center gap-1 text-xs leading-4 font-normal text-grey">
        <IconDisplay name="calendar" class="size-3.5 text-navy" />
        <span class="sr-only">Toegevoegd op</span>
        <time :datetime="date">{{ formattedDate }}</time>
      </p>
    </div>

    <!-- The three dots of the design. They are part of the link (tapping them opens the document too),
         so they are only for the eyes: aria-hidden hides them from screen readers -->
    <div aria-hidden="true" class="flex size-11 shrink-0 items-center justify-center -my-1 -mr-2 text-grey">
      <IconDisplay name="ellipsis" class="size-5 rotate-90" />
    </div>
  </article>
</template>
