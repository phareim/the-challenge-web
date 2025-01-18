<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
    <!-- Main content area -->
    <main class="flex-1 overflow-y-auto pb-20">
      <NuxtPage />
    </main>

    <!-- Bottom navigation -->
    <nav class="fixed bottom-0 left-0 right-0">
      <div class="mx-4 mb-4">
        <div class="flex justify-around items-center h-16 bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-lg bg-opacity-90">
          <NuxtLink to="/" class="flex flex-col items-center px-4 py-2 transition-all duration-200 hover:scale-110" active-class="text-blue-600 font-medium">
            <i class="i-heroicons-chart-bar text-2xl mb-0.5" />
            <span class="text-xs">Score</span>
          </NuxtLink>
          
          <NuxtLink to="/explore" class="flex flex-col items-center px-4 py-2 transition-all duration-200 hover:scale-110" active-class="text-blue-600 font-medium">
            <i class="i-heroicons-trophy text-2xl mb-0.5" />
            <span class="text-xs">Leaderboard</span>
          </NuxtLink>
          
          <NuxtLink to="/activity" class="flex flex-col items-center px-4 py-2 transition-all duration-200 hover:scale-110" active-class="text-blue-600 font-medium">
            <div class="relative -mt-8">
              <div class="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-20"></div>
              <div class="relative bg-blue-600 text-white p-4 rounded-full shadow-lg">
                <i class="i-heroicons-plus text-2xl" />
              </div>
            </div>
            <span class="text-xs mt-1">Log</span>
          </NuxtLink>
          
          <NuxtLink to="/profile" class="flex flex-col items-center px-4 py-2 transition-all duration-200 hover:scale-110" active-class="text-blue-600 font-medium">
            <i class="i-heroicons-user text-2xl mb-0.5" />
            <span class="text-xs">Profile</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

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
</style>
