<script setup lang="ts">
const { signIn } = useAuth()

const handleGoogleLogin = () => {
  signIn('google', { callbackUrl: '/activity' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Track your daily activities and stay healthy
        </p>
      </div>
      <div class="mt-8">
        <button
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" class="h-5 w-5 mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template> 