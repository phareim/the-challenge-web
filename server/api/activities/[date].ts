import { defineEventHandler, readBody, createError } from '#imports'
import { UpdateActivityDTO } from '~/types/activity'
import { activities, calculateTotalScore } from '~/server/utils/activities-store'

export default defineEventHandler(async (event) => {
  const date = event.context.params?.date
  if (!date) {
    throw createError({
      statusCode: 400,
      message: 'Date is required'
    })
  }

  // Handle PUT requests
  if (event.method === 'PUT') {
    const existingActivity = activities.get(date)
    if (!existingActivity) {
      throw createError({
        statusCode: 404,
        message: 'Activity not found'
      })
    }

    const body = await readBody<UpdateActivityDTO>(event)
    const updatedActivity = {
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
  }

  // Handle DELETE requests
  if (event.method === 'DELETE') {
    const deleted = activities.delete(date)
    if (!deleted) {
      throw createError({
        statusCode: 404,
        message: 'Activity not found'
      })
    }

    return { success: true }
  }
}) 