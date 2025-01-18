import type { Activity, CreateActivityDTO, UpdateActivityDTO } from '~/types/activity'

export const useActivities = () => {
  const getActivity = async (date: string): Promise<Activity | null> => {
    console.log('Fetching activity for date:', date)
    return await $fetch(`/api/activities?date=${date}`)
  }
  
  const getAllActivities = async (): Promise<Activity[]> => {
    console.log('Fetching all activities')
    return await $fetch('/api/activities')
  }
  
  const createActivity = async (activity: CreateActivityDTO): Promise<Activity> => {
    console.log('Creating activity:', activity)
    return await $fetch('/api/activities', {
      method: 'POST',
      body: activity
    })
  }
  
  const updateActivity = async (date: string, activity: UpdateActivityDTO): Promise<Activity> => {
    console.log('Updating activity for date:', date)
    return await $fetch(`/api/activities/${date}`, {
      method: 'PUT',
      body: activity
    })
  }
  
  const deleteActivity = async (date: string): Promise<{ success: boolean }> => {
    console.log('Deleting activity for date:', date)
    return await $fetch(`/api/activities/${date}`, {
      method: 'DELETE'
    })
  }
  
  return {
    getActivity,
    getAllActivities,
    createActivity,
    updateActivity,
    deleteActivity
  }
} 