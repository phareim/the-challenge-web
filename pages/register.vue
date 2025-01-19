<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const { user } = useFirebaseAuth()
const { saveUserProfile } = useFirestore()
const loading = ref(false)
const error = ref('')

const form = ref({
  name: '',
  goal: ''
})

const handleSubmit = async () => {
  if (!user.value?.uid) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Save user profile to Firestore
    await saveUserProfile({
      uid: user.value.uid,
      name: form.value.name,
      goal: form.value.goal || undefined,
      email: user.value.email || undefined,
      photoURL: user.value.photoURL || undefined
    })
    
    router.push('/activity')
  } catch (e) {
    error.value = 'Failed to save profile. Please try again.'
    console.error('Failed to register:', e)
  } finally {
    loading.value = false
  }
}

// Pre-fill name if available from Google
onMounted(() => {
  if (user.value?.displayName) {
    form.value.name = user.value.displayName
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome aboard! 🎉</h1>
        <p class="text-gray-600">Let's get you started with your health journey</p>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :disabled="loading"
            class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label for="goal" class="block text-sm font-medium text-gray-700 mb-1">
            Your Health Goal
          </label>
          <textarea
            id="goal"
            v-model="form.goal"
            rows="3"
            :disabled="loading"
            class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="What do you want to achieve? (optional)"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed relative"
        >
          <span v-if="loading" class="absolute left-4 top-1/2 -translate-y-1/2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Saving...' : 'Start My Journey' }}
        </button>
      </form>
    </div>
  </div>
</template> 