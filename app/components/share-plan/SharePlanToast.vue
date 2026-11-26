<!-- app/components/share-plan/SharePlanToast.vue
     A short message at the top of the screen, by default after a plan was shared: "Plan gedeeld".
     The texts can be changed with `title` and `message`, for example for a cancelled plan.
     - Tapping it opens the plan (when `to` is given). Without `to` there is no arrow and tapping only closes it.
     - It goes away by itself after 5 seconds, or when the user swipes it up off the screen.
     Usage: <SharePlanToast :open="isToastOpen" plan-title="Rijbewijs BE" to="/plans/12" @close="isToastOpen = false" /> -->
<script lang="ts">
export default defineComponent({
  props: {
    // True when the message is shown. The parent decides when to show it
    open: { type: Boolean, default: false },
    // The name of the plan, for example "Rijbewijs BE"
    planTitle: { type: String, required: true },
    // The bold first line, in Dutch
    title: { type: String, default: "Plan gedeeld" },
    // The second line, in Dutch. Empty means the sentence about sharing: Het plan "Rijbewijs BE" is gedeeld.
    message: { type: String, default: "" },
    // The page of the plan, for example "/plans/12". Empty means there is nothing to open: no link and no arrow
    to: { type: String, default: "" },
  },
  // "close": the message should go away (time is up, swiped away, or tapped)
  emits: ["close"],
  data() {
    return {
      // The id of the 5 second timer, so it can be stopped. null means no timer is running
      timerId: null as ReturnType<typeof setTimeout> | null,
      // For swiping up: true while the user is dragging the message
      isDragging: false,
      // Where the finger (or mouse) was when the drag started, in pixels from the top of the screen
      dragStartY: 0,
      // How far the message is dragged up right now, in pixels (0 or less)
      dragOffset: 0,
      // True when the user really dragged (not just tapped), so the tap doesn't open the plan
      wasDragged: false,
    };
  },
  computed: {
    // A link to the plan when `to` is given, otherwise a plain box (resolveComponent finds NuxtLink by its name)
    wrapper() {
      return this.to !== "" ? resolveComponent("NuxtLink") : "div";
    },
    // The second line: the `message` from the parent, or the sentence about sharing
    messageText(): string {
      return this.message !== "" ? this.message : `Het plan "${this.planTitle}" is gedeeld.`;
    },
  },
  watch: {
    // Runs every time the `open` prop changes: start the timer when shown, stop it when hidden
    open(isOpen: boolean) {
      if (isOpen) {
        this.dragOffset = 0;
        this.startTimer();
      } else {
        this.stopTimer();
      }
    },
  },
  // mounted() runs once, when the component is on the page. The message could already be shown then
  mounted() {
    if (this.open) {
      this.startTimer();
    }
  },
  // beforeUnmount() runs when the component leaves the page: stop the timer so it doesn't fire later
  beforeUnmount() {
    this.stopTimer();
  },
  methods: {
    // After 5 seconds the message closes by itself
    startTimer() {
      this.stopTimer();
      this.timerId = setTimeout(() => {
        this.$emit("close");
      }, 5000);
    },
    stopTimer() {
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    },
    // Swiping up. Pointer events work for both a finger and a mouse
    startDrag(event: PointerEvent) {
      this.isDragging = true;
      this.wasDragged = false;
      this.dragStartY = event.clientY;
      // While the user holds the message, it should not disappear
      this.stopTimer();
    },
    moveDrag(event: PointerEvent) {
      if (!this.isDragging) return;
      // Only upwards: dragging down does nothing (Math.min keeps it at 0 or less)
      this.dragOffset = Math.min(0, event.clientY - this.dragStartY);
      // Moved more than a few pixels: this is a swipe, not a tap
      if (this.dragOffset < -5 && !this.wasDragged) {
        this.wasDragged = true;
        // From now on, keep sending the moves to this element, also when the finger leaves it.
        // Only done for a swipe: for a tap the click has to reach the link, so it can open the plan
        (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
      }
    },
    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.dragOffset < -40) {
        // Swiped up far enough: close. dragOffset stays, so it flies away from where the finger left it
        this.$emit("close");
      } else {
        // Not far enough: slide back and start the 5 seconds again
        this.dragOffset = 0;
        this.startTimer();
      }
    },
    // Runs before the link gets the click (.capture). After a swipe the click is stopped, so the plan doesn't open
    blockClickAfterDrag(event: MouseEvent) {
      if (this.wasDragged) {
        event.preventDefault();
        event.stopPropagation();
        this.wasDragged = false;
      }
    },
  },
});
</script>

<template>
  <!-- <Transition> is Vue's way to animate something in and out: it slides down from above the screen and back up -->
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="-translate-y-full opacity-0"
    leave-active-class="transition-all duration-300"
    leave-to-class="-translate-y-full opacity-0"
  >
    <!-- Fixed at the top, in the same 402px column as the page.
         role="status": screen readers read the message out loud when it appears -->
    <div
      v-if="open"
      role="status"
      class="fixed inset-x-0 top-4 z-50 mx-auto w-full max-w-[402px] touch-none px-6"
      :class="isDragging ? '' : 'transition-transform duration-200'"
      :style="dragOffset !== 0 ? { transform: `translateY(${dragOffset}px)` } : undefined"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @click.capture="blockClickAfterDrag"
    >
      <!-- The whole message is one link to the plan (a plain box without `to`). Tapping it also closes the message.
           draggable="false": otherwise the browser starts dragging the link itself and the swipe stops -->
      <component
        :is="wrapper"
        :to="to !== '' ? to : undefined"
        draggable="false"
        class="flex w-full items-center gap-3 rounded-xl border border-sand bg-white p-2.5 pr-4 shadow-lg shadow-navy/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        @click="$emit('close')"
      >
        <!-- Blue square with a white check -->
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue text-white">
          <IconDisplay name="check" class="size-5" />
        </span>

        <span class="flex min-w-0 flex-1 flex-col">
          <span class="text-sm leading-5 font-semibold text-navy">{{ title }}</span>
          <span class="text-xs leading-4 font-normal text-grey">{{ messageText }}</span>
        </span>

        <IconDisplay v-if="to !== ''" name="chevron-right" class="size-4 shrink-0 text-blue" />
      </component>
    </div>
  </Transition>
</template>
