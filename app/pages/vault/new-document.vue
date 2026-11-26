<!-- app/pages/vault/new-document.vue
     The "Nieuw document" page: the user gives the new document a title, notes and a file, and adds it to the vault.
     The file name is the route: this page is at /vault/new-document (Nuxt file-based routing).
     The category was chosen in the sheet on the vault page and comes in through the address: /vault/new-document?category=work -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// bottomNav: the navigation bar at the bottom is shown, as in the design.
// backTo: the back button in the top bar goes to the vault
definePageMeta({ bottomNav: true, backTo: "/vault" });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Nieuw document" });
  },
  data() {
    return {
      title: "",
      notes: "",
      // The name of the chosen file. Empty means no file chosen
      fileName: "",
    };
  },
  computed: {
    // The category from the address ($route.query is the part after the "?"). Unknown or missing: "Overig"
    category(): string {
      const category = String(this.$route.query.category ?? "");
      const isKnown = vaultCategories.some((item) => item.value === category);
      return isKnown ? category : "other";
    },
    // The title is required: "Toevoegen" stays grey until it is filled in
    canAdd(): boolean {
      return this.title.trim() !== "";
    },
  },
  methods: {
    // Saves the document in the vault (addVaultDocument is in app/utils/vaultDocuments.ts) and goes back to the vault
    addDocument() {
      if (!this.canAdd) return;
      addVaultDocument({
        // Date.now() is the number of milliseconds since 1970, so every new document gets its own id
        id: `document-${Date.now()}`,
        title: this.title.trim(),
        category: this.category,
        // Today, written as "2026-11-26"
        date: new Date().toISOString().slice(0, 10),
        notes: this.notes,
        fileName: this.fileName,
      });
      navigateTo("/vault");
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col gap-6 pt-4 pb-7">
    <PageHeader title="Nieuw document" subtitle="Upload een nieuw document naar uw kluis" />

    <div class="flex flex-col gap-5">
      <FormField v-model="title" label="Titel" placeholder="Voeg hier een titel toe" required />
      <NotesField v-model="notes" placeholder="" />
    </div>

    <VaultUploadField v-model="fileName" />

    <!-- Sticks to the bottom right of the column, 24px above the navigation bar (--bottom-nav-space is set in the layout).
         mt-auto pushes it down when the page is short. w-fit: the button is only as wide as its text, as in the design -->
    <div class="sticky bottom-[calc(var(--bottom-nav-space)+24px)] mt-auto flex justify-end">
      <!-- floating: the button gets the same soft shadow as the round add button, because it also floats above the page -->
      <div class="w-fit">
        <PrimaryButton label="Toevoegen" icon="floppy-disk" floating :disabled="!canAdd" @click="addDocument" />
      </div>
    </div>
  </div>
</template>
