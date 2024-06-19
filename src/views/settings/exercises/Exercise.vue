<template>
  <MainSection title="Editar ejercicio" :show-back-arrow="true">
    <form @submit.prevent="changeName" class="flex flex-col gap-y-4">
      <label class="flex flex-col gap-y-2">
        <span class="font-semibold">Nombre del ejercicio</span>
        <input required id="name" name="name" v-model="newName" />
      </label>
      <button class="main-button mx-auto">Guardar</button>
      <button @click="showAlert = true" role="button" type="button" class="hover-button text-red-500 underline">Eliminar</button>
    </form>
  </MainSection>

  <BaseAlert v-show="showAlert">
    <div class="flex w-full flex-col gap-y-3 text-center">
      <h3 class="font-semibold text-custom-orange-1">¡Advertencia!</h3>
      <p>¿Estás seguro de eliminar este ejercicio?</p>
      <div class="mt-3 flex w-full items-center justify-end gap-5">
        <button @click="showAlert = false" class="rounded border border-red-500 px-3 py-2 text-sm text-red-500">Cancelar</button>
        <button @click="removeExercise" class="main-button !text-sm">Si, eliminar</button>
      </div>
    </div>
  </BaseAlert>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import MainSection from '@/components/common/sections/MainSection.vue';
import BaseAlert from '@/components/common/alerts/BaseAlert.vue';

import { useUIStore } from '@/stores/ui';
import type { IExercise } from '@/interfaces/exercise';
import { deleteExercise, getExercise, updateExercise } from '@/services/exercise';
import { POSITION, useToast } from 'vue-toastification';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const { isLoading } = storeToRefs(uiStore);

const route = useRoute();
const router = useRouter();

const exercise = ref<IExercise>();
const showAlert = ref<boolean>(false);

const newName = ref<string>('');

onMounted(async () => {
  try {
    if (!route.params.exerciseId) {
      router.back();
    }
    const exerciseId = route.params.exerciseId as string;

    isLoading.value = true;
    const res = await getExercise({ uid: uid.value, exerciseId });

    if (res.error || !res.data) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    exercise.value = res.data;
    newName.value = exercise.value?.name ?? '';
  } catch (error) {
    console.error('Error fetching information:', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    isLoading.value = false;
  }
});

const changeName = async () => {
  if (!exercise.value) return;

  try {
    isLoading.value = true;

    if (newName.value != exercise.value.name) {
      const res = await updateExercise({ exerciseId: exercise.value.exerciseId, name: newName.value });

      if (res.error) {
        toast.error(res.message, {
          timeout: 5000,
          position: POSITION.TOP_CENTER,
        });
        return;
      }
    }

    toast.success('Ejercicio actualizado con Éxito', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });

    router.back();
  } catch (error) {
    console.error('Error fetching information:', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    isLoading.value = false;
  }
};

const removeExercise = async () => {
  const exerciseId = route.params.exerciseId as string;

  if (!exerciseId) return;

  try {
    const res = await deleteExercise({ exerciseId });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Ejercicio eliminado con Éxito', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });

    router.back();
  } catch (error) {
    console.error('Error fetching information:', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
