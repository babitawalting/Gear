<!-- app/pages/vault/index.vue
     The vault ("Mijn kluis"): all important documents of the user, with a search field and filters.
     index.vue in the folder "vault" is the page at /vault (Nuxt file-based routing).
     The + opens a sheet to choose the category, then the "Nieuw document" page opens.
     Tapping a document opens its own page (/vault/cv), where the user can look at it and change it. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This page shows the navigation bar at the bottom (BottomNav in the default layout)
definePageMeta({ bottomNav: true });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Mijn kluis" });
  },
  data() {
    return {
      search: "",
      // The chosen filter: "sort" or a category (for example "work"). Empty means no filter
      filter: "",
      // "Sorteren" first, then the categories of the vault (from app/utils/vaultDocuments.ts)
      filters: [
        { value: "sort", label: "Sorteren", icon: "filter" },
        ...vaultCategories,
      ],
      // All documents. Loaded in mounted(), because the documents the user added are saved in the browser
      documents: [] as VaultDocument[],
      // True while the category sheet ("Toevoegen") is shown
      isCategorySheetOpen: false,
    };
  },
  computed: {
    // The documents that match the search and the chosen category.
    // Normally the newest document is at the top. With "Sorteren" chosen they are sorted from A to Z
    filteredDocuments(): VaultDocument[] {
      const searchText = this.search.trim().toLowerCase();
      const isCategory = this.filter !== "" && this.filter !== "sort";
      const documents = this.documents
        .filter((document) => !isCategory || document.category === this.filter)
        .filter((document) => document.title.toLowerCase().includes(searchText));
      if (this.filter === "sort") {
        // localeCompare compares two texts the Dutch way, so the list is in alphabetical order
        return documents.sort((a, b) => a.title.localeCompare(b.title, "nl"));
      }
      // "2026-09-17" texts can be compared like words: a later date comes later in the alphabet
      return documents.sort((a, b) => b.date.localeCompare(a.date));
    },
  },
  // mounted() runs once, when the page is on the screen. The browser storage does not exist on the server,
  // so the documents can only be loaded here
  mounted() {
    this.documents = loadVaultDocuments();
  },
  methods: {
    // Called when the user chose a category in the sheet: the "Nieuw document" page opens with that category.
    // ?category=work in the address tells that page which category the document gets
    handleChooseCategory(category: string) {
      this.isCategorySheetOpen = false;
      // navigateTo is a Nuxt function (auto-imported) that goes to another page
      navigateTo({ path: "/vault/new-document", query: { category } });
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 py-4">
    <PageHeader title="Mijn kluis" subtitle="Beheer al uw belangrijke documenten" />
    <SearchBar v-model="search" placeholder="Zoek in mijn kluis..." />
    <FilterBar v-model="filter" :filters="filters" />

    <ul v-if="filteredDocuments.length > 0" class="flex flex-col gap-4">
      <li v-for="document in filteredDocuments" :key="document.id">
        <VaultDocumentCard
          :title="document.title"
          :category="document.category"
          :date="document.date"
          :to="`/vault/${document.id}`"
        />
      </li>
    </ul>
    <!-- role="status" makes screen readers announce this when the list becomes empty -->
    <p v-else role="status" class="text-sm font-normal text-grey">Geen documenten gevonden</p>

    <!-- Sticks to the bottom right of the column, 24px above the navigation bar (--bottom-nav-space is set in the layout) -->
    <div class="sticky bottom-[calc(var(--bottom-nav-space)+24px)] mt-auto flex justify-end">
      <AddButton label="Nieuw document" @click="isCategorySheetOpen = true" />
    </div>

    <VaultCategorySheet
      :open="isCategorySheetOpen"
      @close="isCategorySheetOpen = false"
      @choose="handleChooseCategory"
    />
  </div>
</template>
