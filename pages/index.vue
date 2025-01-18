<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Today's Score</h1>
    <div class="bg-white rounded-lg p-6 shadow-sm">
      <div class="text-center mb-4">
        <span class="text-5xl font-bold text-blue-500">4</span>
        <span class="text-xl">/6</span>
      </div>
      
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span>Base Points</span>
          <span class="font-bold">4/4</span>
        </div>
        <div class="flex justify-between items-center text-green-600">
          <span>Exercise Bonus</span>
          <span class="font-bold">+1</span>
        </div>
        <div class="flex justify-between items-center text-red-500">
          <span>Alcohol (-1)</span>
          <span class="font-bold">-1</span>
        </div>
      </div>
    </div>
  </div>
</template> 