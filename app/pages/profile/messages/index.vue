<!-- app/pages/profile/messages/index.vue
     The file name is the route: this page is at /profile/messages (Nuxt file-based routing).
     The messages overview from the Figma design "Profiel berichtenoverzicht V3".
     The messages are static example data from app/utils/profileMessages.ts. Searching and sorting don't work yet. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// bottomNav: show the navigation bar.
// There is no backTo on purpose: the back button goes back in the browser history (see TopBar), so the flow
// profile → messages → message goes back the same way. With backTo every back press would add a new history step,
// and back on the profile would then return to this page instead of the home screen.
definePageMeta({ bottomNav: true });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Berichten" });
  },
  data() {
    return {
      // What the user typed in the search field. It does not filter the list yet
      search: "",
      // The chosen sort option in the FilterBar. It does not change the order yet
      sort: "",
      // The funnel icon, as in the Figma design and the same as "Sorteren" in the vault
      sortOptions: [{ value: "sort", label: "Sorteren", icon: "filter" }],
      // profileMessages is auto-imported from app/utils/profileMessages.ts
      messages: profileMessages,
    };
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 py-4">
    <PageHeader title="Berichten" subtitle="Bekijk berichten en updates" />

    <div class="flex flex-col gap-2.5">
      <SearchBar v-model="search" placeholder="Zoek in mijn berichten" />
      <FilterBar v-model="sort" :filters="sortOptions" />
    </div>

    <ul class="-mt-2 flex flex-col gap-3">
      <li v-for="message in messages" :key="message.id">
        <ProfileMessageCard
          :to="`/profile/messages/${message.id}`"
          :sender-name="message.senderName"
          :sender-initials="message.senderInitials"
          :subject="message.subject"
          :is-unread="message.isUnread"
        />
      </li>
    </ul>
  </div>
</template>
