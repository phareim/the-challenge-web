<script setup lang="ts">
import type { Activity } from '~/types/activity'
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'
import { useFirestore } from '~/composables/useFirestore'

definePageMeta({
  middleware: ['auth']
})

const activities = useActivities()
const currentDate = ref(new Date())
const loading = ref(true)
const saving = ref(false)
const { signOutUser } = useFirebaseAuth()

const formattedDate = computed(() => {
  const date = currentDate.value
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })
})

const dateKey = computed(() => {
  return currentDate.value.toISOString().split('T')[0]
})

const isToday = computed(() => {
  const today = new Date()
  return currentDate.value.toDateString() === today.toDateString()
})

// Default score state
const defaultScore = {
  badMeals: 0,
  alcohol: 0,
  snacks: 0,
  exercise: false,
  greens: false
}

const score = ref({ ...defaultScore })

// Watch for date changes
watch(dateKey, async () => {
  await loadActivityForDate()
})

// Auto-save when score changes
watch(score, async () => {
  await saveScore()
}, { deep: true })

// Navigate between days
const changeDate = (days: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + days)
  currentDate.value = newDate
}

const loadActivityForDate = async () => {
  loading.value = true
  try {
    const { getActivity, saveActivity } = useFirestore()
    const activity = await getActivity(dateKey.value)
    
    if (activity) {
      // Use existing activity
      score.value = { ...activity.score }
    } else {
      // Create new activity with default score
      await saveActivity(dateKey.value, defaultScore)
      score.value = { ...defaultScore }
    }
  } catch (error) {
    console.error('Failed to load activity:', error)
    score.value = { ...defaultScore }
  } finally {
    loading.value = false
  }
}

// Load initial activity
onMounted(() => {
  loadActivityForDate()
})

const getTotalScore = computed(() => {
  const basePoints = 4
  const deductions = score.value.badMeals + score.value.alcohol + score.value.snacks
  const bonusPoints = (score.value.exercise ? 1 : 0) + (score.value.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
})

const getMaxScore = computed(() => {
  return 6 // 4 base + 2 bonus points possible
})

const increment = (type: keyof Pick<Activity['score'], 'badMeals' | 'alcohol' | 'snacks'>) => {
  score.value[type]++
}

const decrement = (type: keyof Pick<Activity['score'], 'badMeals' | 'alcohol' | 'snacks'>) => {
  if (score.value[type] > 0) {
    score.value[type]--
  }
}

const toggleBonus = (type: keyof Pick<Activity['score'], 'exercise' | 'greens'>) => {
  score.value[type] = !score.value[type]
}

const saveScore = async () => {
  if (saving.value) return
  
  saving.value = true
  try {
    const { saveActivity } = useFirestore()
    await saveActivity(dateKey.value, score.value)
  } catch (error) {
    console.error('Failed to save activity:', error)
  } finally {
    saving.value = false
  }
}

const handleSignOut = async () => {
  try {
    await signOutUser()
    navigateTo('/login')
  } catch (error) {
    console.error('Failed to sign out:', error)
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto">
    <!-- Date Navigation -->
    <div class="flex items-center justify-between mb-6">
      <button 
        @click="changeDate(-1)"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        :disabled="loading"
      >
        <span class="text-xl">←</span>
      </button>
      
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-800">
          {{ formattedDate }}
        </h1>
        <span class="text-sm text-gray-500" v-if="!isToday">
          Tap arrows to navigate
        </span>
        <span class="text-sm text-blue-500 font-medium" v-else>
          Today
        </span>
      </div>
      
      <button 
        @click="changeDate(1)"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        :disabled="isToday || loading"
      >
        <span class="text-xl" :class="{ 'opacity-50': isToday }">→</span>
      </button>

      <!-- Add sign out button -->
      <div class="absolute top-4 right-4 flex items-center space-x-2">
        <NuxtLink 
          to="/profile"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Profile
        </NuxtLink>
        <button 
          @click="handleSignOut"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
    
    <div v-if="loading" class="py-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    
    <template v-else>
      <!-- Score Display -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 relative">
        <div class="text-center">
          <div class="text-sm text-gray-500 mb-1">Score</div>
          <div class="inline-flex items-baseline">
            <span class="text-6xl font-bold" :class="getTotalScore >= 4 ? 'text-green-600' : 'text-blue-600'">
              {{ getTotalScore }}
            </span>
            <span class="text-2xl text-gray-400 ml-1">/{{ getMaxScore }}</span>
          </div>
        </div>
        <!-- Saving indicator -->
        <div 
          v-if="saving" 
          class="absolute top-2 right-2 flex items-center text-sm text-gray-500"
        >
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
          Saving...
        </div>
      </div>
      
      <div class="space-y-6">
        <!-- Base Points Section -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="font-bold mb-4 text-gray-800 flex items-center">
            <span class="text-red-500 mr-2">-1</span> Point Deductions
          </h2>
          <div class="space-y-3">
            <!-- Bad Meals Counter -->
            <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
              <span class="text-2xl">🍔</span>
              <span class="flex-1">Fast Food</span>
              <div class="flex items-center space-x-2">
                <button @click="decrement('badMeals')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                  :disabled="score.badMeals === 0">
                  -
                </button>
                <span class="w-8 text-center">{{ score.badMeals }}</span>
                <button @click="increment('badMeals')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
                  +
                </button>
              </div>
            </div>
            
            <!-- Alcohol Counter -->
            <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
              <span class="text-2xl">🍺</span>
              <span class="flex-1">Alcohol</span>
              <div class="flex items-center space-x-2">
                <button @click="decrement('alcohol')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                  :disabled="score.alcohol === 0">
                  -
                </button>
                <span class="w-8 text-center">{{ score.alcohol }}</span>
                <button @click="increment('alcohol')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
                  +
                </button>
              </div>
            </div>
            
            <!-- Snacks Counter -->
            <div class="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl">
              <span class="text-2xl">🍪</span>
              <span class="flex-1">Snacks</span>
              <div class="flex items-center space-x-2">
                <button @click="decrement('snacks')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                  :disabled="score.snacks === 0">
                  -
                </button>
                <span class="w-8 text-center">{{ score.snacks }}</span>
                <button @click="increment('snacks')" 
                  class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bonus Points Section -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 class="font-bold mb-4 text-gray-800 flex items-center">
            <span class="text-green-500 mr-2">+1</span> Bonus Points
          </h2>
          <div class="space-y-3">
            <button 
              @click="toggleBonus('exercise')"
              class="w-full p-3 border border-gray-200 rounded-xl text-left hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center group"
              :class="{ 'bg-green-50 border-green-200': score.exercise }"
            >
              <span class="text-2xl mr-3">🏃‍♂️</span>
              <span class="flex-1">Exercise</span>
              <span class="text-green-500" :class="score.exercise ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">+1</span>
            </button>
            
            <button 
              @click="toggleBonus('greens')"
              class="w-full p-3 border border-gray-200 rounded-xl text-left hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center group"
              :class="{ 'bg-green-50 border-green-200': score.greens }"
            >
              <span class="text-2xl mr-3">🥬</span>
              <span class="flex-1">Greens with Meals</span>
              <span class="text-green-500" :class="score.greens ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">+1</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template> 