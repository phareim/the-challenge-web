<script setup lang="ts">
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth']
})

const { getAllActivities } = useFirestore()
const loading = ref(true)
const error = ref('')
const activities = ref<any[]>([])
const router = useRouter()

// Process activities for visualization
const processedActivities = computed(() => {
  if (!activities.value.length) return null

  // Sort activities by date
  const sorted = [...activities.value].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  // Calculate daily scores
  const dailyScores = sorted.map(activity => ({
    date: activity.date,
    score: calculateScore(activity.score),
    details: activity.score
  }))

  // Calculate trends
  const trends = {
    badMeals: calculateAverage(sorted.map(a => a.score.badMeals)),
    alcohol: calculateAverage(sorted.map(a => a.score.alcohol)),
    snacks: calculateAverage(sorted.map(a => a.score.snacks)),
    exercise: calculatePercentage(sorted.map(a => a.score.exercise)),
    greens: calculatePercentage(sorted.map(a => a.score.greens))
  }

  return {
    dailyScores,
    trends
  }
})

// Helper function to calculate score
const calculateScore = (score: any) => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
}

// Helper function to calculate average
const calculateAverage = (numbers: number[]) => {
  if (!numbers.length) return 0
  return (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(1)
}

// Helper function to calculate percentage
const calculatePercentage = (booleans: boolean[]) => {
  if (!booleans.length) return 0
  return ((booleans.filter(Boolean).length / booleans.length) * 100).toFixed(0)
}

// Get score color based on value
const getScoreColor = (score: number) => {
  if (score >= 6) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  if (score >= 4) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
  return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const navigateToDay = (date: string) => {
  router.push(`/activity?date=${date}`)
}

// Load activities
const loadActivities = async () => {
  loading.value = true
  error.value = ''
  
  try {
    activities.value = await getAllActivities()
  } catch (e) {
    error.value = 'Failed to load activities'
    console.error('Error loading activities:', e)
  } finally {
    loading.value = false
  }
}

// Load data on mount
onMounted(() => {
  loadActivities()
})
</script>

<template>
  <div class="p-4 max-w-3xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <NuxtLink 
        to="/activity"
        class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
      >
        ← Back to Activity
      </NuxtLink>
      
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Explore Your Journey</h1>
      
      <div class="w-8"></div>
    </div>

    <div v-if="loading" class="py-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 dark:text-red-400 mb-4">{{ error }}</div>
      <button 
        @click="loadActivities"
        class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      >
        Try Again
      </button>
    </div>

    <div v-else-if="processedActivities" class="space-y-6">
      <!-- Activity Calendar -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">Activity History</h3>
        <div class="grid grid-cols-7 gap-2">
          <template v-for="score in processedActivities.dailyScores" :key="score.date">
            <button 
              @click="navigateToDay(score.date)"
              class="aspect-square rounded-lg p-2 flex flex-col items-center justify-center text-center hover:opacity-75 transition-opacity cursor-pointer"
              :class="getScoreColor(score.score)"
            >
              <div class="text-lg font-bold">{{ score.score }}</div>
              <div class="text-xs">{{ formatDate(score.date) }}</div>
            </button>
          </template>
        </div>
      </div>

      <!-- Trends -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">Your Trends</h3>
        <div class="space-y-4">
          <!-- Deductions -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Average Daily Deductions</h4>
            <div class="grid grid-cols-3 gap-4">
              <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                <div class="text-2xl mb-1">🍔</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Fast Food</div>
                <div class="font-bold text-red-600 dark:text-red-400">{{ processedActivities.trends.badMeals }}</div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                <div class="text-2xl mb-1">🍺</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Alcohol</div>
                <div class="font-bold text-red-600 dark:text-red-400">{{ processedActivities.trends.alcohol }}</div>
              </div>
              <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 text-center">
                <div class="text-2xl mb-1">🍪</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Snacks</div>
                <div class="font-bold text-red-600 dark:text-red-400">{{ processedActivities.trends.snacks }}</div>
              </div>
            </div>
          </div>

          <!-- Bonus Goals -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Success Rate</h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                <div class="text-2xl mb-1">🏃‍♂️</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Exercise</div>
                <div class="font-bold text-green-600 dark:text-green-400">{{ processedActivities.trends.exercise }}%</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center">
                <div class="text-2xl mb-1">🥬</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Greens</div>
                <div class="font-bold text-green-600 dark:text-green-400">{{ processedActivities.trends.greens }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 