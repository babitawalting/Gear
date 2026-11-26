<!-- app/components/shared/EditableTitle.vue
     The top of a page whose title the user may change, like a plan:
     the title and subtext (PageHeader) with the menu button (three dots) next to it.
     Tapping the three dots puts the title in a compact text field (TitleField, shared), so the user can change it.
     On the right side of the field are a check (save) and a cross (cancel). Enter also saves, Escape also cancels.
     The component does not save anything itself: it sends the new title to the page (event `save`), and the page saves it.
     Usage: <EditableTitle :title="planTitle" subtitle="Sollicitatie" @save="saveTitle" />
            <EditableTitle :title="document.title" subtitle="Document" field-label="Naam van het document" @save="renameDocument" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The current title of the plan, in Dutch
    title: { type: String, required: true },
    // The line under the title, for example "Sollicitatie"
    subtitle: { type: String, required: true },
    // The name of the text field for screen readers, in Dutch. The field has no visible label, because it sits in the place of the title
    fieldLabel: { type: String, default: "Titel van het plan" },
  },
  // "save": the user saved a new title, the value is the new title (without spaces at the start or end)
  emits: ["save"],
  data() {
    return {
      // True while the text field is shown instead of the title
      isEditing: false,
    };
  },
  methods: {
    saveTitle(newTitle: string) {
      this.$emit("save", newTitle);
      this.isEditing = false;
    },
  },
});
</script>

<template>
  <div>
    <!-- Normal view: the title with the three dots next to it -->
    <div v-if="!isEditing" class="flex items-start justify-between gap-4">
      <PageHeader :title="title" :subtitle="subtitle" />
      <!-- The negative margins keep the 44px tappable area from pushing the header -->
      <button
        type="button"
        aria-label="Titel bewerken"
        class="-mt-1 -mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
        @click="isEditing = true"
      >
        <IconDisplay name="ellipsis" class="size-5 rotate-90" />
      </button>
    </div>

    <!-- Edit view: the text field in the place of the title -->
    <div v-else class="flex flex-col">
      <!-- The page keeps its <h1> while editing, only for screen readers (sr-only) -->
      <h1 class="sr-only">{{ title }}</h1>
      <TitleField :title="title" :field-label="fieldLabel" @save="saveTitle" @cancel="isEditing = false" />
      <!-- The subtext stays under the field, just like under the title -->
      <p class="mt-1 text-sm leading-5 font-normal text-grey">{{ subtitle }}</p>
    </div>
  </div>
</template>
