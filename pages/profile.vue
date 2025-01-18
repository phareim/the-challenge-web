<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Profile</h1>
    <div class="bg-white rounded-lg p-4 shadow-sm">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Name</label>
          <input type="text" class="w-full p-2 border rounded-lg" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input type="email" class="w-full p-2 border rounded-lg" />
        </div>
        
        <button class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  </div>
</template> 