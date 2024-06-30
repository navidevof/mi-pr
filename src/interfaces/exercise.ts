export interface IExercise {
  name: string;
  exerciseId: string;
  createdBy: string;
}

export interface IExerciseInformation {
  exerciseId: string;
  name: string;
  unit: string;
  weight: number;
  reps: string;
  series: string;
}
