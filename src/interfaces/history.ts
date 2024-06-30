import type { IPr } from './pr';

export interface IHistory {
  name: string;
  exercises: IHistoryExercise[];
}

export interface IHistoryExercise {
  name: string;
  exerciseId: string;
  createdBy: string;
  prs: IPr[];
}
