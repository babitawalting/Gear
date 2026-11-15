<!-- app/pages/plans/[id].vue
     The screen of one plan. The file name [id] makes it a page with a variable part: /plans/12 opens this page with id "12"
     (Nuxt file-based routing). For now the plan is sample data, the same for every id. -->
<script lang="ts">
export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Rijbewijs BE" });
  },
  data() {
    return {
      // Sample data for now, this will come from the database later (this.$route.params.id says which plan)
      plan: { title: "Rijbewijs BE", subtitle: "Rijbewijs behalen" },
      // The number of the step that is open (1 to 4). 0 means none. Only one step is open at a time
      openStep: 1,
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
    };
  },
  computed: {
    // Which of the four steps are done, in order
    done(): boolean[] {
      return [this.hasLicenseB, this.examDone, this.appointmentDate !== "", this.licenseReceived];
    },
    // The index (0 to 3) of the first step that is not done: this one has to be finished next. 4 means all done
    nextIndex(): number {
      const index = this.done.findIndex((isDone) => !isDone);
      return index === -1 ? 4 : index;
    },
    // The progress of the plan: every step that is done is 25%. The plan card will show the same number
    progress(): number {
      return (this.done.filter((isDone) => isDone).length / 4) * 100;
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
  methods: {
    // Tapping a header opens that step and closes the other one. Tapping the open step closes it
    toggle(step: number) {
      this.openStep = this.openStep === step ? 0 : step;
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
    <!-- The top bar (back button, logo and avatar) is made by other team members and goes here later -->
    <div class="flex items-start justify-between gap-4">
      <PageHeader :title="plan.title" :subtitle="plan.subtitle" />
      <!-- The menu button does nothing yet. The negative margins keep the 44px tappable area from pushing the header -->
      <button
        type="button"
        aria-label="Meer opties"
        class="-mt-1 -mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
      >
        <IconDisplay name="ellipsis" class="size-5 rotate-90" />
      </button>
    </div>

    <ProgressBar :progress="progress" size="large" :label="`Voortgang ${plan.title}`" />

    <!-- The four steps. Each row has the marker of the vertical progress bar on the left and the step on the right -->
    <div>
      <div class="flex gap-4">
        <PPFStepMarker :is-done="done[0]" :is-next="nextIndex === 0" :is-open="openStep === 1" :line-above="lineAbove(1)" :line-below="lineBelow(1)" />
        <div class="min-w-0 flex-1 pb-4">
          <PPFStepCard :number="1" title="Wat heb ik al?" :description="step1Description" :is-open="openStep === 1" @toggle="toggle(1)">
            <p v-if="!hasLicenseB" class="mb-1 text-xs leading-4 font-normal text-grey">
              Er ontbreekt nog een document in uw kluis. Voeg het toe om verder te gaan.
            </p>
            <PPFDocumentRow title="Rijbewijs B" :is-missing="!hasLicenseB" @add="hasLicenseB = true" />
          </PPFStepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <PPFStepMarker :is-done="done[1]" :is-next="nextIndex === 1" :is-open="openStep === 2" :line-above="lineAbove(2)" :line-below="lineBelow(2)" />
        <div class="min-w-0 flex-1 pb-4">
          <PPFStepCard :number="2" title="Examens" :description="step2Description" :is-locked="step2Locked" :is-open="openStep === 2" @toggle="toggle(2)">
            <PPFGetDrivingLicenceExamCard :is-read-only="step2Locked" @completed="completeExam" />
          </PPFStepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <PPFStepMarker :is-done="done[2]" :is-next="nextIndex === 2" :is-open="openStep === 3" :line-above="lineAbove(3)" :line-below="lineBelow(3)" />
        <div class="min-w-0 flex-1 pb-4">
          <PPFStepCard :number="3" title="Rijbewijs aanvragen" description="Via uw gemeente of de RDW" :is-locked="step3Locked" :is-open="openStep === 3" @toggle="toggle(3)">
            <PPFGetDrivingLicenceRequestCard
              v-model:appointment-date="appointmentDate"
              text="Na uw praktijkexamen vraagt u uw rijbewijs aan bij uw gemeente, of online via de RDW."
              municipality-url="https://www.rijksoverheid.nl"
              rdw-url="https://www.rdw.nl/het-rijbewijs/rijbewijs-halen/hoe-werkt-het-halen-van-een-rijbewijs"
              :is-read-only="step3Locked"
              :has-appointment="hasAppointment"
              @appointment="hasAppointment = true"
            />
          </PPFStepCard>
        </div>
      </div>

      <div class="flex gap-4">
        <PPFStepMarker :is-done="done[3]" :is-next="nextIndex === 3" :is-open="openStep === 4" :line-above="lineAbove(4)" :line-below="lineBelow(4)" />
        <div class="min-w-0 flex-1">
          <PPFStepCard :number="4" title="Ophalen en toevoegen" description="Upload uw nieuwe rijbewijs" :is-locked="step4Locked" :is-open="openStep === 4" @toggle="toggle(4)">
            <PPFGetDrivingLicenceCollectCard
              :appointment-date="appointmentDate"
              :is-received="licenseReceived"
              :is-read-only="step4Locked"
              @received="licenseReceived = true"
            />
          </PPFStepCard>
        </div>
      </div>
    </div>

    <NotesField v-model="notes" />

    <!-- The two buttons at the bottom are written here directly, in the Secondary and Primary states of the skill. They do nothing yet -->
    <div class="flex gap-4">
      <button
        type="button"
        class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-blue focus-visible:outline-2 focus-visible:outline-blue"
      >
        <IconDisplay name="archive" class="size-5" />
        Plan archiveren
      </button>
      <button
        type="button"
        class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue px-4 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        <IconDisplay name="share" class="size-5" />
        Plan delen
      </button>
    </div>
  </div>
</template>
