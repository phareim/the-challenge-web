import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth'

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp()
  const user = ref<User | null>(null)
  const loading = ref(true)

  onMounted(() => {
    onAuthStateChanged($auth, (newUser) => {
      user.value = newUser
      loading.value = false
    })
  })

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup($auth, provider)
      return result.user
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut($auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    logout
  }
} 