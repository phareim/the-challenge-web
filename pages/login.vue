<script setup lang="ts">
const { signInWithGoogle, user, loading } = useFirebaseAuth()
const { getUserProfile } = useFirestore()
const router = useRouter()
const checkingProfile = ref(false)

// Check user status and redirect accordingly
watch([user, loading], async ([newUser, isLoading]) => {
  console.log('Auth state changed:', { newUser: newUser?.uid, isLoading })
  
  if (!isLoading && newUser) {
    checkingProfile.value = true
    try {
      console.log('Checking profile for user:', newUser.uid)
      const profile = await getUserProfile(newUser.uid)
      console.log('Profile check result:', { hasProfile: !!profile })
      
      // Redirect to activity if profile exists, otherwise to registration
      if (profile) {
        router.push('/activity')
      } else {
        router.push('/register')
      }
    } catch (error) {
      console.error('Error checking user profile:', error)
    } finally {
      checkingProfile.value = false
    }
  }
}, { immediate: true })

// Handle Google sign in
const handleSignIn = async () => {
  try {
    console.log('Starting Google sign in...')
    const result = await signInWithGoogle()
    console.log('Sign in successful:', result?.uid)
  } catch (error) {
    console.error('Failed to sign in:', error)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome!</h1>
        <p class="text-gray-600">Sign in to track your daily health goals</p>
      </div>
      
      <div v-if="checkingProfile" class="text-center text-sm text-gray-500">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mx-auto mb-2"></div>
        Checking your profile...
      </div>
      
      <button
        v-else
        @click="handleSignIn"
        :disabled="loading"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5 mr-3" />
        {{ loading ? 'Signing in...' : 'Sign in with Google' }}
      </button>

      <p class="text-center text-sm text-gray-500 mt-4">
        By signing in, you agree to our 
        <NuxtLink to="/tos" class="text-blue-600 hover:text-blue-800">Terms of Service</NuxtLink>
      </p>
    </div>
  </div>
</template> 