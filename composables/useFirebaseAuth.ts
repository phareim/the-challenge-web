import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth'

export const useFirebaseAuth = () => {
  const config = useRuntimeConfig()
  const user = useState<User | null>('user', () => null)
  const loading = ref(false)
  const authInitialized = ref(false)

  // Initialize Firebase
  const app = initializeApp(config.public.firebase)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  // Watch auth state
  onMounted(() => {
    console.log('Setting up auth state listener')
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      console.log('Auth state changed:', { userId: newUser?.uid })
      user.value = newUser
      if (!authInitialized.value) {
        authInitialized.value = true
      }
    })

    // Cleanup on unmount
    onUnmounted(() => {
      console.log('Cleaning up auth state listener')
      unsubscribe()
    })
  })

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      loading.value = true
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOutUser = async () => {
    try {
      loading.value = true
      await signOut(auth)
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    authInitialized,
    signInWithGoogle,
    signOutUser
  }
} 