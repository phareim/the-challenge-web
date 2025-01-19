import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth'

export const useFirebaseAuth = () => {
  const config = useRuntimeConfig()
  const user = useState<User | null>('user', () => null)
  const loading = useState<boolean>('auth-loading', () => true)

  // Initialize Firebase
  const app = initializeApp(config.public.firebase)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  // Watch auth state
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser
    loading.value = false
  })

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      console.error('Google sign in failed:', error)
      throw error
    }
  }

  // Sign out
  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out failed:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser
  }
} 