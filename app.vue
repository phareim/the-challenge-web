<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main content area with proper padding for bottom nav -->
    <main class="flex-1 overflow-y-auto pb-16">
      <NuxtPage />
    </main>

    <!-- Bottom navigation -->
    <nav class="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <div class="flex justify-around items-center h-16">
        <NuxtLink to="/" class="flex flex-col items-center px-4 py-2" active-class="text-blue-500">
          <i class="i-heroicons-chart-bar text-xl" />
          <span class="text-xs">Score</span>
        </NuxtLink>
        
        <NuxtLink to="/explore" class="flex flex-col items-center px-4 py-2" active-class="text-blue-500">
          <i class="i-heroicons-trophy text-xl" />
          <span class="text-xs">Leaderboard</span>
        </NuxtLink>
        
        <NuxtLink to="/activity" class="flex flex-col items-center px-4 py-2" active-class="text-blue-500">
          <i class="i-heroicons-plus-circle text-xl" />
          <span class="text-xs">Log Points</span>
        </NuxtLink>
        
        <NuxtLink to="/profile" class="flex flex-col items-center px-4 py-2" active-class="text-blue-500">
          <i class="i-heroicons-user text-xl" />
          <span class="text-xs">Profile</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<style>
html, body {
  @apply bg-gray-50;
  -webkit-tap-highlight-color: transparent;
}

.router-link-active {
  @apply text-blue-500;
}
</style>
