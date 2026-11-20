<!-- app/components/pin/PinBackground.vue
     The soft blue shapes behind the PIN screen, copied from the Figma design (402 x 874).
     The two blues (#E8F3F9 and #C7E0F5) are only used here, so they are written in this file
     instead of being added to the shared colors in main.css.
     Put it inside a parent with `relative`: it fills that parent and stays behind the content.
     Usage: <PinBackground /> -->
<template>
  <!-- -inset-x-6 stretches it over the 24px side margins of the layout, so the shapes reach the edges of the column.
       -z-10 puts it behind the content, overflow-hidden cuts off the parts of the shapes outside the screen -->
  <div class="pointer-events-none absolute inset-y-0 -inset-x-6 -z-10 overflow-hidden" aria-hidden="true">
    <svg
      class="absolute top-0 left-0"
      width="402"
      height="874"
      viewBox="0 0 402 874"
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
        <!-- Bottom right -->
        <path
          d="M478 856.5C478 923.05 424.066 977 357.535 977C291.004 977 219 955.523 219 888.972C219 822.422 291.004 736 357.535 736C424.066 736 478 789.95 478 856.5Z"
          fill="#E8F3F9"
        />
        <path
          d="M478 860.021C478 916.416 427.841 962.133 365.967 962.133C304.094 962.133 241.085 944.585 241.085 888.19C241.085 831.795 304.094 757.909 365.967 757.909C427.841 757.909 478 803.626 478 860.021Z"
          fill="#C7E0F5"
        />
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
