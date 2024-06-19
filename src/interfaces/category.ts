import type { IExerciseInformation } from './exercise';

export interface ICategory {
  uid: string;
  name: string;
  categoryId: string;
  exercises: string[];
  updatedAt: number;
  createAt: number;
  lastDate: string;
}

export interface IInformationCategory {
  uid: string;
  name: string;
  updatedAt: number;
  categoryId: string;
  exercises: IExerciseInformation[];
}

export interface ICategoryDetail {
  uid: string;
  name: string;
  categoryId: string;
  updatedAt: number;
  createAt: number;
  lastDate: string;
  exercises: Array<{
    exerciseId: string;
    name: string;
  }>;
}
