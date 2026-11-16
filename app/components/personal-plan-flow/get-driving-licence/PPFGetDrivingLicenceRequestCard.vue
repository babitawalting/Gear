<!-- app/components/get-driving-licence/PPFGetDrivingLicenceRequestCard.vue
     The content of the "Rijbewijs aanvragen" step (step 3): a short explanation, two blue buttons that open a website
     (the gemeente of the user and the RDW) and a white button for someone who already has an appointment.
     When that white button is pressed (`appointment` event), the page sets `has-appointment`: the white button is
     replaced by a date field where the user fills in the date of the appointment.
     When the step is locked (`is-read-only`) the text can be read, but the buttons are grey and can't be used yet.
     Usage: <PPFGetDrivingLicenceRequestCard text="..." municipality-url="https://..." rdw-url="https://..." :is-read-only="step2NotDone" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // What the user needs to know about this step, in Dutch
    text: { type: String, required: true },
    // The website of the gemeente of the user (it comes from the account of the user)
    municipalityUrl: { type: String, required: true },
    // The website of the RDW
    rdwUrl: { type: String, required: true },
    // True while the step is locked: readable, but nothing can be done yet
    isReadOnly: { type: Boolean, default: false },
    // True after the user pressed "Ik heb al een afspraak": the date field shows
    hasAppointment: { type: Boolean, default: false },
    // The date of the appointment, written as "2026-11-14". With v-model:appointment-date the parent passes it in
    appointmentDate: { type: String, default: "" },
  },
  // "appointment": the user pressed the white button. "update:appointmentDate": the date field changed
  emits: ["appointment", "update:appointmentDate"],
  computed: {
    // The classes of the two website buttons: blue with white text, or grey (Disabled state of the skill) when the step is locked
    filledButtonClasses(): string {
      return this.isReadOnly ? "bg-grey" : "bg-blue";
    },
    // The classes of the white button: blue border and text, or grey when the step is locked
    outlineButtonClasses(): string {
      return this.isReadOnly ? "border-grey text-grey" : "border-blue text-blue";
    },
  },
});
</script>

<template>
  <div class="flex flex-col">
    <p class="text-xs leading-4 font-normal text-grey">{{ text }}</p>

    <!-- The buttons are links, because they go to another website. A link without an href that has
         aria-disabled="true" is not clickable and screen readers say it is not available -->
    <div class="mt-3 flex flex-col gap-1.5">
      <a
        :href="isReadOnly ? undefined : municipalityUrl"
        :aria-disabled="isReadOnly"
        target="_blank"
        rel="noopener"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="filledButtonClasses"
      >
        Naar de website van uw gemeente
      </a>
      <a
        :href="isReadOnly ? undefined : rdwUrl"
        :aria-disabled="isReadOnly"
        target="_blank"
        rel="noopener"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="filledButtonClasses"
      >
        Naar de website van de RDW
      </a>
      <!-- After the white button was pressed, it is replaced by a date field -->
      <PPFFormField
        v-if="hasAppointment"
        class="mt-2"
        label="Datum van uw afspraak"
        type="date"
        required
        small
        :model-value="appointmentDate"
        @update:model-value="$emit('update:appointmentDate', $event)"
      />
      <!-- The white button (Secondary look): a real button, because it does not go to a website -->
      <button
        v-else
        type="button"
        :disabled="isReadOnly"
        class="flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl border bg-white px-4 text-xs font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="outlineButtonClasses"
        @click="$emit('appointment')"
      >
        Ik heb al een afspraak
      </button>
    </div>
  </div>
</template>
