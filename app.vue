<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
    <!-- Loading state -->
    <div v-if="!authInitialized" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading...</p>
      </div>
    </div>

    <!-- Main content -->
    <template v-else>
      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto pb-20">
        <NuxtPage />
      </main>

      <!-- Bottom navigation -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <nav class="flex justify-around p-2">
          <NuxtLink 
            to="/activity" 
            class="flex flex-col items-center p-2 text-sm text-gray-600 hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/activity' }"
          >
            <span class="text-xl mb-1">📝</span>
            <span>Log</span>
          </NuxtLink>
          <NuxtLink 
            to="/explore" 
            class="flex flex-col items-center p-2 text-sm text-gray-600 hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/explore' }"
          >
            <span class="text-xl mb-1">📊</span>
            <span>Explore</span>
          </NuxtLink>
          <NuxtLink 
            to="/profile" 
            class="flex flex-col items-center p-2 text-sm text-gray-600 hover:text-blue-600"
            :class="{ 'text-blue-600': $route.path === '/profile' }"
          >
            <span class="text-xl mb-1">👤</span>
            <span>Profile</span>
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
  @apply text-gray-700;
  -webkit-tap-highlight-color: transparent;
}

.router-link-active {
  @apply text-blue-600;
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
