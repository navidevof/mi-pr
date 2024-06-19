import { categoriesCollection, exercisesCollection, prsCollection } from '@/constants/collection';
import { db } from '@/firebase';
import type { ICategory, IInformationCategory } from '@/interfaces/category';
import type { IExercise, IExerciseInformation } from '@/interfaces/exercise';
import { collection, doc, getDoc, getDocs, query, where, writeBatch, type DocumentData } from 'firebase/firestore';
import moment from '@/utils/moment-config';

export const getInformationPr = async ({ uid, categoryId }: { uid: string; categoryId: string }) => {
  try {
    const categorySnap = await getDoc(doc(db, categoriesCollection, categoryId));
    const category: ICategory = categorySnap.data() as ICategory;

    if (!category || category.uid != uid)
      return {
        error: true,
        data: null,
        message: 'No tienes permisos para realizar esta acción',
      };

    const exercisesSnap = await getDocs(query(collection(db, exercisesCollection), where('createdBy', 'in', [uid, ''])));
    const exercises: IExercise[] = exercisesSnap.docs.map(doc => doc.data() as IExercise);

    const prsArrayPromise: any = [];
    const informationCategory: IInformationCategory = {
      uid,
      categoryId: category.categoryId,
      name: category.name,
      updatedAt: category.updatedAt,
      exercises: [],
    };

    category.exercises.forEach(exercise => {
      const exerciseData = exercises.find(e => e.exerciseId == exercise);

      if (exerciseData) {
        informationCategory.exercises.push({
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

    const resPrsPromise = await Promise.all(prsArrayPromise);

    resPrsPromise.forEach(res => {
      if (!res.empty) {
        res.docs.forEach((doc: DocumentData) => {
          const prInfo = doc.data();

          const exerciseIdx = informationCategory.exercises.findIndex(e => e.exerciseId == prInfo.exerciseId);

          informationCategory.exercises[exerciseIdx] = {
            ...informationCategory.exercises[exerciseIdx],
            unit: prInfo.unit,
            weight: prInfo.weight,
            reps: prInfo.reps,
          };
        });
      }
    });

    return {
      error: false,
      data: informationCategory,
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

export const savePrs = async ({ uid, categoryId, exercises }: { uid: string; categoryId: string; exercises: IExerciseInformation[] }) => {
  try {
    const batch = writeBatch(db);
    const now = Date.now();
    const date = moment(now).format('YYYY-MM-DD').toString();

    const prSnap = await getDocs(
      query(collection(db, prsCollection), where('uid', '==', uid), where('categoryId', '==', categoryId), where('date', '==', date))
    );
    const prs = prSnap.docs.map(p => p.id);

    if (prs.length > 0) {
      prs.forEach(prID => {
        batch.delete(doc(db, prsCollection, prID));
      });
    }

    exercises.forEach(exercise => {
      const resDoc = doc(collection(db, prsCollection));
      batch.set(
        doc(db, prsCollection, resDoc.id),
        {
          createdAt: now,
          date,
          categoryId,
          uid,
          ...exercise,
        },
        { merge: true }
      );
    });

    batch.update(doc(db, categoriesCollection, categoryId), {
      lastDate: date,
      updatedAt: now,
    });

    await batch.commit();

    return {
      error: false,
      message: 'Ok',
    };
  } catch (error: any) {
    console.log({ error: error.message });
    return {
      error: true,
      message: 'Error al guardar la información',
    };
  }
};
