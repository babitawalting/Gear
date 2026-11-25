<!-- app/components/shared/PageBackground.vue
     The soft blue shapes behind every page, copied from the Figma file "Background Gear" (402 x 874).
     It is shown once in app/layouts/default.vue, so pages never add it themselves.
     A page can hide it with definePageMeta({ pageBackground: false }) (the start and PIN screens have their own background).

     Phones have different heights, so the drawing is cut into three parts instead of one big picture:
     - the top shapes stick to the top of the screen
     - the middle shapes start at 35% of the screen height (where they are in Figma: 304 of 874px)
     - the bottom shapes stick to the bottom of the screen
     Each part stays 402px wide and centered, so on narrower phones the sides are cut off evenly.

     The three light blues (#DEEEF9, #C7E0F5, #E8F3F9) are only used for these shapes,
     so they are written here instead of being added to the shared colors in main.css. -->
<template>
  <!-- fixed: the shapes stay in place while the page scrolls.
       left-1/2 + -translate-x-1/2 + max-w-[402px]: the same phone-width column as the layout.
       -z-10 puts it behind the content, overflow-hidden cuts off the parts of the shapes outside the screen.
       aria-hidden: it is decoration only -->
  <div
    class="pointer-events-none fixed inset-y-0 left-1/2 -z-10 w-full max-w-[402px] -translate-x-1/2 overflow-hidden"
    aria-hidden="true"
  >
    <!-- Top shapes. The viewBox shows the top 270px of the Figma frame -->
    <svg
      class="absolute top-0 left-1/2 -translate-x-1/2"
      width="402"
      height="270"
      viewBox="0 0 402 270"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M448 86.5C448 162.991 403.171 264.5 319.5 264.5C79.5 191 -20.5 266.991 -20.5 190.5C-20.5 114.009 212.829 -52 296.5 -52C380.171 -52 448 10.0086 448 86.5Z"
        fill="#DEEEF9"
      />
      <path
        d="M463.999 80C463.999 152.902 390.947 243 307 243C107.501 175 -49.5 269.5 1.50006 164C134.5 31 228.052 -52 311.999 -52C395.947 -52 463.999 7.09841 463.999 80Z"
        fill="#C7E0F5"
      />
    </svg>

    <!-- Middle shapes. The viewBox shows y 300 to 650 of the Figma frame -->
    <svg
      class="absolute top-[35%] left-1/2 -translate-x-1/2"
      width="402"
      height="350"
      viewBox="0 300 402 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M455.5 605.5C454.141 672.638 213.098 543 32.9489 580.5C-147.2 618 -77.7849 492.186 -77.7849 411C-77.7849 329.814 70.0984 304.5 172.33 304.5C398.205 343 415.283 475.5 455.5 605.5Z"
        fill="#DEEEF9"
      />
      <path
        d="M448.163 562.942C533.771 698.5 152.5 475 32.1848 569.5C-71.2609 569.5 -61.4676 506.432 -61.4676 436.722C-61.4676 367.013 70.0798 322.5 173.525 322.5C322.91 322.5 414.839 498 448.163 562.942Z"
        fill="#C7E0F5"
      />
    </svg>

    <!-- Bottom shapes. The viewBox shows the bottom 238px of the Figma frame (y 636 to 874) -->
    <svg
      class="absolute bottom-0 left-1/2 -translate-x-1/2"
      width="402"
      height="238"
      viewBox="0 636 402 238"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M448 825C448 915.022 352.189 988 234 988C115.811 988 -118.5 929.522 -118.5 839.5C-118.5 839.5 115.811 662 234 662C352.189 662 448 734.978 448 825Z"
        fill="#E8F3F9"
      />
      <path
        d="M465.816 935.721C543.882 1059.99 271.928 904.779 178.556 935.721C86.691 935.721 -30 909.99 -30 837.5C-30 765.01 175.135 683 267 683C358.865 683 477 793.5 465.816 935.721Z"
        fill="#C7E0F5"
      />
    </svg>
  </div>
</template>
