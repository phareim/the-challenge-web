<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Leaderboard</h1>
    
    <!-- Weekly Stats -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div class="text-center mb-6">
        <div class="text-sm text-gray-500 mb-1">This Week's Score</div>
        <div class="inline-flex items-baseline">
          <span class="text-5xl font-bold text-blue-600">28</span>
          <span class="text-xl text-gray-400 ml-1">/42</span>
        </div>
      </div>
      
      <div class="flex justify-between text-center">
        <div>
          <div class="text-sm text-gray-500">Rank</div>
          <div class="font-bold text-xl text-gray-800">#1</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Streak</div>
          <div class="font-bold text-xl text-gray-800">3 🔥</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Perfect Days</div>
          <div class="font-bold text-xl text-gray-800">2 ⭐️</div>
        </div>
      </div>
    </div>
    
    <!-- Leaderboard List -->
    <div class="space-y-3">
      <!-- First Place -->
      <div class="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-4 shadow-sm border border-amber-200 flex items-center">
        <div class="text-2xl mr-4">🥇</div>
        <div class="flex-1">
          <div class="font-semibold">You</div>
          <div class="text-sm text-gray-600">3 day streak</div>
        </div>
        <div class="text-xl font-bold text-amber-600">28</div>
      </div>
      
      <!-- Second Place -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
        <div class="text-2xl mr-4">🥈</div>
        <div class="flex-1">
          <div class="font-semibold">John</div>
          <div class="text-sm text-gray-600">1 day streak</div>
        </div>
        <div class="text-xl font-bold text-gray-600">24</div>
      </div>
      
      <!-- Third Place -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center">
        <div class="text-2xl mr-4">🥉</div>
        <div class="flex-1">
          <div class="font-semibold">Sarah</div>
          <div class="text-sm text-gray-600">2 day streak</div>
        </div>
        <div class="text-xl font-bold text-gray-600">21</div>
      </div>
    </div>
  </div>
</template> 