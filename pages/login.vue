<script setup lang="ts">
const { signInWithGoogle, user, loading } = useFirebaseAuth()
const router = useRouter()

// Redirect to registration if already logged in
watch([user, loading], ([newUser, isLoading]) => {
  if (!isLoading && newUser) {
    router.push('/register')
  }
}, { immediate: true })

// Handle Google sign in
const handleSignIn = async () => {
  try {
    await signInWithGoogle()
    router.push('/register')
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
      
      <button
        @click="handleSignIn"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5 mr-3" />
        Sign in with Google
      </button>

      <p class="text-center text-sm text-gray-500 mt-4">
        By signing in, you agree to our 
        <NuxtLink to="/tos" class="text-blue-600 hover:text-blue-800">Terms of Service</NuxtLink>
      </p>
    </div>
  </div>
</template> 