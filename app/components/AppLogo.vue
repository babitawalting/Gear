<!-- app/components/AppLogo.vue
     Gear logo: a big blue gear, a small grey gear and the word "Gear".
     Built from the gear icon until there is an SVG of the real logo. -->
<template>
  <span class="flex items-center gap-1 text-2xl font-semibold text-navy">
    <span class="relative size-8" aria-hidden="true">
      <AppIcon name="gear" class="absolute left-0 top-0 size-6 text-blue" />
      <AppIcon name="gear" class="absolute bottom-0 right-0 size-4 text-grey" />
    </span>
    Gear
  </span>
</template>
