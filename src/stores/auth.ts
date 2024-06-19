import { auth } from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const uid = ref<string>('');

    async function login({ email, password }: { email: string; password: string }) {
      await signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
      try {
        await signOut(auth);
        return { error: false };
      } catch (error) {
        return { error: true };
      }
    }

    return {
      login,
      logout,
      uid,
    };
  },
  { persist: true }
);
