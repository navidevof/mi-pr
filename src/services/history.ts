import { categoriesCollection, exercisesCollection, prsCollection } from '@/constants/collection';
import { db } from '@/firebase';
import type { ICategory } from '@/interfaces/category';
import type { IExercise } from '@/interfaces/exercise';
import type { IHistory } from '@/interfaces/history';
import type { IPr } from '@/interfaces/pr';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

export const getHistory = async ({ categoryId }: { categoryId: string }) => {
  try {
    const categorySnap = await getDoc(doc(db, categoriesCollection, categoryId));
    if (!categorySnap.exists()) {
      return {
        error: true,
        message: 'Esta rutina no existe.',
        data: null,
      };
    }

    const category: ICategory = categorySnap.data() as ICategory;

    const exercisesSnap = await getDocs(query(collection(db, exercisesCollection), where('exerciseId', 'in', category.exercises)));
    const exercises: { [key: string]: IExercise } = {};
    exercisesSnap.docs.forEach(doc => {
      exercises[doc.id] = doc.data() as IExercise;
    });

    const prsPromises = Object.keys(exercises).map(exerciseId =>
      getDocs(
        query(
          collection(db, prsCollection),
          where('categoryId', '==', categoryId),
          where('exerciseId', '==', exerciseId),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
      )
    );

    const prs: { [key: string]: IPr[] } = {};
    const prsResults = await Promise.all(prsPromises);

    prsResults.forEach((querySnapshot, idx) => {
      const exerciseId = Object.keys(exercises)[idx];
      if (!querySnapshot.empty) {
        prs[exerciseId] = querySnapshot.docs.map(doc => doc.data() as IPr);
      }
    });

    const history: IHistory = {
      name: category.name,
      exercises: category.exercises
        .filter(e => exercises[e] && prs[e])
        .map(e => ({
          ...exercises[e],
          prs: prs[e] || [],
        })),
    };

    return {
      error: false,
      data: history,
      message: 'ok',
    };
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return {
      error: true,
      message: 'Error al obtener historial.',
      data: null,
    };
  }
};
