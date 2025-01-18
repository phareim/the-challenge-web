<script setup lang="ts">
import type { User } from '~/types/user'
import { useUserService } from '~/services/userService'

const userService = useUserService()
const user = ref<User | null>(null)
const loading = ref(true)
const formData = ref({
  displayName: '',
  email: '',
  notifications: {
    dailyReminders: false,
    weeklySummary: false
  }
})

// Load user data
onMounted(async () => {
  try {
    const userData = await userService.getCurrentUser()
    user.value = userData
    // Initialize form data
    formData.value = {
      displayName: userData.displayName,
      email: userData.settings.email || '',
      notifications: {
        dailyReminders: userData.settings.notifications.dailyReminders,
        weeklySummary: userData.settings.notifications.weeklySummary
      }
    }
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
})

const saveChanges = async () => {
  if (!user.value) return
  
  try {
    await userService.updateUser({
      displayName: formData.value.displayName,
      settings: {
        ...user.value.settings,
        email: formData.value.email,
        notifications: formData.value.notifications
      }
    })
    // Could add a success message here
  } catch (error) {
    console.error('Failed to update user:', error)
    // Could add error handling here
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Profile</h1>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    
    <template v-else-if="user">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div class="flex items-center mb-6">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
            {{ user.initials }}
          </div>
          <div>
            <h2 class="font-bold text-xl">{{ user.displayName }}</h2>
            <p class="text-gray-500">Joined {{ user.joinedDate }}</p>
          </div>
        </div>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">All-time Score</div>
            <div class="font-bold text-xl">{{ user.stats.allTimeScore }}</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">Perfect Days</div>
            <div class="font-bold text-xl">{{ user.stats.perfectDays }} ⭐️</div>
          </div>
        </div>
      </div>
      
      <!-- Settings -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 class="font-bold text-lg mb-4">Settings</h2>
        <form @submit.prevent="saveChanges" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input 
              v-model="formData.displayName"
              type="text" 
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              v-model="formData.email"
              type="email" 
              class="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notifications</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  v-model="formData.notifications.dailyReminders"
                  type="checkbox" 
                  class="rounded text-blue-600 focus:ring-blue-500 mr-2" 
                />
                <span>Daily reminders</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="formData.notifications.weeklySummary"
                  type="checkbox" 
                  class="rounded text-blue-600 focus:ring-blue-500 mr-2" 
                />
                <span>Weekly summary</span>
              </label>
            </div>
          </div>
          
          <button 
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>
    </template>
  </div>
</template>

<style>
/* Custom checkbox styles */
[type="checkbox"] {
  @apply w-5 h-5 border-gray-300;
}
</style> 