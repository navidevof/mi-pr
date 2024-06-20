<template>
  <MainSection title="Registrar PR" :show-back-arrow="true">
    <section class="flex flex-col gap-y-8">
      <CardRegisterPr
        v-for="(exercise, idx) in informationCategory?.exercises"
        :key="idx"
        :name="exercise.name"
        :exercise-id="exercise.exerciseId"
        :weight="exercise.weight"
        :unit="exercise.unit"
        :reps="exercise.reps"
        :series="exercise.series"
        @change="setInformationData"
      />
      <strong v-if="!informationCategory?.exercises.length" class="text-center font-semibold">Sin información</strong>
      <button v-if="informationCategory?.exercises.length" @click="saveData" class="main-button mx-auto">Guardar</button>
    </section>
  </MainSection>
</template>

<script lang="ts" setup>
import MainSection from '@/components/common/sections/MainSection.vue';
import CardRegisterPr from '@/components/pr/CardRegisterPr.vue';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import type { IInformationCategory } from '@/interfaces/category';
import { IExerciseInformation } from '@/interfaces/exercise';
import { getInformationPr, savePrs } from '@/services/pr';
import { useAuthStore } from '@/stores/auth';
import { useCategoryStore } from '@/stores/category';
import { useUIStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { POSITION, useToast } from 'vue-toastification';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const categoryStore = useCategoryStore();
const { isLoading } = storeToRefs(uiStore);
const { categoryId, exercises } = storeToRefs(categoryStore);
const { uid } = storeToRefs(authStore);

const route = useRoute();
const router = useRouter();

const informationCategory = ref<IInformationCategory>();

onMounted(async () => {
  try {
    if (!route.params.categoryId) {
      router.back();
    }

    isLoading.value = true;

    categoryId.value = route.params.categoryId as string;
    const res = await getInformationPr({ uid: uid.value, categoryId: categoryId.value });
    if (res.error || !res.data) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    if (res.data.exercises.length > 0) {
      informationCategory.value = res.data;
      if (exercises.value.length == 0) {
        res.data.exercises.forEach((exercise: IExerciseInformation) => {
          exercises.value.push({
            ...exercise,
            weight: '0',
            unit: 'lbs',
            reps: '0',
            series: '',
          });
        });
      }
    } else {
      categoryId.value = '';
    }
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

const setInformationData = (param: IExerciseInformation) => {
  const idx = exercises.value.findIndex(d => d.exerciseId == param.exerciseId);
  exercises.value[idx] = param;
};

const saveData = async () => {
  try {
    isLoading.value = true;
    const res = await savePrs({ uid: uid.value, categoryId: categoryId.value, exercises: exercises.value });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Hemos registrado con éxito tus PRs', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });

    categoryStore.resetStore();
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
