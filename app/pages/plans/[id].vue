<!-- app/pages/plans/[id].vue
     The screen of one plan. The file name [id] makes it a page with a variable part: /plans/12 opens this page with id "12"
     (Nuxt file-based routing). For now the plan is sample data, the same for every id. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// backTo: the back button in the top bar always goes to the plan overview, also right after the plan was created
definePageMeta({ backTo: "/plans-overview" });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Plan" });
  },
  data() {
    return {
      // The title of the plan. Empty means the default title (see planTitle). It is saved with the progress below
      title: "",
      // The number of the step that is open (1 to 4). 0 means none. Only one step is open at a time
      openStep: 1,
      // The state of the steps. It is saved in the browser per plan (see app/utils/planProgress.ts) and loaded again in mounted()
      // Step 1: the user has Rijbewijs B in the vault. For now "+ Toevoegen" sets this to true
      hasLicenseB: false,
      // Step 2: the exam is done
      examDone: false,
      // Step 3: the user pressed "Ik heb al een afspraak", and the date of the appointment ("2026-11-14")
      hasAppointment: false,
      appointmentDate: "",
      // Step 4: the licence was received
      licenseReceived: false,
      notes: "",
      // The documents the user added from the vault, per step. The step of the open vault drawer (0 = closed)
      evidenceByStep: { 1: [], 2: [], 3: [], 4: [] } as Record<string, string[]>,
      vaultStep: 0,
      // True when the page is scrolled all the way down: then the shade at the bottom goes away
      isScrolledToBottom: false,
    };
  },
  computed: {
    // The id of this plan, from the address: /plans/12 gives "12"
    planId(): string {
      return String(this.$route.params.id);
    },
    // The title shown at the top and in the progress bar label
    planTitle(): string {
      return drivingLicenceTitle(this.savedProgress);
    },
    // Everything that has to be saved, in one object. When one of these values changes, the watcher below saves it
    savedProgress(): PlanProgress {
      return {
        title: this.title,
        hasLicenseB: this.hasLicenseB,
        examDone: this.examDone,
        hasAppointment: this.hasAppointment,
        appointmentDate: this.appointmentDate,
        licenseReceived: this.licenseReceived,
        notes: this.notes,
        evidenceByStep: this.evidenceByStep,
      };
    },
    // Which of the four steps are done, in order. A step only counts when the steps before it are done too
    done(): boolean[] {
      return drivingLicenceDoneSteps(this.savedProgress);
    },
    // The index (0 to 3) of the first step that is not done: this one has to be finished next. 4 means all done
    nextIndex(): number {
      const index = this.done.findIndex((isDone) => !isDone);
      return index === -1 ? 4 : index;
    },
    // The progress of the plan: every step that is done is 25% (4 steps). The plan card on the overview shows the same number
    progress(): number {
      return percentageDone(this.done);
    },
    // A step is locked while the step before it is not done
    step2Locked(): boolean {
      return !this.done[0];
    },
    step3Locked(): boolean {
      return !this.done[1];
    },
    step4Locked(): boolean {
      return !this.done[2];
    },
    // When a step is done and closed, the description shows the result. Otherwise the normal text
    step1Description(): string {
      return this.hasLicenseB && this.openStep !== 1 ? "Rijbewijs B" : "Documenten uit uw kluis";
    },
    step2Description(): string {
      return this.examDone && this.openStep !== 2 ? "Examens afgerond" : "Vereiste examens voor dit rijbewijs";
    },
  },
  watch: {
    // Runs every time something in savedProgress changes (deep: also changes inside the object). It saves the progress
    savedProgress: {
      handler(progress: PlanProgress) {
        savePlanProgress(this.planId, progress);
      },
      deep: true,
    },
  },
  // mounted() runs once, when the page is on the screen. First we load the saved progress of this plan (the browser storage
  // does not exist on the server, so this can only happen here). Then we start listening to scrolling and resizing
  mounted() {
    Object.assign(this, loadPlanProgress(this.planId));
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
    // Called by EditableTitle when the user saved a new title. The watcher on savedProgress saves it
    saveTitle(newTitle: string) {
      this.title = newTitle;
    },
    // The evidence of one step as { id, title }, with the names from the vault (findVaultDocument is in app/utils/vaultDocuments.ts)
    evidenceFor(step: number): { id: string; title: string }[] {
      const ids = this.evidenceByStep[step] ?? [];
      return ids.map((id) => ({ id, title: findVaultDocument(id)?.title ?? id }));
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
    completeExam() {
      this.examDone = true;
      this.openStep = 0;
    },
    // The line above step n (1 to 4) is blue when step n-1 is done. The first step has no line above
    lineAbove(step: number): string {
      if (step === 1) return "none";
      return this.done[step - 2] ? "blue" : "grey";
    },
    // The line below step n is blue when step n is done. The last step has no line below
    lineBelow(step: number): string {
      if (step === 4) return "none";
      return this.done[step - 1] ? "blue" : "grey";
    },
  },
});
</script>

<template>
  <div class="flex flex-col gap-6 pt-4 pb-7">
    <!-- The title with the three dots: tapping the dots lets the user change the title (shared component) -->
    <EditableTitle :title="planTitle" subtitle="Rijbewijs behalen" @save="saveTitle" />

    <ProgressBar :progress="progress" size="large" :label="`Voortgang ${planTitle}`" />

    <!-- The four steps. Each row has the marker of the vertical progress bar on the left and the step on the right -->
    <div>
      <div class="flex gap-4">
        <StepMarker :is-done="done[0]" :is-next="nextIndex === 0" :is-open="openStep === 1" :line-above="lineAbove(1)" :line-below="lineBelow(1)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard :number="1" title="Wat heb ik al?" :description="step1Description" :is-open="openStep === 1" :evidence="evidenceFor(1)" @toggle="toggle(1)" @add-evidence="vaultStep = 1" @remove-evidence="removeEvidence(1, $event)">
            <p v-if="!hasLicenseB" class="mb-1 text-xs leading-4 font-normal text-grey">
              Er ontbreekt nog een document in uw kluis. Voeg het toe om verder te gaan.
            </p>
            <DocumentRow title="Rijbewijs B" :is-missing="!hasLicenseB" @add="hasLicenseB = true" />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[1]" :is-next="nextIndex === 1" :is-open="openStep === 2" :line-above="lineAbove(2)" :line-below="lineBelow(2)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard :number="2" title="Examens" :description="step2Description" :is-locked="step2Locked" :is-open="openStep === 2" :evidence="evidenceFor(2)" @toggle="toggle(2)" @add-evidence="vaultStep = 2" @remove-evidence="removeEvidence(2, $event)">
            <PPFGetDrivingLicenceExamCard :is-read-only="step2Locked" @completed="completeExam" />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[2]" :is-next="nextIndex === 2" :is-open="openStep === 3" :line-above="lineAbove(3)" :line-below="lineBelow(3)" />
        <div class="min-w-0 flex-1 pb-4">
          <StepCard :number="3" title="Rijbewijs aanvragen" description="Via uw gemeente of de RDW" :is-locked="step3Locked" :is-open="openStep === 3" :evidence="evidenceFor(3)" @toggle="toggle(3)" @add-evidence="vaultStep = 3" @remove-evidence="removeEvidence(3, $event)">
            <PPFGetDrivingLicenceRequestCard
              v-model:appointment-date="appointmentDate"
              text="Na uw praktijkexamen vraagt u uw rijbewijs aan bij uw gemeente, of online via de RDW."
              municipality-url="https://www.rijksoverheid.nl"
              rdw-url="https://www.rdw.nl/het-rijbewijs/rijbewijs-halen/hoe-werkt-het-halen-van-een-rijbewijs"
              :is-read-only="step3Locked"
              :has-appointment="hasAppointment"
              @appointment="hasAppointment = true"
            />
          </StepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <StepMarker :is-done="done[3]" :is-next="nextIndex === 3" :is-open="openStep === 4" :line-above="lineAbove(4)" :line-below="lineBelow(4)" />
        <div class="min-w-0 flex-1">
          <StepCard :number="4" title="Ophalen en toevoegen" description="Upload uw nieuwe rijbewijs" :is-locked="step4Locked" :is-open="openStep === 4" :evidence="evidenceFor(4)" @toggle="toggle(4)" @add-evidence="vaultStep = 4" @remove-evidence="removeEvidence(4, $event)">
            <PPFGetDrivingLicenceCollectCard
              :appointment-date="appointmentDate"
              :is-received="licenseReceived"
              :is-read-only="step4Locked"
              @received="licenseReceived = true"
            />
          </StepCard>
        </div>
      </div>
    </div>

    <NotesField v-model="notes" />

    <!-- The vault drawer: open while vaultStep is a step number (1 to 4). It leaves out what is already in that step -->
    <VaultPickerSheet
      :open="vaultStep !== 0"
      :hidden-ids="evidenceByStep[vaultStep] ?? []"
      @close="vaultStep = 0"
      @add="addEvidence"
    />

    <!-- A soft shade at the bottom of the screen: see-through at the top and 20% navy at the bottom.
         pointer-events-none lets clicks go through it. It fades away at the bottom of the page (opacity-0) -->
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-x-0 bottom-0 h-56 bg-linear-to-b from-transparent to-navy/20 transition-opacity duration-200"
      :class="isScrolledToBottom ? 'opacity-0' : 'opacity-100'"
    />

    <!-- The buttons "Plan archiveren" and "Plan delen" are made by another team member and go here later -->

  </div>
</template>
