<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- NuxtLayout wraps the page in a layout from app/layouts (default.vue unless a page picks another) -->
    <NuxtLayout>
      <!-- NuxtPage shows the page from app/pages that matches the current URL -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
