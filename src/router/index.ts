/*
  router/index.ts

  Purpose:
  Defines the navigation routes used throughout the weather application.
  It connects URL paths to the appropriate Vue pages, including the
  weather home page, weather detail page, and user profile page.
*/

import { createRouter, createWebHistory } from 'vue-router'

// Creates the application's Vue Router instance.
const router = createRouter({
  // Uses browser history so routes appear as normal URLs
  // without a hash (#) in the address.
  history: createWebHistory(import.meta.env.BASE_URL),

  // Defines all pages that users can navigate to in the application.
  routes: [
    {
      // Home page containing the saved weather location cards.
      path: '/',
      name: 'weather-list',

      // Lazy-loads the page only when the route is visited.
      component: () => import('@/pages/WeatherListPage.vue'),
    },
    {
      // Weather detail page for a selected location.
      // Latitude and longitude are included as dynamic URL parameters.
      path: '/weather/:lat/:lon',
      name: 'weather-detail',

      // Lazy-loads the weather detail page when required.
      component: () => import('@/pages/WeatherDetailPage.vue'),
    },
    {
      // User profile page.
      path: '/profile',
      name: 'profile',

      // Lazy-loads the profile page when required.
      component: () => import('@/pages/ProfilePage.vue'),
    },
  ],
})

// Exports the router so it can be registered
// with the main Vue application.
export default router
