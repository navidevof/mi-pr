<template>
  <MainSection title="Usuario" class="h-screen">
    <section class="flex h-full w-full items-center justify-center">
      <button v-if="!uid" @click="signInGoogle" class="main-button mx-auto flex items-center gap-x-2 !bg-white !text-custom-black-2">
        <IconGoogle class="w-5" />
        Ingresar con Google
      </button>
      <button v-else @click="logout" class="main-button mx-auto !bg-red-500">Cerrar sesión</button>
    </section>
    <MenuMobile />
  </MainSection>
</template>
<script setup lang="ts">
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, providers } from '@/firebase';
import { createUser, getUser } from '@/services/user';
import { useUIStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { POSITION, useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import MenuMobile from '@/components/common/menus/MenuMobile.vue';
import MainSection from '@/components/common/sections/MainSection.vue';
import IconGoogle from '@/components/icons/IconGoogle.vue';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();

const { isLoading } = storeToRefs(uiStore);
const { uid } = storeToRefs(authStore);

const signInGoogle = async () => {
  try {
    isLoading.value = true;
    const data = await signInWithPopup(auth, providers.google);
    const resGetUser = await getUser({ uid: data.user.uid });

    if (resGetUser.error) {
      toast.error(resGetUser.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });

      return;
    }

    if (!resGetUser.data?.user) {
      const resCreateUser = await createUser({
        uid: data.user.uid,
        name: data.user?.displayName,
        image: data.user?.photoURL,
      });

      if (resCreateUser.error) {
        toast.error(resCreateUser.message, {
          timeout: 5000,
          position: POSITION.TOP_CENTER,
        });
        return;
      }

      uid.value = data.user.uid;

      toast.success(`Bienvenid@ ¡${data.user?.displayName}!`, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });

      return;
    }

    uid.value = data.user.uid;
  } catch (error) {
    console.log(error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    isLoading.value = false;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    uid.value = '';
  } catch (error) {
    console.log(error);
  }
};
</script>
