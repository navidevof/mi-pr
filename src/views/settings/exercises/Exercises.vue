<template>
  <MainSection title="Ejercicios" :show-back-arrow="true">
    <section class="flex flex-col gap-y-4">
      <GoToCard
        v-for="exercise in exercises"
        :key="exercise.exerciseId"
        :link="exercise.createdBy != '' ? `/configuracion/ejercicios/${exercise.exerciseId}` : ''"
      >
        <h4 class="font-semibold">{{ exercise.name }}</h4>
        <IconChevron v-if="exercise.createdBy != ''" class="w-5 -rotate-90" />
        <IconLock v-else class="w-5 text-red-500" />
      </GoToCard>
    </section>

    <ModalCreateExercise />
  </MainSection>
</template>

<script lang="ts" setup>
import GoToCard from '@/components/common/cards/GoToCard.vue';
import MainSection from '@/components/common/sections/MainSection.vue';
import ModalCreateExercise from '@/components/settings/exercises/ModalCreateExercise.vue';
import IconChevron from '@/components/icons/IconChevron.vue';
import IconLock from '@/components/icons/IconLock.vue';

import type { IExercise } from '@/interfaces/exercise';
import { getExercises } from '@/services/exercise';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUIStore } from '@/stores/ui';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import { POSITION, useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const { isLoading } = storeToRefs(uiStore);

const exercises = ref<IExercise[]>([]);

onMounted(async () => {
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
</script>
