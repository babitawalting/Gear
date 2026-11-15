<!-- app/components/plan-detail/PlanDetailCollectBlock.vue
     The content of the "Ophalen en toevoegen" step. It has two looks:
     1. Waiting for the licence: a line with the date of the appointment and a button "Rijbewijs ontvangen".
     2. After that button was pressed (`is-received`): a congratulation and a button "Rijbewijs toevoegen aan kluis".
     The page decides which look it is. When the step is locked (`is-read-only`) the buttons are grey and can't be used yet.
     The button to add the licence to the vault does nothing yet.
     Usage: <PlanDetailCollectBlock appointment-date="2026-01-01" :is-received="received" @received="received = true" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The date of the appointment, written as "2026-11-14" (year-month-day)
    appointmentDate: { type: String, default: "" },
    // True after the user pressed "Rijbewijs ontvangen": the content changes to the congratulation
    isReceived: { type: Boolean, default: false },
    // True while the step is locked: readable, but nothing can be done yet
    isReadOnly: { type: Boolean, default: false },
  },
  // "received": the user pressed "Rijbewijs ontvangen". "add-to-vault": the user pressed "Rijbewijs toevoegen aan kluis"
  emits: ["received", "add-to-vault"],
  computed: {
    // Turns "2026-11-14" into "14/11/2026" (dd/mm/yyyy). Without a date it shows a dash
    formattedDate(): string {
      if (this.appointmentDate === "") return "-";
      const [year, month, day] = this.appointmentDate.split("-");
      return `${day}/${month}/${year}`;
    },
  },
});
</script>

<template>
  <div class="flex flex-col">
    <!-- Look 2: the licence is received -->
    <template v-if="isReceived">
      <p class="text-xs leading-4 font-normal text-grey">Gefeliciteerd met het behaalde rijbewijs!</p>
      <button
        type="button"
        :disabled="isReadOnly"
        class="mt-3 flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="isReadOnly ? 'bg-grey' : 'bg-blue'"
        @click="$emit('add-to-vault')"
      >
        Rijbewijs toevoegen aan kluis
      </button>
    </template>

    <!-- Look 1: waiting for the licence -->
    <template v-else>
      <p class="text-xs leading-4 font-normal text-grey">
        Afspraak op <time :datetime="appointmentDate">{{ formattedDate }}</time>
      </p>
      <button
        type="button"
        :disabled="isReadOnly"
        class="mt-3 flex min-h-7.25 py-1.5 leading-4 text-center w-full items-center justify-center rounded-xl px-4 text-xs font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        :class="isReadOnly ? 'bg-grey' : 'bg-blue'"
        @click="$emit('received')"
      >
        Rijbewijs ontvangen
      </button>
    </template>
  </div>
</template>
