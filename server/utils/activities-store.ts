import { Activity } from '~/types/activity'

// In-memory store
export const activities = new Map<string, Activity>()

// Helper function to calculate total score
export const calculateTotalScore = (score: Activity['score']): number => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
} 