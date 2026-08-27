<!--
  App.vue

  Purpose:
  Acts as the root component of the weather application.
  RouterView displays the page that matches the current URL,
  allowing Vue Router to switch between the weather list,
  weather detail, and profile pages.
-->

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Displays the component associated with the current route. -->
  <RouterView />
</template>
