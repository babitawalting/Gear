<!-- app/pages/profile/messages/[id].vue
     The screen of one message. The file name [id] makes it a page with a variable part: /profile/messages/1 opens this page
     with id "1" (Nuxt file-based routing). The message comes from the static example data in app/utils/profileMessages.ts.
     From the Figma design "Profiel bericht V3". The related plan and the "Beantwoorden" button are only visual for now. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// bottomNav: show the navigation bar.
// There is no backTo on purpose: the back button goes back in the browser history to the messages overview (see TopBar
// and the comment in app/pages/profile/messages/index.vue)
definePageMeta({ bottomNav: true });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Bericht" });
  },
  computed: {
    // The message of this address: /profile/messages/1 gives the message with id "1". Undefined when it does not exist
    message(): ProfileMessage | undefined {
      return findProfileMessage(String(this.$route.params.id));
    },
  },
});
</script>

<template>
  <div class="flex flex-1 flex-col">
    <!-- One root element (Vue rule): it fills the height (flex-1), so the button below can sit at the bottom -->
    <div v-if="message" class="flex flex-1 flex-col gap-6 py-4">
      <PageHeader title="Bericht" :subtitle="message.subject" />

      <section class="flex flex-col gap-2" aria-labelledby="related-plan-title">
        <h2 id="related-plan-title" class="text-base leading-5 font-semibold text-navy">Gerelateerd plan</h2>
        <ProfileRelatedPlanCard
          :title="message.relatedPlan.title"
          :icon="message.relatedPlan.icon"
          :progress="message.relatedPlan.progress"
        />
      </section>

      <div class="flex flex-col gap-3">
        <ProfileSenderCard
          :sender-name="message.senderName"
          :sender-initials="message.senderInitials"
          :company="message.senderCompany"
          :date-label="message.dateLabel"
          :date-iso="message.dateIso"
        />

        <!-- The message text. whitespace-pre-line shows the "\n" in a paragraph as a new line (used for the signature) -->
        <article class="flex flex-col gap-4 rounded-xl border border-sand bg-white px-4 pt-5 pb-10">
          <p
            v-for="(paragraph, index) in message.paragraphs"
            :key="index"
            class="text-sm leading-[15px] font-normal whitespace-pre-line text-navy"
          >
            {{ paragraph }}
          </p>
        </article>
      </div>

      <!-- mt-auto pushes the button to the bottom of the screen, above the navigation bar, as in Figma.
           Primary button with the reply arrow in front. It does not work yet: aria-disabled and the hidden text tell screen readers -->
      <div class="mt-auto flex justify-end">
        <button
          type="button"
          aria-disabled="true"
          class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue px-6 py-2 text-sm font-normal text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <IconDisplay name="share" class="size-5" />
          Beantwoorden
          <span class="sr-only">(binnenkort beschikbaar)</span>
        </button>
      </div>
    </div>

    <!-- An address with an unknown id, for example /profile/messages/99 -->
    <div v-else class="flex flex-1 flex-col gap-6 py-4">
      <PageHeader title="Bericht" subtitle="Dit bericht bestaat niet (meer)" />
      <NuxtLink
        to="/profile/messages"
        class="flex min-h-11 items-center justify-center rounded-xl border border-sand bg-white px-4 py-2 text-sm font-normal text-blue focus-visible:outline-2 focus-visible:outline-blue"
      >
        Naar mijn berichten
      </NuxtLink>
    </div>
  </div>
</template>
