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
      // The chosen category (for example "career"). Empty means all categories
      filter: "",
      // The categories of the vault (from app/utils/vaultDocuments.ts)
      filters: vaultCategories,
      // The chosen order in the "Sorteren" menu. Normally the newest document is at the top
      sort: "newest",
      // The choices of the "Sorteren" menu (from app/utils/sortOptions.ts): on date and alphabetical
      sortOptions,
      // All documents. Loaded in mounted(), because the documents the user added are saved in the browser
      documents: [] as VaultDocument[],
      // True while the category sheet ("Toevoegen") is shown
      isCategorySheetOpen: false,
    };
  },
  computed: {
    // The documents that match the search and the chosen category, in the order chosen in "Sorteren"
    filteredDocuments(): VaultDocument[] {
      const searchText = this.search.trim().toLowerCase();
      const documents = this.documents
        .filter((document) => this.filter === "" || document.category === this.filter)
        .filter((document) => document.title.toLowerCase().includes(searchText));
      // sortItems (app/utils/sortOptions.ts) needs to know where the title and the date of a document are
      return sortItems(documents, this.sort, (document) => document.title, (document) => document.date);
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
    <FilterBar v-model="filter" v-model:sort="sort" :filters="filters" :sort-options="sortOptions" />

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
