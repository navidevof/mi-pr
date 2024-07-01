<template>
  <MainSection title="Editar rutina" :show-back-arrow="true">
    <section class="flex flex-col gap-y-4">
      <form @submit.prevent="changeName" class="flex w-full items-end gap-5">
        <label class="flex w-full flex-col gap-y-2">
          <span class="font-semibold">Nombre de la rutina</span>
          <input required id="name" name="name" class="w-full" v-model="newName" />
        </label>
        <button class="main-button h-fit w-full">Cambiar</button>
      </form>
      <aside v-show="categoryDetail?.updatedAt != 0">
        Última vez realizada <strong>{{ moment(categoryDetail?.updatedAt ?? Date.now()).fromNow() }}</strong>
      </aside>
      <aside
        v-show="categoryDetail?.updatedAt == 0"
        class="flex max-w-lg items-start gap-x-4 rounded-lg border-2 border-blue-900/60 bg-custom-black-3 p-3 md:items-center"
      >
        <IconInformation class="w-10 pt-1 text-blue-500" />
        <span class="w-full text-sm">Vaya, parece que aún no has realizado ningún PR para esta rutina.</span>
      </aside>
      <aside class="flex flex-col gap-y-2">
        <h4 class="font-semibold">Ejercicios</h4>
        <ul class="flex list-inside flex-col gap-y-2 pl-3 font-light">
          <li
            v-for="(exercise, idx) in categoryDetail?.exercises"
            :key="exercise.exerciseId"
            class="relative flex max-w-md items-center gap-x-3 rounded-lg bg-custom-black-3 p-4"
          >
            <div class="flex h-auto flex-col items-center justify-center gap-y-4">
              <button @click="() => upItem(idx)" v-show="idx != 0">
                <IconArrowTop class="w-4 text-white" />
              </button>
              <button @click="() => downItem(idx)" v-show="idx != (categoryDetail?.exercises ? categoryDetail?.exercises.length - 1 : 0)">
                <IconArrowTop class="w-4 -scale-y-100 text-white" />
              </button>
            </div>
            <span class="">{{ exercise.name }}</span>
            <IconTrash @click="() => removeExercise(exercise.exerciseId)" class="hover-button w-5 text-red-500" />
          </li>
          <li v-show="!categoryDetail?.exercises?.length" class="text-center">Sin ejercicios</li>
        </ul>
        <button @click="loadExercises" class="main-button mx-auto mt-4 flex items-center gap-2 text-sm">
          <IconPlus class="w-4" /> Agregar
        </button>
        <button @click="removeCategory" class="mt-4 text-red-500 underline">Eliminar rutina</button>
      </aside>
    </section>
  </MainSection>

  <BaseAlert v-show="showModalAddExercise">
    <div class="relative flex flex-col gap-y-4">
      <IconClose @click="showModalAddExercise = false" class="hover-button -my-2 ml-auto w-5" />
      <label class="flex flex-col gap-y-2">
        <span class="font-semibold">Seleccionar ejercicio</span>
        <select required id="name" name="name" v-model="selectedExercise">
          <option value="" selected>Seleccionar</option>
          <option v-for="exercise in exercises" :key="exercise.exerciseId" :value="exercise.exerciseId">{{ exercise.name }}</option>
        </select>
      </label>
      <button class="main-button mx-auto" @click="addNewExercise">Crear</button>
    </div>
  </BaseAlert>
</template>

<script lang="ts" setup>
import moment from '@/utils/moment-config';

import MainSection from '@/components/common/sections/MainSection.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconArrowTop from '@/components/icons/IconArrowTop.vue';
import IconInformation from '@/components/icons/IconInformation.vue';
import { storeToRefs } from 'pinia';

import { useUIStore } from '@/stores/ui';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { addExercise, deleteCategory, deleteExercise, getCategory, updateExercises, updateName } from '@/services/category';
import type { ICategoryDetail } from '@/interfaces/category';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import { POSITION, useToast } from 'vue-toastification';
import IconPlus from '@/components/icons/IconPlus.vue';
import BaseAlert from '@/components/common/alerts/BaseAlert.vue';
import type { IExercise } from '@/interfaces/exercise';
import { getExercises } from '@/services/exercise';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const { isLoading } = storeToRefs(uiStore);

const route = useRoute();
const router = useRouter();

const categoryDetail = ref<ICategoryDetail>();
const exercises = ref<IExercise[]>([]);

const showModalAddExercise = ref<boolean>(false);
const selectedExercise = ref<string>('');

const newName = ref<string>('');

const initialExercises = ref<String[]>([]);

const categoryId = ref<string>('');

onMounted(async () => {
  try {
    if (!route.params.categoryId) {
      router.back();
    }

    categoryId.value = route.params.categoryId as string;

    isLoading.value = true;
    const res = await getCategory({ categoryId: categoryId.value, uid: uid.value });
    if (res.error || !res.data) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    newName.value = res.data.name;
    categoryDetail.value = res.data;
    initialExercises.value = [...categoryDetail.value.exercises.map(e => e.exerciseId)];
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

onBeforeUnmount(async () => {
  await saveExercises();
});

const saveExercises = async () => {
  try {
    isLoading.value = true;
    const existChange = verifyExerciseChanges();
    if (!existChange) return;

    const newExercises = categoryDetail.value?.exercises.map(e => e.exerciseId) ?? [];

    const res = await updateExercises({ categoryId: categoryId.value, exercises: newExercises });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Ejercicios guardados con éxito', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
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

const loadExercises = async () => {
  if (exercises.value.length > 0) {
    showModalAddExercise.value = true;
    return;
  }

  try {
    isLoading.value = true;
    const res = await getExercises({ uid: uid.value });
    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    exercises.value = res.data;
    showModalAddExercise.value = true;
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

const addNewExercise = async () => {
  if (!selectedExercise.value || !categoryDetail.value) return;

  const exist = categoryDetail.value.exercises.find(e => e.exerciseId == selectedExercise.value);
  if (exist) {
    showModalAddExercise.value = false;
    return;
  }

  const newExercise = exercises.value.find(e => e.exerciseId == selectedExercise.value);
  if (!newExercise) {
    showModalAddExercise.value = false;
    return;
  }

  categoryDetail.value.exercises.push({ ...newExercise });
  showModalAddExercise.value = false;

  try {
    const res = await addExercise({ categoryId: categoryId.value, exerciseId: selectedExercise.value });

    if (res.error) {
      categoryDetail.value.exercises.pop();
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
    }

    initialExercises.value = [...categoryDetail.value.exercises.map(e => e.exerciseId)];
  } catch (error) {
    categoryDetail.value.exercises.pop();
    console.error('Error fetching information:', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    selectedExercise.value = '';
  }
};

const removeExercise = async (exerciseId: string) => {
  if (!categoryDetail.value) return;

  try {
    categoryDetail.value.exercises = categoryDetail.value.exercises.filter(e => e.exerciseId != exerciseId);
    const res = await deleteExercise({ categoryId: categoryId.value, exerciseId });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });

      const newExercise = exercises.value.find(e => e.exerciseId == selectedExercise.value);
      if (!newExercise) return;

      categoryDetail.value.exercises.push({ ...newExercise });
      return;
    }

    initialExercises.value = [...categoryDetail.value.exercises.map(e => e.exerciseId)];
  } catch (error) {
    const newExercise = exercises.value.find(e => e.exerciseId == selectedExercise.value);
    if (!newExercise) return;

    categoryDetail.value.exercises.push({ ...newExercise });

    console.error('Error', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  }
};

const changeName = async () => {
  try {
    if (!categoryDetail.value || !newName.value.trim()) return;

    isLoading.value = true;
    const res = await updateName({ categoryId: categoryId.value, name: newName.value });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Nombre actualizado con éxito', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } catch (error) {
    console.error('Error', error);
    toast.error(ERROR_MESSAGE_DEFAULT, {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });
  } finally {
    isLoading.value = false;
  }
};

const removeCategory = async () => {
  try {
    isLoading.value = true;
    const res = await deleteCategory({ categoryId: categoryId.value });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Rutina eliminada con Éxito', {
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

const upItem = (idx: number) => {
  if (idx - 1 === -1 || !categoryDetail.value) return;

  const newOrder = [...categoryDetail.value.exercises];
  const topItem = newOrder[idx - 1];
  newOrder[idx - 1] = newOrder[idx];
  newOrder[idx] = topItem;

  categoryDetail.value.exercises = newOrder;
};

const downItem = (idx: number) => {
  if (!categoryDetail.value) return;

  if (idx + 1 === categoryDetail.value.exercises.length) return;

  const newOrder = [...categoryDetail.value.exercises];
  const topItem = newOrder[idx + 1];
  newOrder[idx + 1] = newOrder[idx];
  newOrder[idx] = topItem;

  categoryDetail.value.exercises = newOrder;
};

const verifyExerciseChanges = (): boolean => {
  if (initialExercises.value.length == 0 || !categoryDetail.value?.exercises.length) return true;

  const extractExercises = categoryDetail.value.exercises.map(e => e.exerciseId);

  if (initialExercises.value.length !== categoryDetail.value?.exercises.length) {
    return true;
  }
  return !initialExercises.value.every((value, index) => value === extractExercises[index]);
};
</script>
