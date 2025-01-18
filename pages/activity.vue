<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Log Points</h1>
    <div class="space-y-4">
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h2 class="font-bold mb-4">Base Points</h2>
        <div class="space-y-2">
          <button class="w-full p-2 border rounded-lg text-left hover:bg-gray-50">
            🍽️ Bad Meal (-1)
          </button>
          <button class="w-full p-2 border rounded-lg text-left hover:bg-gray-50">
            🍺 Alcohol (-1)
          </button>
          <button class="w-full p-2 border rounded-lg text-left hover:bg-gray-50">
            🍪 Snacks (-1)
          </button>
        </div>
      </div>
      
      <div class="bg-white rounded-lg p-4 shadow-sm">
        <h2 class="font-bold mb-4">Bonus Points</h2>
        <div class="space-y-2">
          <button class="w-full p-2 border rounded-lg text-left hover:bg-gray-50">
            🏃‍♂️ Exercise (+1)
          </button>
          <button class="w-full p-2 border rounded-lg text-left hover:bg-gray-50">
            🥬 Greens (+1)
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 