import type { IExerciseInformation } from '@/interfaces/exercise';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore(
  'category',
  () => {
    const categoryId = ref<string>('');
    const exercises = ref<IExerciseInformation[]>([]);

    const resetStore = () => {
      categoryId.value = '';
      exercises.value = [];
    };

    return { categoryId, exercises, resetStore };
  },
  { persist: true }
);
