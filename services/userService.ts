import type { User } from '~/types/user'

// Mock data
const mockUser: User = {
  id: '1',
  displayName: 'Petter Player',
  initials: 'PP',
  joinedDate: 'January 2025',
  stats: {
    allTimeScore: 246,
    perfectDays: 12
  },
  settings: {
    notifications: {
      dailyReminders: true,
      weeklySummary: true
    },
    email: 'petter@example.com'
  }
}

export const useUserService = () => {
  const getCurrentUser = (): Promise<User> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUser)
      }, 100)
    })
  }

  const updateUser = async (updates: Partial<User>): Promise<User> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(mockUser, updates)
        resolve(mockUser)
      }, 100)
    })
  }

  return {
    getCurrentUser,
    updateUser
  }
} 