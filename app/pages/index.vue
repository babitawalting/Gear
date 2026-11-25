<!-- app/pages/index.vue
     The start screen. index.vue is a special file name in Nuxt: it becomes the home route "/".
     The user taps anywhere on the screen to go to the PIN screen (/pin).
     The background colors #E8F3F9 and #C7E0F5 are only used on the start and PIN screens,
     so they are written here instead of being added to the shared colors in main.css. -->
<script lang="ts">
// definePageMeta gives the page extra settings for the layout (Nuxt reads it before the page is shown).
// This screen draws its own background, so the shared PageBackground of the default layout is turned off.
definePageMeta({ pageBackground: false });

export default defineComponent({
  // setup() is only used for Nuxt's useSeoMeta, which sets the page <title>
  setup() {
    useSeoMeta({ title: "Start" });
  },
});
</script>

<template>
  <div class="start-screen relative isolate flex min-h-screen flex-col items-center pt-35 pb-8">
    <!-- relative + isolate on this div: the background and the tap area are positioned inside it.
         pt-35 (140px) places the gears, "Gear" and the tagline as one group in the middle of the big blue shape.
         Only this padding moves the group, so the spacing inside the group stays the same -->
    <!-- Background shapes from Figma. -inset-x-6 stretches them over the 24px side margins of the layout,
         -z-10 puts them behind the content. aria-hidden: they are decoration only -->
    <div class="pointer-events-none absolute inset-y-0 -inset-x-6 -z-10 overflow-hidden" aria-hidden="true">
      <!-- left-1/2 + -translate-x-1/2 keep the 402px wide drawing centered, so on narrower phones
           the shapes stay around the gears instead of shifting to the right -->
      <svg
        class="absolute top-0 left-1/2 -translate-x-1/2"
        width="402"
        height="874"
        viewBox="0 0 402 874"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- A small blur (2.5px) gives the shapes their soft edges, as in Figma -->
          <filter id="start-background-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>
        <!-- Every shape has its own <g> with its own drift class, so each one moves on its own
             (see the <style> block at the bottom). The blur stays on the shape itself -->
        <!-- Behind the gears -->
        <g class="bubble bubble-1">
          <path
            filter="url(#start-background-blur)"
            d="M394 262C394 375.218 310.496 467 207.488 467C104.481 467 -7 430.462 -7 317.244C-7 204.025 104.481 57 207.488 57C310.496 57 394 148.782 394 262Z"
            fill="#E8F3F9"
          />
        </g>
        <g class="bubble bubble-2">
          <path
            filter="url(#start-background-blur)"
            d="M360 264C360 363.411 292.463 444 209.151 444C125.839 444 41 413.066 41 313.655C41 214.244 125.839 84 209.151 84C292.463 84 360 164.589 360 264Z"
            fill="#C7E0F5"
          />
        </g>
        <!-- Bottom right -->
        <g class="bubble bubble-3">
          <path
            filter="url(#start-background-blur)"
            d="M474 777C474 862.052 405.281 931 320.512 931C235.742 931 144 903.552 144 818.5C144 733.448 235.742 623 320.512 623C405.281 623 474 691.948 474 777Z"
            fill="#E8F3F9"
          />
        </g>
        <g class="bubble bubble-4">
          <path
            filter="url(#start-background-blur)"
            d="M452 770C452 840.692 393.143 898 320.539 898C247.935 898 174 876.003 174 805.31C174 734.618 247.935 642 320.539 642C393.143 642 452 699.308 452 770Z"
            fill="#C7E0F5"
          />
        </g>
        <!-- Left -->
        <g class="bubble bubble-5">
          <path
            filter="url(#start-background-blur)"
            d="M144 554.5C144 615.527 91.1071 665 25.8605 665C-39.3862 665 -110 645.305 -110 584.278C-110 523.25 -39.3862 444 25.8605 444C91.1071 444 144 493.473 144 554.5Z"
            fill="#E8F3F9"
          />
        </g>
        <g class="bubble bubble-6">
          <path
            filter="url(#start-background-blur)"
            d="M129 565.231C129 612.239 89.5091 648 33.6806 648C-22.1479 648 -79 633.373 -79 586.365C-79 539.358 -47.9376 458 7.89095 458C63.7195 458 129 518.224 129 565.231Z"
            fill="#C7E0F5"
          />
        </g>
      </svg>
    </div>

    <!-- The gears and the word "Gear" form one picture. The <h1> gives the page its main heading:
         role="img" + aria-label make screen readers read it as "Gear" -->
    <h1>
      <!-- The viewBox is the area of the Figma frame around the gears and the word (x 110 to 292, y 276 to 475).
           It is 182px wide, with the middle of the screen (x 201) in its middle, so the picture lands in the same
           place as in Figma. It is wider than the Figma picture to make room for the bigger small gear -->
      <svg
        width="182"
        height="199"
        viewBox="110 276 182 199"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Gear"
      >
        <!-- Both gears together. translate(-5 0) moves the whole pair 5px to the left, so the two gears together
             look centered above the word "Gear" (the big blue gear is heavier, so the pair leaned to the right) -->
        <g transform="translate(-5 0)">
          <!-- Big gear (blue) with a pale blue hole. The <g> keeps them together, so they turn as one -->
          <g class="gear gear-big">
            <path
              class="fill-blue"
              d="M179 276H191L194.75 287.25C197.388 288.204 199.905 289.462 202.25 291L213.5 287.25L221.75 295.5L218 306.75C219.538 309.095 220.796 311.612 221.75 314.25L233 318V330L221.75 333.75C220.796 336.388 219.538 338.905 218 341.25L221.75 352.5L213.5 360.75L202.25 357C199.905 358.538 197.388 359.796 194.75 360.75L191 372H179L175.25 360.75C172.612 359.796 170.095 358.538 167.75 357L156.5 360.75L148.25 352.5L152 341.25C150.462 338.905 149.204 336.388 148.25 333.75L137 330V318L148.25 314.25C149.204 311.612 150.462 309.095 152 306.75L148.25 295.5L156.5 287.25L167.75 291C170.095 289.462 172.612 288.204 175.25 287.25L179 276Z"
            />
            <!-- The hole sits exactly in the middle of the gear (185, 324), so the gear turns without wobbling.
                 In Figma it was 2px lower (326) -->
            <path
              fill="#C7E0F5"
              d="M185 342C194.941 342 203 333.941 203 324C203 314.059 194.941 306 185 306C175.059 306 167 314.059 167 324C167 333.941 175.059 342 185 342Z"
            />
          </g>
          <!-- Small gear (grey) with a pale blue hole.
               The outer <g> makes it bigger and moves it, the inner <g> turns it. Read the transform from right to left:
               1. translate(-242.75 -368.25): move the gear's original center (242.75, 368.25) to 0,0
               2. scale(1.18): make it 18% bigger (around its own center, because that is now at 0,0)
               3. translate(253 370.2): place its center at the new spot, at the bottom right of the big gear
               The new spot is 82.2px from the big gear's center: 48 + 32.75 radius leaves about 1.5px between the teeth,
               so they almost touch but do not overlap -->
          <g transform="translate(253 370.2) scale(1.18) translate(-242.75 -368.25)">
            <g class="gear gear-small">
              <path
                class="fill-grey"
                d="M239 340.5H245L247.25 347.25C248.848 347.786 250.363 348.543 251.75 349.5L258.5 347.25L263 351.75L260.75 358.5C261.707 359.887 262.464 361.402 263 363L270.5 366V372L263.75 374.25C263.214 375.848 262.457 377.363 261.5 378.75L263.75 385.5L259.25 390L252.5 387.75C251.113 388.707 249.598 389.464 248 390L245 396H239L236.75 389.25C235.152 388.714 233.637 387.957 232.25 387L225.5 389.25L221 384.75L223.25 378C222.293 376.613 221.536 375.098 221 373.5L215 370.5V364.5L221.75 362.25C222.286 360.652 223.043 359.137 224 357.75L221.75 351L226.25 346.5L233 348.75C234.387 347.793 235.902 347.036 237.5 346.5L239 340.5Z"
              />
              <path
                fill="#C7E0F5"
                d="M242.5 378C248.299 378 253 373.299 253 367.5C253 361.701 248.299 357 242.5 357C236.701 357 232 361.701 232 367.5C232 373.299 236.701 378 242.5 378Z"
              />
            </g>
          </g>
        </g>
        <!-- The word "Gear" (navy) -->
        <path
          class="fill-navy"
          d="M149.944 474.625C149.007 474.625 147.887 474.482 146.585 474.195C145.309 473.909 143.994 473.349 142.639 472.516C141.311 471.682 140.061 470.445 138.889 468.805C137.744 467.164 136.806 465.003 136.077 462.32C135.374 459.638 135.022 456.292 135.022 452.281V428.648C135.022 424.638 135.4 421.305 136.155 418.648C136.91 415.966 137.9 413.831 139.124 412.242C140.374 410.628 141.754 409.43 143.264 408.648C144.775 407.841 146.285 407.32 147.796 407.086C149.306 406.826 150.699 406.695 151.975 406.695C155.595 406.695 158.46 407.333 160.569 408.609C162.704 409.885 164.228 411.604 165.139 413.766C166.077 415.901 166.546 418.258 166.546 420.836C166.546 422.268 166.441 423.596 166.233 424.82C166.025 426.018 165.777 427.346 165.491 428.805H157.678V425.602C157.678 418.284 155.686 414.625 151.702 414.625C149.566 414.625 148.017 415.432 147.053 417.047C146.09 418.635 145.608 421.565 145.608 425.836V455.914C145.608 460.055 146.103 462.893 147.092 464.43C148.082 465.94 149.645 466.695 151.78 466.695C154.02 466.695 155.647 465.615 156.663 463.453C157.678 461.266 158.186 458.57 158.186 455.367V446.852H152.991V440.211H167.874V474H161.311L160.217 467.633C159.28 469.482 157.9 471.109 156.077 472.516C154.254 473.922 152.21 474.625 149.944 474.625ZM174.268 451.969V441.812C174.268 437.698 174.619 434.286 175.322 431.578C176.026 428.87 176.95 426.708 178.096 425.094C179.268 423.479 180.544 422.281 181.924 421.5C183.33 420.719 184.724 420.211 186.104 419.977C187.484 419.716 188.747 419.586 189.893 419.586C192.263 419.586 194.45 420.094 196.455 421.109C198.461 422.099 200.062 423.818 201.26 426.266C202.484 428.688 203.096 432.06 203.096 436.383C203.096 438.544 202.979 440.758 202.744 443.023C202.51 445.263 202.197 447.242 201.807 448.961H184.19V454.43C184.19 459.117 184.58 462.424 185.362 464.352C186.169 466.279 187.692 467.242 189.932 467.242C191.156 467.242 192.263 466.721 193.252 465.68C194.242 464.612 194.737 462.659 194.737 459.82V457.477H202.862V459.938C202.862 465.042 201.638 468.766 199.19 471.109C196.768 473.427 193.252 474.586 188.643 474.586C184.007 474.586 180.453 472.815 177.979 469.273C175.505 465.732 174.268 459.964 174.268 451.969ZM193.877 442.32C193.929 441.747 193.968 440.888 193.994 439.742C194.02 438.57 194.033 437.633 194.033 436.93C194.033 433.362 193.656 430.81 192.901 429.273C192.145 427.737 190.947 426.956 189.307 426.93C187.562 426.93 186.273 427.815 185.44 429.586C184.606 431.331 184.19 434.521 184.19 439.156V442.32H193.877ZM219.959 444.117C220.948 443.622 222.016 443.115 223.162 442.594C224.308 442.073 225.362 441.643 226.326 441.305V434.781C226.326 433.427 226.261 432.164 226.131 430.992C226.026 429.82 225.675 428.87 225.076 428.141C224.503 427.385 223.513 427.008 222.107 427.008C220.701 427.008 219.438 427.581 218.318 428.727C217.198 429.872 216.638 431.995 216.638 435.094V437.242H209.099C208.631 435.211 208.396 433.44 208.396 431.93C208.396 427.919 209.711 424.872 212.342 422.789C214.972 420.68 218.331 419.625 222.42 419.625C225.987 419.625 228.774 420.133 230.779 421.148C232.784 422.138 234.191 423.648 234.998 425.68C235.805 427.685 236.209 430.237 236.209 433.336V474H228.592L227.888 469.391C226.847 470.901 225.467 472.151 223.748 473.141C222.029 474.13 220.037 474.625 217.771 474.625C215.427 474.625 213.5 474.026 211.99 472.828C210.48 471.63 209.347 470.055 208.592 468.102C207.862 466.122 207.498 463.974 207.498 461.656C207.498 457.229 208.552 453.714 210.662 451.109C212.771 448.479 215.87 446.148 219.959 444.117ZM222.146 467.086C222.98 467.086 223.748 466.878 224.451 466.461C225.154 466.018 225.779 465.484 226.326 464.859V447.906C225.831 448.115 225.297 448.362 224.724 448.648C224.151 448.935 223.487 449.312 222.732 449.781C221.352 450.641 220.063 451.93 218.865 453.648C217.667 455.341 217.068 457.503 217.068 460.133C217.068 462.19 217.472 463.87 218.279 465.172C219.086 466.448 220.375 467.086 222.146 467.086ZM245.65 420.211H252.876L253.736 425.68C254.803 423.648 256.053 422.125 257.486 421.109C258.918 420.094 260.376 419.586 261.861 419.586C267.408 419.586 270.181 423.076 270.181 430.055C270.181 430.94 270.051 432.112 269.79 433.57C269.53 435.003 269.217 436.266 268.853 437.359H261.978V433.18C261.978 431.018 261.652 429.56 261.001 428.805C260.35 428.023 259.543 427.633 258.579 427.633C257.355 427.633 256.34 428.596 255.533 430.523V474H245.65V420.211Z"
        />
      </svg>
    </h1>

    <!-- The tagline: 20px semibold grey, two centered lines -->
    <p class="mt-4 text-center text-xl leading-6 font-semibold text-grey">
      Jouw ontwikkeling.<br>
      Jouw regie.
    </p>

    <!-- Tap anywhere to start: this link covers the whole screen (absolute + inset), on top of everything (z-10).
         NuxtLink is Nuxt's link: it opens /pin without reloading the whole website.
         The text is only for screen readers (sr-only), the design shows no button -->
    <NuxtLink
      to="/pin"
      class="absolute inset-y-0 -inset-x-6 z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-blue"
    >
      <span class="sr-only">Tik om te starten</span>
    </NuxtLink>
  </div>
</template>

<!-- Tailwind has no classes for custom animations, so they are written here.
     "scoped" means these styles only work inside this page, not on other pages -->
<style scoped>
/* Change these three values to make the animations faster or calmer */
.start-screen {
  /* One full turn of the big gear. The small gear follows automatically */
--gear-turn-time: 18s;
--bubble-drift-time: 17s;
--bubble-distance: 6px;
}

/* ---- Rotating gears ---- */

.gear {
  /* Turn around the middle of the gear itself (its "fill-box"), not around the corner of the picture */
  transform-box: fill-box;
  transform-origin: center;
}

/* The big gear turns clockwise at a steady speed (linear), forever (infinite) */
.gear-big {
  animation: gear-turn-clockwise var(--gear-turn-time) linear infinite;
}

/* The small gear turns the other way, because the two gears touch.
   Its radius is 32.75 (27.75 x 1.18) and the big gear's is 48: 32.75/48 = 0.682,
   so it is 0.682 times as big and needs 0.682 times as long for one turn */
.gear-small {
  animation: gear-turn-counterclockwise calc(var(--gear-turn-time) * 0.682) linear infinite;
}

@keyframes gear-turn-clockwise {
  to {
    transform: rotate(360deg);
  }
}

@keyframes gear-turn-counterclockwise {
  to {
    transform: rotate(-360deg);
  }
}

/* ---- Drifting background shapes ---- */

/* Every shape drifts from its own place a few pixels away and back again (alternate), with soft easing.
   Each shape gets its own speed and direction, and a negative delay so it is already halfway on page load */
.bubble-1 {
  animation: bubble-drift-up-right calc(var(--bubble-drift-time) * 1.18) ease-in-out -3s infinite alternate;
}

.bubble-2 {
  animation: bubble-drift-up-left calc(var(--bubble-drift-time) * 0.9) ease-in-out -9s infinite alternate;
}

.bubble-3 {
  animation: bubble-drift-down-left calc(var(--bubble-drift-time) * 1.1) ease-in-out -5s infinite alternate;
}

.bubble-4 {
  animation: bubble-drift-up-right calc(var(--bubble-drift-time) * 0.86) ease-in-out -12s infinite alternate;
}

.bubble-5 {
  animation: bubble-drift-up-left calc(var(--bubble-drift-time) * 1.27) ease-in-out -7s infinite alternate;
}

.bubble-6 {
  animation: bubble-drift-down-left calc(var(--bubble-drift-time) * 1) ease-in-out -15s infinite alternate;
}

@keyframes bubble-drift-up-right {
  to {
    transform: translate(var(--bubble-distance), calc(var(--bubble-distance) * -0.7));
  }
}

@keyframes bubble-drift-up-left {
  to {
    transform: translate(calc(var(--bubble-distance) * -0.8), calc(var(--bubble-distance) * -1));
  }
}

@keyframes bubble-drift-down-left {
  to {
    transform: translate(calc(var(--bubble-distance) * -1), calc(var(--bubble-distance) * 0.6));
  }
}

/* People who turned on "reduce motion" on their phone or computer see the still design */
@media (prefers-reduced-motion: reduce) {
  .gear,
  .bubble {
    animation: none;
  }
}
</style>


