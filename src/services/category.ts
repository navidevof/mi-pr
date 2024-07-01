import { categoriesCollection, exercisesCollection, prsCollection } from '@/constants/collection';
import { db } from '@/firebase';
import type { ICategory, ICategoryDetail, IInformationCategory } from '@/interfaces/category';
import type { IExercise, IExerciseInformation } from '@/interfaces/exercise';
import {
  collection,
  getDocs,
  query,
  where,
  type DocumentData,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  setDoc,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';

export const getInformationCategories = async ({ uid }: { uid: string }) => {
  try {
    const exercisesSnap = await getDocs(query(collection(db, exercisesCollection), where('createdBy', 'in', [uid, ''])));
    const categoriesSnap = await getDocs(query(collection(db, categoriesCollection), where('uid', '==', uid), orderBy('updatedAt', 'asc')));

    const categories: ICategory[] = categoriesSnap.docs.map(doc => doc.data() as ICategory);
    const exercises: IExercise[] = exercisesSnap.docs.map(doc => doc.data() as IExercise);

    const prsArrayPromise: any = [];
    const informationCategories: IInformationCategory[] = [];

    categories.forEach(category => {
      const exercisesByCategory: IExerciseInformation[] = [];

      category.exercises.forEach(exercise => {
        const exerciseData = exercises.find(e => e.exerciseId == exercise);

        if (exerciseData) {
          exercisesByCategory.push({
            exerciseId: exerciseData.exerciseId,
            name: exerciseData.name,
            weight: '0',
            unit: 'lbs',
            reps: '0',
            series: '',
          });
        }

        prsArrayPromise.push(
          getDocs(
            query(
              collection(db, prsCollection),
              where('uid', '==', uid),
              where('exerciseId', '==', exercise),
              where('categoryId', '==', category.categoryId),
              where('date', '==', category.lastDate)
            )
          )
        );
      });

      informationCategories.push({
        uid,
        categoryId: category.categoryId,
        name: category.name,
        updatedAt: category.updatedAt,
        exercises: exercisesByCategory,
      });
    });

    const resPrsPromise = await Promise.all(prsArrayPromise);

    resPrsPromise.forEach(res => {
      if (!res.empty) {
        res.docs.forEach((doc: DocumentData) => {
          const prInfo = doc.data();

          const categoryIdx = informationCategories.findIndex(c => c.categoryId == prInfo.categoryId);
          const ExerciseIdx = informationCategories[categoryIdx].exercises.findIndex(e => e.exerciseId == prInfo.exerciseId);

          informationCategories[categoryIdx].exercises[ExerciseIdx] = {
            ...informationCategories[categoryIdx].exercises[ExerciseIdx],
            unit: prInfo.unit,
            weight: prInfo.weight,
          };
        });
      }
    });

    return {
      error: false,
      data: informationCategories,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      data: [],
      message: 'Error al consultar la información',
    };
  }
};

export const getCategories = async ({ uid }: { uid: string }) => {
  try {
    const categoriesSnap = await getDocs(query(collection(db, categoriesCollection), where('uid', '==', uid)));

    const categories: ICategory[] = categoriesSnap.docs.map(doc => doc.data() as ICategory);

    return {
      error: false,
      data: categories,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      data: [],
      message: 'Error al consultar la información',
    };
  }
};

export const getCategory = async ({ uid, categoryId }: { uid: string; categoryId: string }) => {
  try {
    const exercisesSnap = await getDocs(query(collection(db, exercisesCollection), where('createdBy', 'in', [uid, ''])));
    const categoriesSnap = await getDocs(
      query(collection(db, categoriesCollection), where('categoryId', '==', categoryId), where('uid', '==', uid))
    );

    const category: ICategory = categoriesSnap.docs[0].data() as ICategory;
    const exercises: IExercise[] = exercisesSnap.docs.map(doc => doc.data() as IExercise);

    const categoryDetail: ICategoryDetail = {
      name: category.name,
      categoryId,
      uid,
      createAt: category.createAt,
      updatedAt: category.updatedAt,
      lastDate: category.lastDate,
      exercises: [],
    };

    category.exercises.forEach(exercise => {
      const exerciseData = exercises.find(e => e.exerciseId == exercise);

      if (exerciseData) {
        categoryDetail.exercises.push({
          exerciseId: exerciseData.exerciseId,
          name: exerciseData.name,
        });
      }
    });

    return {
      error: false,
      data: categoryDetail,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      data: null,
      message: 'Error al consultar la información',
    };
  }
};

export const createCategory = async ({ name, uid }: { name: string; uid: string }) => {
  try {
    const refDoc = doc(collection(db, categoriesCollection));
    const now = Date.now();
    await setDoc(refDoc, {
      name,
      uid,
      categoryId: refDoc.id,
      createdAt: now,
      exercises: [],
      lastDate: '',
      updatedAt: 0,
    });

    return {
      error: false,
      message: 'ok',
      data: refDoc.id,
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      data: null,
      message: 'Error al actualizar la información',
    };
  }
};

export const addExercise = async ({ categoryId, exerciseId }: { exerciseId: string; categoryId: string }) => {
  try {
    await updateDoc(doc(db, categoriesCollection, categoryId), {
      exercises: arrayUnion(exerciseId),
    });

    return {
      error: false,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al actualizar la información',
    };
  }
};

export const updateExercises = async ({ categoryId, exercises }: { categoryId: string; exercises: String[] }) => {
  try {
    console.log({ categoryId, exercises });

    await updateDoc(doc(db, categoriesCollection, categoryId), {
      exercises,
    });

    return {
      error: false,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al actualizar la información',
    };
  }
};

export const deleteExercise = async ({ categoryId, exerciseId }: { exerciseId: string; categoryId: string }) => {
  try {
    await updateDoc(doc(db, categoriesCollection, categoryId), {
      exercises: arrayRemove(exerciseId),
    });

    return {
      error: false,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al eliminar la información',
    };
  }
};

export const deleteCategory = async ({ categoryId }: { categoryId: string }) => {
  try {
    await deleteDoc(doc(db, categoriesCollection, categoryId));

    return {
      error: false,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al eliminar la información',
    };
  }
};

export const updateName = async ({ categoryId, name }: { name: string; categoryId: string }) => {
  try {
    await updateDoc(doc(db, categoriesCollection, categoryId), {
      name,
    });

    return {
      error: false,
      message: 'ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al actualizar la información',
    };
  }
};
