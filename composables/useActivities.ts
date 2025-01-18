import type { Activity, CreateActivityDTO, UpdateActivityDTO } from '~/types/activity'

export const useActivities = () => {
  const { $fetch } = useNuxtApp()
  
  const getActivity = async (date: string): Promise<Activity | null> => {
    return await $fetch(`/api/activities?date=${date}`)
  }
  
  const getAllActivities = async (): Promise<Activity[]> => {
    return await $fetch('/api/activities')
  }
  
  const createActivity = async (activity: CreateActivityDTO): Promise<Activity> => {
    return await $fetch('/api/activities', {
      method: 'POST',
      body: activity
    })
  }
  
  const updateActivity = async (date: string, activity: UpdateActivityDTO): Promise<Activity> => {
    return await $fetch(`/api/activities/${date}`, {
      method: 'PUT',
      body: activity
    })
  }
  
  const deleteActivity = async (date: string): Promise<{ success: boolean }> => {
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