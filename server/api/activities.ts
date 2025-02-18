import { defineEventHandler, getQuery, readBody, createError } from '#imports'
import { CreateActivityDTO } from '~/types/activity'
import { activities, calculateTotalScore } from '~/server/utils/activities-store'

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

    const newActivity = {
      id: crypto.randomUUID(),
      date: body.date,
      score: body.score,
      totalScore: calculateTotalScore(body.score)
    }

    activities.set(body.date, newActivity)
    return newActivity
  }
}) 