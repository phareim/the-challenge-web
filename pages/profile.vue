<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const { user, authInitialized, signOutUser } = useFirebaseAuth()
const { getUserProfile, getAllActivities, updateUserProfile } = useFirestore()
const router = useRouter()

const profile = ref<any>(null)
const activities = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const isEditingGoal = ref(false)
const editedGoal = ref('')
const savingGoal = ref(false)

// Calculate statistics
const stats = computed(() => {
  if (!activities.value.length) return null

  const totalDays = activities.value.length
  const perfectDays = activities.value.filter(a => {
    const score = calculateScore(a.score)
    return score >= 6
  }).length

  const averageScore = activities.value.reduce((sum, a) => {
    return sum + calculateScore(a.score)
  }, 0) / totalDays

  const streakData = calculateStreak(activities.value)

  return {
    totalDays,
    perfectDays,
    averageScore: averageScore.toFixed(1),
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak
  }
})

// Helper function to calculate score
const calculateScore = (score: any) => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
}

// Helper function to calculate streaks
const calculateStreak = (activities: any[]) => {
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let currentStreak = 0
  let longestStreak = 0
  let currentCount = 0

  for (let i = 0; i < sortedActivities.length; i++) {
    const score = calculateScore(sortedActivities[i].score)
    if (score >= 4) {
      currentCount++
      longestStreak = Math.max(longestStreak, currentCount)
      
      // Only count in current streak if it's consecutive days
      if (i === 0 || isConsecutiveDay(sortedActivities[i-1].date, sortedActivities[i].date)) {
        currentStreak = currentCount
      } else {
        currentStreak = 1
      }
    } else {
      currentCount = 0
      if (i === 0) currentStreak = 0
    }
  }

  return { currentStreak, longestStreak }
}

// Helper function to check if two dates are consecutive
const isConsecutiveDay = (date1: string, date2: string) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// Load user profile and activities
const loadData = async () => {
  if (!user.value?.uid) return
  
  loading.value = true
  error.value = ''
  
  try {
    const [profileData, activitiesData] = await Promise.all([
      getUserProfile(user.value.uid),
      getAllActivities()
    ])
    profile.value = profileData
    activities.value = activitiesData
  } catch (e) {
    error.value = 'Failed to load data'
    console.error('Error loading data:', e)
  } finally {
    loading.value = false
  }
}

const startEditingGoal = () => {
  editedGoal.value = profile.value.goal || ''
  isEditingGoal.value = true
}

const saveGoal = async () => {
  if (!user.value?.uid || savingGoal.value) return
  
  savingGoal.value = true
  try {
    await updateUserProfile(user.value.uid, { goal: editedGoal.value })
    profile.value.goal = editedGoal.value
    isEditingGoal.value = false
  } catch (e) {
    console.error('Error saving goal:', e)
  } finally {
    savingGoal.value = false
  }
}

const cancelEditGoal = () => {
  isEditingGoal.value = false
  editedGoal.value = ''
}

// Add sign out handler
const handleSignOut = async () => {
  try {
    await signOutUser()
    navigateTo('/login')
  } catch (error) {
    console.error('Failed to sign out:', error)
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <div class="flex items-center justify-between mb-6">
      <NuxtLink 
        to="/activity"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
      >
        ← Back to Activity
      </NuxtLink>
      
      <h1 class="text-2xl font-bold text-gray-800">Profile</h1>
      
      <div class="w-8"></div> <!-- Spacer for alignment -->
    </div>

    <div v-if="loading" class="py-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button 
        @click="loadData"
        class="text-blue-600 hover:text-blue-800"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="profile" class="space-y-6">
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <div class="mb-4">
          <img 
            v-if="profile.photoURL"
            :src="profile.photoURL"
            :alt="profile.name"
            class="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md"
          />
          <div 
            v-else
            class="w-24 h-24 rounded-full mx-auto bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600"
          >
            {{ profile.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-900">{{ profile.name }}</h2>
        <p v-if="profile.email" class="text-gray-500 text-sm mt-1">{{ profile.email }}</p>
      </div>

      <!-- Statistics -->
      <div v-if="stats" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 class="font-bold text-gray-800 mb-4">Your Progress</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">Current Streak</div>
            <div class="font-bold text-xl text-blue-600">{{ stats.currentStreak }} 🔥</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">Longest Streak</div>
            <div class="font-bold text-xl text-blue-600">{{ stats.longestStreak }} 🏆</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">Perfect Days</div>
            <div class="font-bold text-xl text-green-600">{{ stats.perfectDays }} ⭐️</div>
          </div>
          <div class="bg-gray-50 rounded-xl p-3 text-center">
            <div class="text-sm text-gray-500">Average Score</div>
            <div class="font-bold text-xl text-blue-600">{{ stats.averageScore }}</div>
          </div>
        </div>
      </div>

      <!-- Health Goal -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold text-gray-800">Health Goal</h3>
          <button 
            v-if="!isEditingGoal"
            @click="startEditingGoal"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
        
        <div v-if="isEditingGoal">
          <textarea
            v-model="editedGoal"
            class="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="What's your health goal?"
          ></textarea>
          <div class="flex justify-end space-x-2">
            <button 
              @click="cancelEditGoal"
              class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="saveGoal"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              :disabled="savingGoal"
            >
              {{ savingGoal ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
        <p v-else-if="profile.goal" class="text-gray-600">{{ profile.goal }}</p>
        <p v-else class="text-gray-400 italic">No health goal set</p>
      </div>

      <!-- Account Info -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 class="font-bold text-gray-800 mb-4">Account Information</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-600">
            <span>Member since</span>
            <span>{{ new Date(profile.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Last updated</span>
            <span>{{ new Date(profile.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) }}</span>
          </div>
        </div>
        
        <!-- Sign Out Button -->
        <div class="mt-6 pt-4 border-t border-gray-100">
          <button 
            @click="handleSignOut"
            class="w-full px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom checkbox styles */
[type="checkbox"] {
  @apply w-5 h-5 border-gray-300;
}
</style> 