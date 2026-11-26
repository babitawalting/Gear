<!-- app/pages/plans/job-application/[id].vue
     The screen of one job application plan ("Sollicitatie"). The file name [id] makes it a page with a variable part:
     /plans/job-application/7 opens this page with id "7" (Nuxt file-based routing).
     The folder "job-application" is a fixed part of the address, so Nuxt picks this page before plans/[id].vue.
     How the steps work:
     - A new plan starts at 0% without evidence. The user adds documents from the vault with "Bewijs toevoegen uit kluis".
     - A step is concluded when it has its evidence and the user taps the next step. Then it gets its checkmark (33% per step).
       The last step has no next step, so it is concluded with "Plan afronden".
     - Steps that are not reached yet are grey (locked) until the step before them is concluded. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// backTo: the back button in the top bar always goes to the plan overview, also right after the plan was created
definePageMeta({ backTo: "/plans-overview" });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Sollicitatie" });
  },
  data() {
    return {
      // The documents the vacancy asks for (auto-imported from app/utils/jobApplicationProgress.ts)
      requirements: jobApplicationRequirements,
      // The number of the step that is open (1 to 3). 0 means none. Only one step is open at a time
      openStep: 1,
      // The state of the plan. It is saved in the browser per plan and loaded again in mounted()
      // The title of the plan. Empty means the default title (see planTitle)
      title: "",
      completedSteps: 0,
      evidenceByStep: { 1: [], 2: [], 3: [] } as Record<string, string[]>,
      addedRequirementIds: [] as string[],
      notes: "",
      isShared: false,
      archivedAt: "",
      // The step the vault drawer adds documents to. 0 means the drawer is closed
      vaultStep: 0,
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
        completedSteps: this.completedSteps,
        evidenceByStep: this.evidenceByStep,
        addedRequirementIds: this.addedRequirementIds,
        notes: this.notes,
        isShared: this.isShared,
        archivedAt: this.archivedAt,
      };
    },
    // Which of the three steps are concluded, in order
    done(): boolean[] {
      return jobApplicationDoneSteps(this.savedProgress);
    },
    // The index (0 to 2) of the step the user works on now. 3 means all steps are concluded
    nextIndex(): number {
      return this.completedSteps;
    },
    // Every concluded step is a third of the plan. Rounded, so the bar shows 33% and not 33.333...%
    progress(): number {
      return Math.round(percentageDone(this.done));
    },
    // A step is locked (grey) until the step before it is concluded
    step2Locked(): boolean {
      return this.completedSteps < 1;
    },
    step3Locked(): boolean {
      return this.completedSteps < 2;
    },
    // The number of required documents the plan does not have yet
    missingCount(): number {
      return this.requirements.filter((requirement) => !this.hasDocument(requirement.id)).length;
    },
    // Step 2 lists the requirements itself, so its evidence list only shows the other documents (no double rows)
    step2ExtraEvidence(): { id: string; title: string }[] {
      return this.evidenceFor(2).filter((item) => !this.requirements.some((requirement) => requirement.id === item.id));
    },
    // When a step is concluded and closed, the description shows the result. Otherwise the normal text
    step1Description(): string {
      if (this.done[0] && this.openStep !== 1) {
        return this.evidenceFor(1).map((item) => item.title).join(", ");
      }
      return "Documenten uit uw kluis";
    },
    step2Description(): string {
      return this.done[1] && this.openStep !== 2 ? "Vereisten compleet" : "Zie wat ontbreekt";
    },
    step3Description(): string {
      return this.done[2] && this.openStep !== 3 ? "Aanvullen afgerond" : "Optionele documenten toevoegen";
    },
    // The documents that are already in the step of the open drawer: the drawer leaves them out
    vaultHiddenIds(): string[] {
      return this.vaultStep === 0 ? [] : (this.evidenceByStep[this.vaultStep] ?? []);
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
    // Open the step the user works on now (all concluded: no step open)
    this.openStep = this.completedSteps < jobApplicationStepCount ? this.completedSteps + 1 : 0;
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
    // Tapping a header opens that step and closes the other one. Tapping the open step closes it.
    // Tapping the step right after the current one also concludes the current step, when it has its evidence:
    // the checkmark appears and the progress goes up. Without evidence the next step opens, but stays grey
    toggle(step: number) {
      const previousStep = step - 1;
      if (previousStep === this.completedSteps + 1 && this.canConclude(previousStep)) {
        this.completedSteps = previousStep;
      }
      this.openStep = this.openStep === step ? 0 : step;
    },
    // The evidence of one step as { id, title }, with the names from the vault (findVaultDocument is in app/utils/vaultDocuments.ts)
    evidenceFor(step: number): { id: string; title: string }[] {
      const ids = this.evidenceByStep[step] ?? [];
      return ids.map((id) => ({ id, title: findVaultDocument(id)?.title ?? id }));
    },
    // True when the plan has this required document (added from the vault in some step, or with "+ Toevoegen")
    hasDocument(requirementId: string): boolean {
      return hasRequirement(this.savedProgress, requirementId);
    },
    // True when the step has what it needs to be concluded:
    // step 1 needs at least one document, step 2 needs every requirement, step 3 is optional
    canConclude(step: number): boolean {
      if (step === 1) return this.evidenceFor(1).length > 0;
      if (step === 2) return this.missingCount === 0;
      return true;
    },
    // "Plan afronden" in the last step: there is no next step to tap, so this button concludes it (all steps close)
    finishPlan() {
      this.completedSteps = jobApplicationStepCount;
      this.openStep = 0;
    },
    // "Bewijs toevoegen uit kluis" of a step (built into StepCard): opens the vault drawer for that step
    openVault(step: number) {
      this.vaultStep = step;
    },
    // Called by the vault drawer with the ids of the chosen documents: they are added to the step of the drawer
    addEvidence(ids: string[]) {
      const current = this.evidenceByStep[this.vaultStep] ?? [];
      this.evidenceByStep[this.vaultStep] = [...current, ...ids];
      this.vaultStep = 0;
    },
    // Called by the pencil ("Verwijderen") of a piece of evidence: takes the document out of that step
    removeEvidence(step: number, id: string) {
      this.evidenceByStep[step] = (this.evidenceByStep[step] ?? []).filter((evidenceId) => evidenceId !== id);
    },
    // For now "+ Toevoegen" only marks the requirement as added. Later it opens the upload screen of the vault
    addRequirement(id: string) {
      this.addedRequirementIds.push(id);
    },
    // Called by the pencil ("Verwijderen") of a requirement: the document is taken out of the whole plan,
    // so the requirement shows as missing again
    removeRequirement(id: string) {
      this.addedRequirementIds = this.addedRequirementIds.filter((addedId) => addedId !== id);
      for (const step of Object.keys(this.evidenceByStep)) {
        this.removeEvidence(Number(step), id);
      }
    },
    // The line above step n (1 to 3) is blue when step n-1 is concluded. The first step has no line above
    lineAbove(step: number): string {
      if (step === 1) return "none";
      return this.done[step - 2] ? "blue" : "grey";
    },
    // The line below step n is blue when step n is concluded. The last step has no line below
    lineBelow(step: number): string {
      if (step === jobApplicationStepCount) return "none";
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
    // Saves today's date as the archive date ("2026-11-26") and goes to the "Archief" tab of the overview,
    // where the plan is now. ?view=archive in the address tells the overview to open that tab
    archivePlan() {
      this.archivedAt = new Date().toISOString().slice(0, 10);
      // Saved right away: the watcher would only save after the page is gone
      saveJobApplicationProgress(this.planId, this.savedProgress);
      navigateTo("/plans-overview?view=archive");
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
          <StepCard
            :number="1"
            title="Wat heb ik al?"
            :description="step1Description"
            :is-open="openStep === 1"
            :evidence="evidenceFor(1)"
            @toggle="toggle(1)"
            @add-evidence="openVault(1)"
            @remove-evidence="removeEvidence(1, $event)"
          >
            <p v-if="evidenceFor(1).length === 0" class="mb-1 text-xs leading-4 font-normal text-grey">
              Voeg de documenten uit uw kluis toe die u al heeft voor deze sollicitatie.
            </p>
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[1]" :is-next="nextIndex === 1" :is-open="openStep === 2" :line-above="lineAbove(2)" :line-below="lineBelow(2)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard
            :number="2"
            title="Vacaturevereisten"
            :description="step2Description"
            :is-locked="step2Locked"
            :is-open="openStep === 2"
            :evidence="step2ExtraEvidence"
            @toggle="toggle(2)"
            @add-evidence="openVault(2)"
            @remove-evidence="removeEvidence(2, $event)"
          >
            <p v-if="missingCount > 0" class="mb-1 text-xs leading-4 font-normal text-grey">
              De vacature vraagt om {{ missingCount === 1 ? "een document" : `${missingCount} documenten` }} die nog niet in dit plan
              {{ missingCount === 1 ? "staat" : "staan" }}.
            </p>
            <!-- A locked step can be read, but nothing can be added or removed yet -->
            <DocumentRow
              v-for="requirement in requirements"
              :key="requirement.id"
              :title="requirement.title"
              :has-line="requirements.length > 1"
              :is-missing="!hasDocument(requirement.id) && !step2Locked"
              :can-edit="!step2Locked && hasDocument(requirement.id)"
              @add="addRequirement(requirement.id)"
              @remove="removeRequirement(requirement.id)"
            />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[2]" :is-next="nextIndex === 2" :is-open="openStep === 3" :line-above="lineAbove(3)" :line-below="lineBelow(3)" />
        <div class="min-w-0 flex-1">
          <StepCard
            :number="3"
            title="Aanvullen"
            :description="step3Description"
            :is-locked="step3Locked"
            :is-open="openStep === 3"
            :evidence="evidenceFor(3)"
            @toggle="toggle(3)"
            @add-evidence="openVault(3)"
            @remove-evidence="removeEvidence(3, $event)"
          >
            <p class="mb-1 text-xs leading-4 font-normal text-grey">
              Niet verplicht: voeg documenten toe die uw sollicitatie sterker maken.
            </p>
            <template v-if="nextIndex === 2" #actions>
              <div class="mt-3">
                <PrimaryButton label="Plan afronden" @click="finishPlan" />
              </div>
            </template>
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

    <!-- The vault drawer: open while vaultStep is a step number (1 to 3) -->
    <VaultPickerSheet
      :open="vaultStep !== 0"
      :hidden-ids="vaultHiddenIds"
      @close="vaultStep = 0"
      @add="addEvidence"
    />
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
