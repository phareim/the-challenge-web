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

interface MonthlyScore {
  userId: string
  month: string // Format: 'YYYY-MM'
  totalPoints: number
  exerciseDays: number
  greensDays: number
  totalDays: number
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

      // Update monthly score
      await updateMonthlyScore(date, score)
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

  // Get all users
  const getAllUsers = async (): Promise<(UserProfile & { id: string })[]> => {
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
      updatedAt: (doc.data().updatedAt as Timestamp).toDate()
    })) as (UserProfile & { id: string })[]
  }

  // Monthly Score Operations
  const updateMonthlyScore = async (date: string, score: ActivityScore) => {
    if (!user.value?.uid) throw new Error('User not authenticated')

    try {
      const month = date.substring(0, 7) // Get YYYY-MM from YYYY-MM-DD
      const scoreRef = doc(db, 'monthlyScores', `${user.value.uid}_${month}`)
      
      // Get current monthly score
      const currentDoc = await getDoc(scoreRef)
      const currentScore = currentDoc.exists() ? currentDoc.data() as MonthlyScore : {
        userId: user.value.uid,
        month,
        totalPoints: 0,
        exerciseDays: 0,
        greensDays: 0,
        totalDays: 0
      }

      // Calculate new score
      const points = Math.max(0, 4 - (score.badMeals + score.alcohol + score.snacks)) + 
                    (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)

      // Update monthly totals
      await setDoc(scoreRef, {
        ...currentScore,
        totalPoints: currentScore.totalPoints + points,
        exerciseDays: currentScore.exerciseDays + (score.exercise ? 1 : 0),
        greensDays: currentScore.greensDays + (score.greens ? 1 : 0),
        totalDays: currentScore.totalDays + 1,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating monthly score:', error)
      throw error
    }
  }

  const getMonthlyScores = async (month: string): Promise<MonthlyScore[]> => {
    try {
      const scoresRef = collection(db, 'monthlyScores')
      const q = query(scoresRef, where('month', '==', month))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate()
      })) as MonthlyScore[]
    } catch (error) {
      console.error('Error getting monthly scores:', error)
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
    getAllActivities,
    getAllUsers,

    // Monthly Score operations
    updateMonthlyScore,
    getMonthlyScores
  }
} 