<script setup lang="ts">
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'

interface ActivityScore {
  badMeals: number
  alcohol: number
  snacks: number
  exercise: boolean
  greens: boolean
}

interface Activity {
  date: string
  score: ActivityScore
  userId: string
  updatedAt: Date
}

definePageMeta({
  middleware: ['auth']
})

const { getAllUsers } = useFirestore()
const loading = ref(true)
const error = ref('')
const leaderboard = ref<any[]>([])

// Calculate score for an activity
const calculateScore = (score: ActivityScore) => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
}

// Get current month's data
const getCurrentMonthData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Get all users
    const users = await getAllUsers()
    
    // Get current month bounds
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    // Process each user's activities
    const userScores = await Promise.all(users.map(async user => {
      try {
        // Get user's activities
        const activitiesRef = collection(getFirestore(), 'users', user.id, 'activities')
        const activitiesSnapshot = await getDocs(activitiesRef)
        const activities = activitiesSnapshot.docs.map(doc => ({
          date: doc.id,
          ...doc.data()
        } as Activity))

        // Filter for current month and calculate stats
        const monthActivities = activities.filter(activity => {
          const date = new Date(activity.date)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })

        const totalPoints = monthActivities.reduce((sum, activity) => 
          sum + calculateScore(activity.score), 0)

        const exerciseDays = monthActivities.filter(a => a.score.exercise).length
        const greensDays = monthActivities.filter(a => a.score.greens).length

        return {
          id: user.id,
          name: user.name,
          photoURL: user.photoURL,
          goal: user.goal,
          totalPoints,
          totalDays: monthActivities.length,
          exerciseDays,
          greensDays
        }
      } catch (e) {
        console.error(`Error processing user ${user.id}:`, e)
        return null
      }
    }))

    // Filter out errors and sort by points
    leaderboard.value = userScores
      .filter(score => score !== null && score.totalPoints > 0)
      .sort((a, b) => b!.totalPoints - a!.totalPoints)

  } catch (e) {
    error.value = 'Failed to load leaderboard'
    console.error('Error loading leaderboard:', e)
  } finally {
    loading.value = false
  }
}

// Get current month name
const currentMonth = computed(() => {
  return new Date().toLocaleString('default', { month: 'long' })
})

// Load data on mount
onMounted(() => {
  getCurrentMonthData()
})
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
      {{ currentMonth }} Leaderboard
    </h1>

    <div v-if="loading" class="py-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 dark:text-red-400 mb-4">{{ error }}</div>
      <button 
        @click="getCurrentMonthData"
        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="leaderboard.length" class="space-y-4">
      <!-- Leaderboard entries -->
      <div 
        v-for="(user, index) in leaderboard" 
        :key="user.id"
        class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <!-- Rank and User info in one line -->
          <div class="flex items-center flex-1 min-w-0">
            <!-- Rank -->
            <div class="text-2xl font-bold shrink-0 mr-4" :class="{
              'text-yellow-500': index === 0,
              'text-gray-400': index === 1,
              'text-amber-600': index === 2,
              'text-gray-500 dark:text-gray-400': index > 2
            }">
              #{{ index + 1 }}
            </div>

            <!-- User info -->
            <div class="flex items-center min-w-0">
              <img 
                v-if="user.photoURL"
                :src="user.photoURL"
                :alt="user.name"
                class="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm shrink-0"
              />
              <div 
                v-else
                class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg font-bold text-blue-600 dark:text-blue-300 shrink-0"
              >
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="ml-3 truncate">
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
                <div v-if="user.goal" class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ user.goal }}</div>
                <div v-else class="text-sm text-gray-400 dark:text-gray-500 italic">No health goal set</div>
              </div>
            </div>
          </div>

          <!-- Stats section -->
          <div class="flex items-center justify-end w-full md:w-auto space-x-4 mt-3 pt-2 border-t md:border-t-0 md:mt-0 md:pt-0 border-gray-100 dark:border-gray-700">
            <div class="text-center">
              <div class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ user.totalPoints }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Points</div>
            </div>
            <div class="text-center">
              <div class="text-lg text-green-600 dark:text-green-400">{{ user.exerciseDays }} 🏃‍♂️</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Exercise</div>
            </div>
            <div class="text-center">
              <div class="text-lg text-green-600 dark:text-green-400">{{ user.greensDays }} 🥬</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Greens</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">
      No data available for this month yet
    </div>
  </div>
</template> 