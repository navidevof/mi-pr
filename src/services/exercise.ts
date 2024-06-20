import { exercisesCollection } from '@/constants/collection';
import { db } from '@/firebase';
import type { IExercise } from '@/interfaces/exercise';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';

export const getExercises = async ({ uid }: { uid: string }) => {
  try {
    const exercisesSnap = await getDocs(
      query(collection(db, exercisesCollection), where('createdBy', 'in', ['', uid]), orderBy('createdBy', 'desc'), orderBy('name', 'asc'))
    );

    const exercises: IExercise[] = exercisesSnap.docs.map(doc => doc.data() as IExercise);

    return {
      error: false,
      data: exercises,
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

export const getExercise = async ({ uid, exerciseId }: { uid: string; exerciseId: string }) => {
  try {
    const exerciseSnap = await getDocs(
      query(collection(db, exercisesCollection), where('createdBy', '==', uid), where('exerciseId', '==', exerciseId))
    );

    const exercise: IExercise = exerciseSnap.docs[0].data() as IExercise;

    return {
      error: false,
      data: exercise,
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

export const updateExercise = async ({ exerciseId, name }: { name: string; exerciseId: string }) => {
  try {
    await updateDoc(doc(db, exercisesCollection, exerciseId), {
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

export const createExercise = async ({ name, uid }: { name: string; uid: string }) => {
  try {
    const refDoc = doc(collection(db, exercisesCollection));
    await setDoc(refDoc, {
      name,
      createdBy: uid,
      exerciseId: refDoc.id,
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

export const deleteExercise = async ({ exerciseId }: { exerciseId: string }) => {
  try {
    await deleteDoc(doc(db, exercisesCollection, exerciseId));

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
