import { usersCollection } from '@/constants/collection';
import { db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getUser = async ({ uid }: { uid: string }) => {
  try {
    const user = await getDoc(doc(db, usersCollection, uid));

    return { error: false, message: '', data: { user: user.data() } };
  } catch (error) {
    return { error: true, message: 'Error en el servidor', data: null };
  }
};

const createUser = async (data: any) => {
  try {
    await setDoc(doc(db, usersCollection, data.uid), data);

    return { error: false, message: '', data };
  } catch (error) {
    return { error: true, message: 'Error en el servidor', data: null };
  }
};

export { getUser, createUser };
