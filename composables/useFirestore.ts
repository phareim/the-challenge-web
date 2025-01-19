import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

interface UserProfile {
  uid: string
  name: string
  email?: string
  photoURL?: string
  goal?: string
  createdAt: Date
  updatedAt: Date
}

interface ActivityScore {
  badMeals: number
  alcohol: number
  snacks: number
  exercise: boolean
  greens: boolean
}

interface Activity {
  userId: string
  date: string
  score: ActivityScore
  updatedAt: Date
}

export const useFirestore = () => {
  const config = useRuntimeConfig()
  const { user } = useFirebaseAuth()
  const app = initializeApp(config.public.firebase)
  const db = getFirestore(app)

  // User Profile Operations
  const saveUserProfile = async (profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) => {
    try {
      const userRef = doc(db, 'users', profile.uid)
      const existingDoc = await getDoc(userRef)
      
      if (existingDoc.exists()) {
        // Update existing user
        await setDoc(userRef, {
          ...profile,
          updatedAt: new Date()
        }, { merge: true })
      } else {
        // Create new user
        await setDoc(userRef, {
          ...profile,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    } catch (error) {
      console.error('Error saving user profile:', error)
      throw error
    }
  }

  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          ...data,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate()
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  }

  const updateUserProfile = async (uid: string, updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>) => {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  }

  // Activity Operations
  const saveActivity = async (date: string, score: ActivityScore) => {
    if (!user.value?.uid) throw new Error('User not authenticated')

    try {
      const activityRef = doc(db, 'users', user.value.uid, 'activities', date)
      await setDoc(activityRef, {
        userId: user.value.uid,
        date,
        score,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error saving activity:', error)
      throw error
    }
  }

  const getActivity = async (date: string): Promise<Activity | null> => {
    if (!user.value?.uid) throw new Error('User not authenticated')

    try {
      const activityRef = doc(db, 'users', user.value.uid, 'activities', date)
      const activityDoc = await getDoc(activityRef)
      
      if (activityDoc.exists()) {
        return activityDoc.data() as Activity
      }
      return null
    } catch (error) {
      console.error('Error getting activity:', error)
      throw error
    }
  }

  const getAllActivities = async (): Promise<Activity[]> => {
    if (!user.value?.uid) throw new Error('User not authenticated')

    try {
      const activitiesRef = collection(db, 'users', user.value.uid, 'activities')
      const querySnapshot = await getDocs(activitiesRef)
      
      return querySnapshot.docs.map(doc => doc.data() as Activity)
    } catch (error) {
      console.error('Error getting all activities:', error)
      throw error
    }
  }

  return {
    // User operations
    saveUserProfile,
    getUserProfile,
    updateUserProfile,
    
    // Activity operations
    saveActivity,
    getActivity,
    getAllActivities
  }
} 