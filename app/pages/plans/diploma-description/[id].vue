<!-- app/pages/plans/diploma-description/[id].vue
     The screen of one diploma description plan ("Diplomabeschrijving aanvragen"). The file name [id] makes it a page with a variable part:
     /plans/diploma-description/5 opens this page with id "5" (Nuxt file-based routing).
     It works like the job application page (plans/job-application/[id].vue), but with four steps:
     - A new plan starts at 0%. The user works through the steps one after the other.
     - Step 1 is concluded with its own button ("Gecontroleerd, dit is nodig"), so the user has to confirm the check.
       The other steps are concluded when the user taps the next step. Then the step gets its checkmark (25% per step).
       Step 2 can only be concluded when all the documents are there.
     - An MBO diploma is not described by Nuffic but by SBB, so the texts of steps 2, 3 and 4 are different for it.
     - Steps that are not reached yet are grey (locked) until the step before them is concluded. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// backTo: the back button in the top bar always goes to the plan overview, also right after the plan was created
definePageMeta({ backTo: "/plans-overview" });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Diplomabeschrijving" });
  },
  data() {
    return {
      // The number of the step that is open (1 to 4). 0 means none. Only one step is open at a time
      openStep: 1,
      // The state of the plan. It is saved in the browser per plan and loaded again in mounted()
      // The title of the plan. Empty means the default title (see planTitle)
      title: "",
      // The chosen diploma, for example "VWO". It decides the documents and the texts (MBO goes via SBB)
      diploma: "",
      completedSteps: 0,
      evidenceByStep: { 1: [], 2: [], 3: [], 4: [] } as Record<string, string[]>,
      addedRequirementIds: [] as string[],
      notes: "",
      isShared: false,
      archivedAt: "",
      isCancelled: false,
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
    // The id of this plan, from the address: /plans/diploma-description/5 gives "5"
    planId(): string {
      return String(this.$route.params.id);
    },
    // The title shown at the top, in the progress bar label and in the "Plan gedeeld" message
    planTitle(): string {
      return diplomaDescriptionTitle(this.savedProgress);
    },
    // Everything that has to be saved, in one object. When one of these values changes, the watcher below saves it
    savedProgress(): DiplomaDescriptionProgress {
      return {
        title: this.title,
        diploma: this.diploma,
        completedSteps: this.completedSteps,
        evidenceByStep: this.evidenceByStep,
        addedRequirementIds: this.addedRequirementIds,
        notes: this.notes,
        isShared: this.isShared,
        archivedAt: this.archivedAt,
        isCancelled: this.isCancelled,
      };
    },
    // Which of the four steps are concluded, in order
    done(): boolean[] {
      return diplomaDescriptionDoneSteps(this.savedProgress);
    },
    // The index (0 to 3) of the step the user works on now. 4 means all steps are concluded
    nextIndex(): number {
      return this.completedSteps;
    },
    // Every concluded step is a quarter of the plan
    progress(): number {
      return percentageDone(this.done);
    },
    // A step is locked (grey) until the step before it is concluded
    step2Locked(): boolean {
      return this.completedSteps < 1;
    },
    step3Locked(): boolean {
      return this.completedSteps < 2;
    },
    step4Locked(): boolean {
      return this.completedSteps < 3;
    },
    // The documents the user needs, with the name of the chosen diploma (auto-imported from app/utils/diplomaDescriptionProgress.ts)
    requirements(): { id: string; title: string }[] {
      return diplomaDescriptionRequirements(this.diploma);
    },
    // The organisation that makes the description: SBB for an MBO diploma, Nuffic for all other diplomas
    organisation(): string {
      return isMboDiploma(this.diploma) ? "SBB" : "Nuffic";
    },
    // The number of required documents the plan does not have yet
    missingCount(): number {
      return this.requirements.filter((requirement) => !this.hasDocument(requirement.id)).length;
    },
    // When a step is concluded and closed, the description shows the result. Otherwise the normal text
    step1Description(): string {
      return this.done[0] && this.openStep !== 1 ? "Gecontroleerd" : "Is het nodig?";
    },
    step2Description(): string {
      return this.done[1] && this.openStep !== 2 ? "Documenten compleet" : "Documenten uit uw kluis";
    },
    step3Description(): string {
      if (this.done[2] && this.openStep !== 3) return "Aangevraagd";
      return `Via ${this.organisation}`;
    },
    step3Text(): string {
      if (isMboDiploma(this.diploma)) {
        return "Een MBO-diploma loopt niet via Nuffic. U vraagt de diplomabeschrijving aan bij SBB. Kosten en wachttijd vindt u op de website van SBB.";
      }
      return "Nuffic maakt de diplomabeschrijving. De kosten zijn € 130,68, betaling gaat via de Nuffic website.";
    },
    step4Description(): string {
      if (this.done[3] && this.openStep !== 4) return "Gedownload";
      return isMboDiploma(this.diploma) ? "Wachttijd verschilt" : "Meestal binnen 4 weken";
    },
    step4Text(): string {
      if (isMboDiploma(this.diploma)) {
        return "De wachttijd verschilt. Download de diplomabeschrijving daarna en voeg hem toe aan uw kluis.";
      }
      return "Nuffic maakt de diplomabeschrijving meestal binnen 4 weken. Download hem daarna en voeg hem toe aan uw kluis.";
    },
  },
  watch: {
    // Runs every time something in savedProgress changes (deep: also changes inside the object). It saves the progress
    savedProgress: {
      handler(progress: DiplomaDescriptionProgress) {
        saveDiplomaDescriptionProgress(this.planId, progress);
      },
      deep: true,
    },
  },
  // mounted() runs once, when the page is on the screen. First we load the saved progress of this plan (the browser storage
  // does not exist on the server, so this can only happen here). Then we start listening to scrolling and resizing
  mounted() {
    Object.assign(this, loadDiplomaDescriptionProgress(this.planId));
    // Open the step the user works on now (all concluded: no step open)
    this.openStep = this.completedSteps < diplomaDescriptionStepCount ? this.completedSteps + 1 : 0;
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
    // Tapping the step right after the current one also concludes the current step, when it has what it needs:
    // the checkmark appears and the progress goes up. Without that the next step opens, but stays grey
    toggle(step: number) {
      const previousStep = step - 1;
      if (previousStep === this.completedSteps + 1 && this.canConclude(previousStep)) {
        this.completedSteps = previousStep;
      }
      this.openStep = this.openStep === step ? 0 : step;
    },
    // True when the plan has this required document (added from the vault in some step, or with "+ Toevoegen")
    hasDocument(requirementId: string): boolean {
      return hasDiplomaRequirement(this.savedProgress, requirementId);
    },
    // True when the step can be concluded by tapping the next step. Step 1 can not: it has its own button (confirmCheck).
    // Step 2 needs every document, the other steps need nothing
    canConclude(step: number): boolean {
      if (step === 1) return false;
      if (step === 2) return this.missingCount === 0;
      return true;
    },
    // "Gecontroleerd, dit is nodig" in step 1: the user confirms that they checked it. Step 1 is concluded and step 2 opens
    confirmCheck() {
      this.completedSteps = 1;
      this.openStep = 2;
    },
    // "Niet nodig" in step 1: the plan is cancelled. It is saved right away (the watcher would only save after the page is gone),
    // then we go to the plan overview. ?cancelled=... in the address tells the overview to show the message
    cancelPlan() {
      this.isCancelled = true;
      saveDiplomaDescriptionProgress(this.planId, this.savedProgress);
      navigateTo({ path: "/plans-overview", query: { cancelled: this.planTitle } });
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
    // The line above step n (1 to 4) is blue when step n-1 is concluded. The first step has no line above
    lineAbove(step: number): string {
      if (step === 1) return "none";
      return this.done[step - 2] ? "blue" : "grey";
    },
    // The line below step n is blue when step n is concluded. The last step has no line below
    lineBelow(step: number): string {
      if (step === diplomaDescriptionStepCount) return "none";
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
      saveDiplomaDescriptionProgress(this.planId, this.savedProgress);
      navigateTo("/plans-overview?view=archive");
    },
  },
});
</script>

<template>
  <div class="flex flex-col gap-6 pt-4 pb-7">
    <!-- The title with the three dots: tapping the dots lets the user change the title (shared component) -->
    <EditableTitle :title="planTitle" subtitle="Diplomabeschrijving aanvragen" @save="saveTitle" />

    <ProgressBar :progress="progress" size="large" :label="`Voortgang ${planTitle}`" />

    <!-- The four steps. Each row has the marker of the vertical progress bar on the left and the step on the right -->
    <div>
      <div class="flex gap-4">
        <StepMarker :is-done="done[0]" :is-next="nextIndex === 0" :is-open="openStep === 1" :line-above="lineAbove(1)" :line-below="lineBelow(1)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard
            :number="1"
            title="Controleer eerst"
            :description="step1Description"
            :is-open="openStep === 1"
            :can-add-evidence="false"
            @toggle="toggle(1)"
          >
            <p class="mb-1 text-xs leading-4 font-normal text-grey">
              Vraag bij de betreffende instelling, werkgever of land of een diplomabeschrijving nodig is.
            </p>
            <!-- The user has to tap the first button to confirm the check, or the second one when the description is not needed.
                 They are only there while step 1 is the current step -->
            <template v-if="nextIndex === 0" #actions>
              <div class="mt-3 flex flex-col gap-3">
                <PrimaryButton label="Gecontroleerd, dit is nodig" @click="confirmCheck" />
                <CancelButton label="Niet nodig, plan annuleren" @click="cancelPlan" />
              </div>
            </template>
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[1]" :is-next="nextIndex === 1" :is-open="openStep === 2" :line-above="lineAbove(2)" :line-below="lineBelow(2)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard
            :number="2"
            title="Wat heb ik al?"
            :description="step2Description"
            :is-locked="step2Locked"
            :is-open="openStep === 2"
            :can-add-evidence="false"
            @toggle="toggle(2)"
          >
            <p class="mb-1 text-xs leading-4 font-normal text-grey">
              {{ organisation }} maakt de diplomabeschrijving. U heeft {{ requirements.length === 1 ? "dit document" : "deze documenten" }} nodig.
            </p>
            <!-- A locked step can be read, but nothing can be added or removed yet: the "+ Toevoegen" buttons are grey -->
            <DocumentRow
              v-for="requirement in requirements"
              :key="requirement.id"
              :title="requirement.title"
              :has-line="requirements.length > 1"
              :is-missing="!hasDocument(requirement.id)"
              :is-disabled="step2Locked"
              :can-edit="!step2Locked && hasDocument(requirement.id)"
              @add="addRequirement(requirement.id)"
              @remove="removeRequirement(requirement.id)"
            />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[2]" :is-next="nextIndex === 2" :is-open="openStep === 3" :line-above="lineAbove(3)" :line-below="lineBelow(3)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard
            :number="3"
            title="Aanvragen en betalen"
            :description="step3Description"
            :is-locked="step3Locked"
            :is-open="openStep === 3"
            :can-add-evidence="false"
            @toggle="toggle(3)"
          >
            <p class="text-xs leading-4 font-normal text-grey">{{ step3Text }}</p>
            <!-- The button to the website of Nuffic or SBB. It does not go anywhere yet (no link), so it is a plain button.
                 In a locked step it is grey (Disabled state) -->
            <button
              type="button"
              :disabled="step3Locked"
              class="mt-3 flex min-h-7.25 w-full items-center justify-center rounded-xl px-4 py-1.5 text-center text-xs leading-4 font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :class="step3Locked ? 'bg-grey' : 'bg-blue'"
            >
              Naar de website van {{ organisation }}
            </button>
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[3]" :is-next="nextIndex === 3" :is-open="openStep === 4" :line-above="lineAbove(4)" :line-below="lineBelow(4)" />
        <div class="min-w-0 flex-1">
          <StepCard
            :number="4"
            title="Wachten en downloaden"
            :description="step4Description"
            :is-locked="step4Locked"
            :is-open="openStep === 4"
            :can-add-evidence="false"
            @toggle="toggle(4)"
          >
            <p class="text-xs leading-4 font-normal text-grey">{{ step4Text }}</p>
            <!-- The button to add the downloaded description to the vault. It does nothing yet, like "Rijbewijs toevoegen aan kluis" in the
                 driving licence plan. In a locked step it is grey (Disabled state) -->
            <button
              type="button"
              :disabled="step4Locked"
              class="mt-3 flex min-h-7.25 w-full items-center justify-center rounded-xl px-4 py-1.5 text-center text-xs leading-4 font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              :class="step4Locked ? 'bg-grey' : 'bg-blue'"
            >
              Diplomabeschrijving toevoegen aan kluis
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
