<!-- app/components/profile/ProfileUserCard.vue
     The card at the top of the profile page: the name of the user, the "Openbaar profiel bekijken" button and the avatar.
     The public profile is built later, so for now the button only looks like the Figma design and does nothing.
     Usage: <ProfileUserCard name="Ravi Santos" initials="RS" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // Full name of the user, for example "Ravi Santos"
    name: { type: String, required: true },
    // Initials for the avatar, for example "RS"
    initials: { type: String, required: true },
  },
});
</script>

<template>
  <section class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white py-5 pr-4 pl-5">
    <div class="flex min-w-0 flex-1 flex-col items-start gap-3">
      <h2 class="text-xl leading-6 font-semibold text-navy">{{ name }}</h2>
      <!-- Primary button with the arrow after the text (Figma). It does not work yet:
           aria-disabled tells screen readers, the hidden text says why. It keeps the Primary look on purpose, as in Figma -->
      <button
        type="button"
        aria-disabled="true"
        class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue px-3 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        Openbaar profiel bekijken
        <span class="sr-only">(binnenkort beschikbaar)</span>
        <IconDisplay name="arrow-right" class="size-5" />
      </button>
    </div>
    <ProfileAvatar :initials="initials" size="large" />
  </section>
</template>
