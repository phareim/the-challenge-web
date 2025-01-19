<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
    <!-- Loading state -->
    <div v-if="!authInitialized" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>

    <!-- Main content -->
    <template v-else>
      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto pb-20">
        <NuxtPage />
      </main>

      <!-- Bottom navigation -->
      <div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <nav class="flex justify-around p-2">
          <NuxtLink 
            to="/activity" 
            class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
            :class="{ 
              'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400': $route.path !== '/activity',
              'text-blue-600 dark:text-blue-400 scale-110 font-medium': $route.path === '/activity'
            }"
          >
            <span class="text-xl mb-1 transition-transform" :class="{ 'scale-110': $route.path === '/activity' }">📝</span>
            <span class="text-sm">Log</span>
          </NuxtLink>
          <NuxtLink 
            to="/explore" 
            class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
            :class="{ 
              'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400': $route.path !== '/explore',
              'text-blue-600 dark:text-blue-400 scale-110 font-medium': $route.path === '/explore'
            }"
          >
            <span class="text-xl mb-1 transition-transform" :class="{ 'scale-110': $route.path === '/explore' }">📊</span>
            <span class="text-sm">Explore</span>
          </NuxtLink>
          <NuxtLink 
            to="/profile" 
            class="flex flex-col items-center p-2 rounded-xl transition-all duration-200"
            :class="{ 
              'text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400': $route.path !== '/profile',
              'text-blue-600 dark:text-blue-400 scale-110 font-medium': $route.path === '/profile'
            }"
          >
            <span class="text-xl mb-1 transition-transform" :class="{ 'scale-110': $route.path === '/profile' }">👤</span>
            <span class="text-sm">Profile</span>
          </NuxtLink>
        </nav>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { user, authInitialized } = useFirebaseAuth()
const router = useRouter()
const route = useRoute()

// Watch for auth initialization and user state
watch([() => authInitialized.value, () => user.value], ([initialized, currentUser]) => {
  if (!initialized) return
  
  // Only redirect to login if we're sure the user isn't authenticated
  if (!currentUser && !route.path.startsWith('/login') && initialized) {
    router.push('/login')
  } else if (currentUser && route.path === '/') {
    // Only redirect to activity if we're on the root path
    router.push('/activity')
  }
}, { immediate: true })
</script>

<style>
html, body {
  @apply text-gray-700 dark:text-gray-300;
  -webkit-tap-highlight-color: transparent;
}

.router-link-active {
  @apply text-blue-600 dark:text-blue-400;
}

/* Smooth scrolling */
* {
  scroll-behavior: smooth;
}

/* Better tap states */
@media (hover: hover) {
  .hover\:scale-110:hover {
    transform: scale(1.1);
  }
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
