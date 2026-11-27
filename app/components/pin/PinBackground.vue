<!-- app/components/pin/PinBackground.vue
     The soft blue shapes behind the PIN screen, copied from the Figma design (402 x 874).
     The two blues (#E8F3F9 and #C7E0F5) are only used here, so they are written in this file
     instead of being added to the shared colors in main.css.
     Put it inside a parent with `relative`: it fills that parent and stays behind the content.
     Screens can be taller than the Figma frame (a laptop or a big phone), so the drawing is cut into two pictures:
     the shapes around the keypad stay at the top, the bottom right shapes stick to the bottom of the screen.
     With one 874px picture the shapes would stop in a straight line on a taller screen.
     Usage: <PinBackground /> -->
<template>
  <!-- -inset-x-6 stretches it over the 24px side margins of the layout, so the shapes reach the edges of the column.
       -z-10 puts it behind the content, overflow-hidden cuts off the parts of the shapes outside the screen -->
  <div class="pointer-events-none absolute inset-y-0 -inset-x-6 -z-10 overflow-hidden" aria-hidden="true">
    <!-- 1. Bottom right shapes (y 700 to 874 of the Figma frame).
            top-[max(700px,calc(100%-174px))]: the picture starts at 700px, where it is in Figma.
            On a screen taller than 874px, 100% - 174px is bigger than 700px, so the picture moves down and
            sticks to the bottom of the screen. The shapes go on below the screen, so there is never a hard edge -->
    <svg
      class="absolute top-[max(700px,calc(100%-174px))] left-0"
      width="402"
      height="174"
      viewBox="0 700 402 174"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- The blur is defined in the second picture below: an id works for the whole page -->
      <g filter="url(#pin-background-blur)">
        <path
          d="M478 856.5C478 923.05 424.066 977 357.535 977C291.004 977 219 955.523 219 888.972C219 822.422 291.004 736 357.535 736C424.066 736 478 789.95 478 856.5Z"
          fill="#E8F3F9"
        />
        <path
          d="M478 860.021C478 916.416 427.841 962.133 365.967 962.133C304.094 962.133 241.085 944.585 241.085 888.19C241.085 831.795 304.094 757.909 365.967 757.909C427.841 757.909 478 803.626 478 860.021Z"
          fill="#C7E0F5"
        />
      </g>
    </svg>

    <!-- 2. The shapes at the top left and behind the keypad (y 0 to 700 of the Figma frame). They stay at the top,
            in the same place as in Figma, because the keypad is placed from the top too -->
    <svg
      class="absolute top-0 left-0"
      width="402"
      height="700"
      viewBox="0 0 402 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!-- A small blur (2.5px) gives the shapes their soft edges, as in Figma -->
        <filter id="pin-background-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <g filter="url(#pin-background-blur)">
        <!-- Top left -->
        <path
          d="M137 19C137 58.2122 96.9856 90 47.6254 90C-1.73479 90 -52 77.7984 -52 38.5862C-52 -0.626011 -1.73479 -52 47.6254 -52C96.9856 -52 137 -20.2122 137 19Z"
          fill="#C7E0F5"
        />
        <!-- The big shape behind the keypad -->
        <path
          d="M464.372 185.649C509.631 250.388 410.002 583.191 307.923 654.555C205.844 725.919 -44.7927 564.398 -90.0516 499.66C-135.31 434.921 -89.2484 324.589 12.8308 253.225C114.91 181.861 419.113 120.911 464.372 185.649Z"
          fill="#E8F3F9"
        />
        <path
          d="M401.969 232.501C441.598 289.186 372.702 567.771 291.708 624.394C210.714 681.017 -1.14499 534.274 -40.7741 477.589C-80.4032 420.903 -46.8703 329.048 34.1237 272.425C115.118 215.802 362.34 175.815 401.969 232.501Z"
          fill="#C7E0F5"
        />
      </g>
    </svg>
  </div>
</template>
