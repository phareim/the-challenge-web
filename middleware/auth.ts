export default defineNuxtRouteMiddleware((to) => {
  const { user, loading } = useFirebaseAuth()

  // Skip middleware if going to login page
  if (to.path === '/login') {
    return
  }

  // Wait for auth to initialize
  if (loading.value) {
    return
  }

  // Redirect to login if not authenticated
  if (!user.value) {
    return navigateTo('/login')
  }
}) 