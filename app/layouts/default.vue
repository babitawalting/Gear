<!-- app/layouts/default.vue
     A layout is the frame around every page. Nuxt uses "default" automatically.
     <slot /> is where the page itself is shown. -->
<template>
  <div class="mx-auto min-h-screen max-w-md pb-24">
    <AppNavbar />
    <slot />
    <AppBottomNav />
  </div>
</template>
