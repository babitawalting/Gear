<!-- app/components/profile/ProfileMessageCard.vue
     One message in the messages overview: the avatar of the sender, the name, the subject and a menu button.
     The whole card is a link to the message. The menu button (three dots) is only visual for now.
     Usage: <ProfileMessageCard to="/profile/messages/1" sender-name="Ben Kampen" sender-initials="BK"
              subject="Uitnodiging kennismakingsgesprek" is-unread /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // The address of the message, for example "/profile/messages/1"
    to: { type: String, required: true },
    senderName: { type: String, required: true },
    senderInitials: { type: String, required: true },
    subject: { type: String, required: true },
    // True shows the red dot on the avatar (static for now)
    isUnread: { type: Boolean, default: false },
  },
});
</script>

<template>
  <!-- `relative` is needed for the link below: its ::after covers the card, so it must know where the card is
       (the same way as PlansOverviewCard) -->
  <article class="relative flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2">
    <ProfileAvatar :initials="senderInitials" size="medium" :has-notification="isUnread" />

    <div class="flex min-w-0 flex-1 flex-col">
      <h2 class="truncate text-base leading-5 font-semibold text-navy">
        <!-- NuxtLink is Nuxt's link to another page of the app. Its ::after stretches over the whole card,
             so tapping anywhere on the card opens the message. A link around the whole card would put the menu button inside a link -->
        <NuxtLink
          :to="to"
          class="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-blue"
        >
          {{ senderName }}
          <span v-if="isUnread" class="sr-only">(ongelezen)</span>
        </NuxtLink>
      </h2>
      <p class="truncate text-sm leading-4 font-normal text-grey">{{ subject }}</p>
    </div>

    <!-- Menu button, not working yet. `relative` puts it above the stretched link, so tapping it does not open the message.
         The negative margins keep the 44px touch target inside the card -->
    <button
      type="button"
      aria-label="Meer opties (binnenkort beschikbaar)"
      aria-disabled="true"
      class="relative -my-1 -mr-1 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-grey focus-visible:outline-2 focus-visible:outline-blue"
    >
      <IconDisplay name="ellipsis" class="size-5 rotate-90" />
    </button>
  </article>
</template>
