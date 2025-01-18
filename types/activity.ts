export interface Activity {
  id: string;
  date: string;
  score: {
    badMeals: number;
    alcohol: number;
    snacks: number;
    exercise: boolean;
    greens: boolean;
  };
  totalScore: number;
}

export type CreateActivityDTO = Omit<Activity, 'id' | 'totalScore'>;
export type UpdateActivityDTO = Partial<CreateActivityDTO>; 