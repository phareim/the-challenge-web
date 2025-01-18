import { Activity, CreateActivityDTO, UpdateActivityDTO } from '~/types/activity'

// In-memory store
const activities = new Map<string, Activity>()

// Helper function to calculate total score
const calculateTotalScore = (score: Activity['score']): number => {
  const basePoints = 4
  const deductions = score.badMeals + score.alcohol + score.snacks
  const bonusPoints = (score.exercise ? 1 : 0) + (score.greens ? 1 : 0)
  return Math.max(0, basePoints - deductions) + bonusPoints
}

// GET /api/activities?date=YYYY-MM-DD
export const GET = defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string

  if (date) {
    const activity = activities.get(date)
    return activity || null
  }

  // Return all activities sorted by date
  return Array.from(activities.values()).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

// POST /api/activities
export const POST = defineEventHandler(async (event) => {
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
})

// PUT /api/activities/:date
export const PUT = defineEventHandler(async (event) => {
  const date = event.context.params?.date
  if (!date) {
    throw createError({
      statusCode: 400,
      message: 'Date is required'
    })
  }

  const existingActivity = activities.get(date)
  if (!existingActivity) {
    throw createError({
      statusCode: 404,
      message: 'Activity not found'
    })
  }

  const body = await readBody<UpdateActivityDTO>(event)
  const updatedActivity: Activity = {
    ...existingActivity,
    ...body,
    score: {
      ...existingActivity.score,
      ...body.score
    }
  }
  updatedActivity.totalScore = calculateTotalScore(updatedActivity.score)

  activities.set(date, updatedActivity)
  return updatedActivity
})

// DELETE /api/activities/:date
export const DELETE = defineEventHandler(async (event) => {
  const date = event.context.params?.date
  if (!date) {
    throw createError({
      statusCode: 400,
      message: 'Date is required'
    })
  }

  const deleted = activities.delete(date)
  if (!deleted) {
    throw createError({
      statusCode: 404,
      message: 'Activity not found'
    })
  }

  return { success: true }
}) 