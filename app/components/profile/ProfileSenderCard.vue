<!-- app/components/profile/ProfileSenderCard.vue
     Who sent a message, on the message screen: the avatar, the name, the date and a label with the company.
     Usage: <ProfileSenderCard sender-name="Ben Kampen" sender-initials="BK" company="Scaleway"
              date-label="5 nov 2026" date-iso="2026-11-05" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    senderName: { type: String, required: true },
    senderInitials: { type: String, required: true },
    company: { type: String, required: true },
    // The date as the user reads it, for example "5 nov 2026"
    dateLabel: { type: String, required: true },
    // The same date for browsers and screen readers, for example "2026-11-05"
    dateIso: { type: String, required: true },
  },
});
</script>

<template>
  <div class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white px-3 py-1.5">
    <ProfileAvatar :initials="senderInitials" size="small" />

    <div class="flex min-w-0 flex-1 flex-col">
      <p class="truncate text-sm leading-4 font-semibold text-navy">{{ senderName }}</p>
      <!-- <time> tells browsers and screen readers that this text is a date -->
      <time :datetime="dateIso" class="text-sm leading-5 font-normal text-grey">{{ dateLabel }}</time>
    </div>

    <!-- Company label: blue with white text -->
    <span class="shrink-0 rounded-xl bg-blue px-2.5 py-0.5 text-sm leading-4 font-normal text-white">{{ company }}</span>
  </div>
</template>
