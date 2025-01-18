import { defineEventHandler, getQuery, readBody, createError } from 'h3'
import { Activity, CreateActivityDTO } from '~/types/activity'

// In-memory store
const activities = new Map<string, Activity>()

// Helper function to calculate total score
const calculateTotalScore = (score: Activity['score']): number => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
}

export default defineEventHandler(async (event) => {
  // Handle GET requests
  if (event.method === 'GET') {
    const query = getQuery(event)
    const date = query.date as string

    if (date) {
      console.log('Fetching activity for date:', date)
      const activity = activities.get(date)
      return activity || null
    }

    // Return all activities sorted by date
    return Array.from(activities.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  // Handle POST requests
  if (event.method === 'POST') {
    const body = await readBody<CreateActivityDTO>(event)
    
    if (!body.date || !body.score) {
      throw createError({
        statusCode: 400,
        message: 'Invalid activity data'
      })
    }

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      date: body.date,
      score: body.score,
      totalScore: calculateTotalScore(body.score)
    }

    activities.set(body.date, newActivity)
    return newActivity
  }
})

// Export activities map for use in other handlers
export { activities } 