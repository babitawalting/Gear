<!-- app/layouts/default.vue -->
<!-- A layout wraps every page. Nuxt puts the current page where <slot /> is. -->
<template>
  <div class="min-h-screen bg-white">
    <!-- One phone-width column (402px, the Figma frame) with 24px side margins -->
    <main class="mx-auto min-h-screen w-full max-w-[402px] px-6 md:border-x md:border-sand">
      <slot />
    </main>
  </div>
</template>
