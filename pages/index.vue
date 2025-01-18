<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Today's Challenge</h1>
    
    <!-- Score Card -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div class="text-center mb-6">
        <div class="inline-flex items-baseline">
          <span class="text-6xl font-bold text-blue-600">4</span>
          <span class="text-2xl text-gray-400 ml-1">/6</span>
        </div>
        <div class="text-gray-500 text-sm mt-1">points today</div>
      </div>
      
      <div class="space-y-4">
        <!-- Base Points -->
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div class="flex items-center">
            <span class="text-xl mr-3">⭐️</span>
            <span>Base Points</span>
          </div>
          <span class="font-semibold">4/4</span>
        </div>
        
        <!-- Exercise Bonus -->
        <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
          <div class="flex items-center">
            <span class="text-xl mr-3">🏃‍♂️</span>
            <span>Exercise Bonus</span>
          </div>
          <span class="font-semibold text-green-600">+1</span>
        </div>
        
        <!-- Alcohol Deduction -->
        <div class="flex items-center justify-between p-3 bg-red-50 rounded-xl">
          <div class="flex items-center">
            <span class="text-xl mr-3">🍺</span>
            <span>Alcohol</span>
          </div>
          <span class="font-semibold text-red-500">-1</span>
        </div>
      </div>
    </div>
    
    <!-- Streak Card -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-bold text-gray-800">Current Streak</h2>
          <p class="text-gray-500 text-sm">Keep it up!</p>
        </div>
        <div class="flex items-baseline">
          <span class="text-3xl font-bold text-blue-600">3</span>
          <span class="text-gray-500 ml-1">days</span>
        </div>
      </div>
    </div>
  </div>
</template> 