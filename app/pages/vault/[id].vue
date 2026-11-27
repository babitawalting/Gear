<!-- app/pages/vault/[id].vue
     The page of one document in the vault, opened by tapping it in "Mijn kluis". The user looks at the document and can change it:
     the title (with the three dots, like the title of a plan), the notes and the file. Changes are saved right away.
     The file name [id] makes it a page with a variable part: /vault/cv opens this page with id "cv" (Nuxt file-based routing).
     /vault/new-document is its own file, so Nuxt opens that page for "new-document" and this page for every other id.
     The layout is the same as the "Nieuw document" page: title on top, the notes under it and the file at the bottom. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// bottomNav: the navigation bar at the bottom is shown. backTo: the back button in the top bar goes to the vault
definePageMeta({ bottomNav: true, backTo: "/vault" });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Document" });
  },
  data() {
    return {
      // The document of this page. null until it is loaded in mounted(), and when there is no document with this id
      document: null as VaultDocument | null,
      // True once mounted() has looked for the document, so "niet gevonden" is not shown while loading
      isLoaded: false,
      // The notes and the file name, so they can be used with v-model. They are saved when they change (see watch)
      notes: "",
      fileName: "",
      // True while the sheet "Document verwijderen?" is shown
      isDeleteSheetOpen: false,
    };
  },
  computed: {
    // The id of this document, from the address: /vault/cv gives "cv"
    documentId(): string {
      return String(this.$route.params.id);
    },
    // The line under the title: the category and the date the document was added, for example "Carrière · 17 september 2026"
    subtitle(): string {
      if (!this.document) return "";
      return `${vaultCategoryLabel(this.document.category)} · ${formatVaultDate(this.document.date)}`;
    },
  },
  watch: {
    // Runs every time the notes change: they are saved right away (updateVaultDocument is in app/utils/vaultDocuments.ts)
    notes(newNotes: string) {
      if (this.document) updateVaultDocument(this.documentId, { notes: newNotes });
    },
    // Runs when the user chose another file
    fileName(newFileName: string) {
      if (this.document) updateVaultDocument(this.documentId, { fileName: newFileName });
    },
  },
  // mounted() runs once, when the page is on the screen. The vault is saved in the browser, and the browser storage
  // does not exist on the server, so the document can only be loaded here
  mounted() {
    const document = findVaultDocument(this.documentId) ?? null;
    if (document) {
      this.notes = document.notes ?? "";
      this.fileName = document.fileName ?? "";
    }
    // The document is set after the notes and file name, so the watchers above don't save the same values again
    this.$nextTick(() => {
      this.document = document;
      this.isLoaded = true;
    });
  },
  methods: {
    // Called by EditableTitle when the user saved a new title. The plans that use this document show the new title too
    saveTitle(newTitle: string) {
      if (!this.document) return;
      updateVaultDocument(this.documentId, { title: newTitle });
      this.document = { ...this.document, title: newTitle };
    },
    // The user confirmed "Verwijderen": the document is taken out of the vault and the user goes back to the vault
    deleteDocument() {
      deleteVaultDocument(this.documentId);
      this.isDeleteSheetOpen = false;
      navigateTo("/vault");
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 pt-4 pb-7">
    <template v-if="document">
      <!-- The title with the three dots: tapping the dots lets the user change the title (shared component) -->
      <EditableTitle :title="document.title" :subtitle="subtitle" field-label="Naam van het document" @save="saveTitle" />

      <NotesField v-model="notes" />

      <!-- The file of the document. Tapping it chooses another file -->
      <VaultUploadField v-model="fileName" />

      <!-- Sticks to the bottom right of the column, 24px above the navigation bar (--bottom-nav-space is set in the layout),
           in the same place as "Toevoegen" on the "Nieuw document" page. Secondary state: it is not the main action -->
      <div class="sticky bottom-[calc(var(--bottom-nav-space)+24px)] mt-auto flex justify-end">
        <button
          type="button"
          aria-haspopup="dialog"
          class="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-blue focus-visible:outline-2 focus-visible:outline-blue"
          @click="isDeleteSheetOpen = true"
        >
          <IconDisplay name="xmark" class="size-5" />
          Verwijderen
        </button>
      </div>

      <VaultDeleteSheet
        :open="isDeleteSheetOpen"
        :title="document.title"
        @close="isDeleteSheetOpen = false"
        @delete="deleteDocument"
      />
    </template>

    <!-- There is no document with this id (for example it was deleted) -->
    <template v-else-if="isLoaded">
      <PageHeader title="Niet gevonden" subtitle="Dit document staat niet (meer) in uw kluis" />
      <NuxtLink
        to="/vault"
        class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue px-4 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        Naar mijn kluis
      </NuxtLink>
    </template>
  </div>
</template>
