<!-- app/pages/plans/job-application/[id].vue
     The screen of one job application plan ("Sollicitatie"). The file name [id] makes it a page with a variable part:
     /plans/job-application/7 opens this page with id "7" (Nuxt file-based routing).
     The folder "job-application" is a fixed part of the address, so Nuxt picks this page before plans/[id].vue.
     For now the documents are sample data from app/utils/jobApplicationProgress.ts, the same for every id. -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Sollicitatie" });
  },
  data() {
    return {
      // The sample lists (auto-imported from app/utils/jobApplicationProgress.ts)
      vaultDocuments: jobApplicationVaultDocuments,
      requirements: jobApplicationRequirements,
      optionalDocuments: jobApplicationOptionalDocuments,
      // The number of the step that is open (1 to 3). 0 means none. Only one step is open at a time
      openStep: 1,
      // The state of the plan. It is saved in the browser per plan and loaded again in mounted()
      // The title of the plan. Empty means the default title (see planTitle)
      title: "",
      addedRequirementIds: [] as string[],
      addedOptionalIds: [] as string[],
      isSupplementDone: false,
      notes: "",
      isShared: false,
      archivedAt: "",
      // True while the share sheet is shown, and while the "Plan gedeeld" message is shown
      isShareSheetOpen: false,
      isToastOpen: false,
      // Sample data for now: the people the user recently shared a plan with
      contacts: [
        { id: "1", name: "Anna Jansen", organisation: "Fontys" },
        { id: "2", name: "Tim van den Berg", organisation: "Fontys" },
        { id: "3", name: "Elsa Paulissen", organisation: "Fontys" },
      ],
      // True when the page is scrolled all the way down: then the shade at the bottom goes away
      isScrolledToBottom: false,
    };
  },
  computed: {
    // The id of this plan, from the address: /plans/job-application/7 gives "7"
    planId(): string {
      return String(this.$route.params.id);
    },
    // The title shown at the top, in the progress bar label and in the "Plan gedeeld" message
    planTitle(): string {
      return jobApplicationTitle(this.savedProgress);
    },
    // Everything that has to be saved, in one object. When one of these values changes, the watcher below saves it
    savedProgress(): JobApplicationProgress {
      return {
        title: this.title,
        addedRequirementIds: this.addedRequirementIds,
        addedOptionalIds: this.addedOptionalIds,
        isSupplementDone: this.isSupplementDone,
        notes: this.notes,
        isShared: this.isShared,
        archivedAt: this.archivedAt,
      };
    },
    // Which of the three steps are done, in order. A step only counts when the steps before it are done too
    done(): boolean[] {
      return jobApplicationDoneSteps(this.savedProgress);
    },
    // The index (0 to 2) of the first step that is not done: this one has to be finished next. 3 means all done
    nextIndex(): number {
      const index = this.done.findIndex((isDone) => !isDone);
      return index === -1 ? 3 : index;
    },
    // Every step that is done is a third of the plan. Rounded, so the bar shows 33% and not 33.333...%
    progress(): number {
      return Math.round(percentageDone(this.done));
    },
    // A step is locked while the step before it is not done
    step2Locked(): boolean {
      return !this.done[0];
    },
    step3Locked(): boolean {
      return !this.done[1];
    },
    // The number of required documents the user does not have yet
    missingCount(): number {
      return this.requirements.filter((requirement) => !this.hasDocument(requirement)).length;
    },
    // When a step is done and closed, the description shows the result. Otherwise the normal text
    step1Description(): string {
      if (this.done[0] && this.openStep !== 1) {
        return this.vaultDocuments.map((document) => document.title).join(", ");
      }
      return "Documenten uit uw kluis";
    },
    step2Description(): string {
      return this.done[1] && this.openStep !== 2 ? "Vereisten compleet" : "Zie wat ontbreekt";
    },
    step3Description(): string {
      return this.done[2] && this.openStep !== 3 ? "Aanvullen afgerond" : "Optionele documenten toevoegen";
    },
  },
  watch: {
    // Runs every time something in savedProgress changes (deep: also changes inside the object). It saves the progress
    savedProgress: {
      handler(progress: JobApplicationProgress) {
        saveJobApplicationProgress(this.planId, progress);
      },
      deep: true,
    },
  },
  // mounted() runs once, when the page is on the screen. First we load the saved progress of this plan (the browser storage
  // does not exist on the server, so this can only happen here). Then we start listening to scrolling and resizing
  mounted() {
    Object.assign(this, loadJobApplicationProgress(this.planId));
    // The plan details screen sends the title of a new plan in the address ("?title=Software developer").
    // It is saved as the title, and then removed from the address (router.replace changes the address without
    // opening a new page), so a reload or a link to this page never undoes a title the user changed later
    const titleFromAddress = this.$route.query.title;
    if (typeof titleFromAddress === "string" && titleFromAddress.trim() !== "") {
      this.title = titleFromAddress.trim();
      this.$router.replace({ query: {} });
    }
    window.addEventListener("scroll", this.updateShade);
    window.addEventListener("resize", this.updateShade);
    this.updateShade();
  },
  // beforeUnmount() runs when the user leaves the page. We stop listening, so nothing keeps running
  beforeUnmount() {
    window.removeEventListener("scroll", this.updateShade);
    window.removeEventListener("resize", this.updateShade);
  },
  methods: {
    // Checks if the bottom of the page is reached (1px of room for rounding)
    updateShade() {
      const bottomOfScreen = window.scrollY + window.innerHeight;
      this.isScrolledToBottom = bottomOfScreen >= document.documentElement.scrollHeight - 1;
    },
    // Tapping a header opens that step and closes the other one. Tapping the open step closes it
    toggle(step: number) {
      this.openStep = this.openStep === step ? 0 : step;
    },
    // True when the user has this required document (in the vault already, or added with "+ Toevoegen")
    hasDocument(requirement: { id: string; inVault: boolean }): boolean {
      return hasRequirement(this.savedProgress, requirement);
    },
    // For now "+ Toevoegen" only marks the document as added. Later it opens the upload screen of the vault
    addRequirement(id: string) {
      this.addedRequirementIds.push(id);
    },
    addOptional(id: string) {
      this.addedOptionalIds.push(id);
    },
    isOptionalAdded(id: string): boolean {
      return this.addedOptionalIds.includes(id);
    },
    finishSupplement() {
      this.isSupplementDone = true;
      this.openStep = 0;
    },
    // The edit buttons of the documents do nothing yet. Later they open the document in the vault
    editDocument() {},
    // The "Bewijs toevoegen uit kluis" button of a step (built into StepCard). The vault does not exist yet,
    // so this does nothing for now. Later it opens the vault to pick a document for this step
    addEvidence(step: number) {
      console.log("Bewijs toevoegen uit kluis voor stap", step);
    },
    // The line above step n (1 to 3) is blue when step n-1 is done. The first step has no line above
    lineAbove(step: number): string {
      if (step === 1) return "none";
      return this.done[step - 2] ? "blue" : "grey";
    },
    // The line below step n is blue when step n is done. The last step has no line below
    lineBelow(step: number): string {
      if (step === 3) return "none";
      return this.done[step - 1] ? "blue" : "grey";
    },
    // Called by the share sheet with the ids of the chosen people. Sharing is not saved anywhere yet,
    // so we only close the sheet, remember that the plan is shared and show the "Plan gedeeld" message
    sharePlan() {
      this.isShareSheetOpen = false;
      this.isShared = true;
      this.isToastOpen = true;
    },
    // Called by EditableTitle when the user saved a new title. The watcher on savedProgress saves it,
    // and the plan overview reads it from there, so the card shows the new title too
    saveTitle(newTitle: string) {
      this.title = newTitle;
    },
    // Saves today's date as the archive date ("2026-11-26") and goes back to the overview, where the plan is now in "Archief"
    archivePlan() {
      this.archivedAt = new Date().toISOString().slice(0, 10);
      // Saved right away: the watcher would only save after the page is gone
      saveJobApplicationProgress(this.planId, this.savedProgress);
      navigateTo("/plans-overview");
    },
  },
});
</script>

<template>
  <div class="flex flex-col gap-6 pt-4 pb-7">
    <!-- The title with the three dots: tapping the dots lets the user change the title (shared component) -->
    <EditableTitle :title="planTitle" subtitle="Sollicitatie" @save="saveTitle" />

    <ProgressBar :progress="progress" size="large" :label="`Voortgang ${planTitle}`" />

    <!-- The three steps. Each row has the marker of the vertical progress bar on the left and the step on the right -->
    <div>
      <div class="flex gap-4">
        <StepMarker :is-done="done[0]" :is-next="nextIndex === 0" :is-open="openStep === 1" :line-above="lineAbove(1)" :line-below="lineBelow(1)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard :number="1" title="Wat heb ik al?" :description="step1Description" :is-open="openStep === 1" @toggle="toggle(1)" @add-evidence="addEvidence(1)">
            <DocumentRow
              v-for="document in vaultDocuments"
              :key="document.id"
              :title="document.title"
              :has-line="vaultDocuments.length > 1"
              @edit="editDocument"
            />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[1]" :is-next="nextIndex === 1" :is-open="openStep === 2" :line-above="lineAbove(2)" :line-below="lineBelow(2)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard :number="2" title="Vacaturevereisten" :description="step2Description" :is-locked="step2Locked" :is-open="openStep === 2" @toggle="toggle(2)" @add-evidence="addEvidence(2)">
            <p v-if="missingCount > 0" class="mb-1 text-xs leading-4 font-normal text-grey">
              De vacature vraagt om {{ missingCount === 1 ? "een document" : `${missingCount} documenten` }} die nog niet in uw kluis
              {{ missingCount === 1 ? "staat" : "staan" }}.
            </p>
            <!-- A locked step can be read, but documents can't be added yet: then every row shows the edit button -->
            <DocumentRow
              v-for="requirement in requirements"
              :key="requirement.id"
              :title="requirement.title"
              :has-line="requirements.length > 1"
              :is-missing="!hasDocument(requirement) && !step2Locked"
              @add="addRequirement(requirement.id)"
              @edit="editDocument"
            />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[2]" :is-next="nextIndex === 2" :is-open="openStep === 3" :line-above="lineAbove(3)" :line-below="lineBelow(3)" />
        <div class="min-w-0 flex-1">
          <StepCard :number="3" title="Aanvullen" :description="step3Description" :is-locked="step3Locked" :is-open="openStep === 3" @toggle="toggle(3)" @add-evidence="addEvidence(3)">
            <p class="mb-1 text-xs leading-4 font-normal text-grey">
              Deze documenten zijn niet verplicht, maar maken uw sollicitatie sterker.
            </p>
            <DocumentRow
              v-for="document in optionalDocuments"
              :key="document.id"
              :title="document.title"
              :has-line="optionalDocuments.length > 1"
              :is-missing="!isOptionalAdded(document.id) && !step3Locked"
              @add="addOptional(document.id)"
              @edit="editDocument"
            />
            <!-- Small button like the ones in the driving licence steps. Grey and disabled while the step is locked -->
            <button
              v-if="!isSupplementDone"
              type="button"
              :disabled="step3Locked"
              class="mt-3 flex min-h-7.25 w-full items-center justify-center rounded-xl px-4 py-1.5 text-xs leading-4 font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :class="step3Locked ? 'bg-grey' : 'bg-blue'"
              @click="finishSupplement"
            >
              Klaar met aanvullen
            </button>
          </StepCard>
        </div>
      </div>
    </div>

    <NotesField v-model="notes" />

    <!-- A soft shade at the bottom of the screen: see-through at the top and 20% navy at the bottom.
         pointer-events-none lets clicks go through it. It fades away at the bottom of the page (opacity-0) -->
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-x-0 bottom-0 h-56 bg-linear-to-b from-transparent to-navy/20 transition-opacity duration-200"
      :class="isScrolledToBottom ? 'opacity-0' : 'opacity-100'"
    />

    <!-- "Plan archiveren" is the Secondary state (not the main action), "Plan delen" is the Primary one -->
    <div class="flex gap-4">
      <button
        type="button"
        class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-blue focus-visible:outline-2 focus-visible:outline-blue"
        @click="archivePlan"
      >
        <IconDisplay name="archive" class="size-5" />
        Plan archiveren
      </button>
      <PrimaryButton label="Plan delen" icon="share" @click="isShareSheetOpen = true" />
    </div>

    <SharePlanSheet
      :open="isShareSheetOpen"
      :contacts="contacts"
      @close="isShareSheetOpen = false"
      @share="sharePlan"
    />
    <SharePlanToast
      :open="isToastOpen"
      :plan-title="planTitle"
      :to="$route.path"
      @close="isToastOpen = false"
    />
  </div>
</template>
