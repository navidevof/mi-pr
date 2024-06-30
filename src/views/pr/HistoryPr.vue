<template>
  <MainSection title="Mi progreso" :show-back-arrow="true">
    <section class="flex flex-col gap-10">
      <CardChartProgress v-for="(exercise, idx) in history?.exercises" :key="idx" :exercise="exercise" />
    </section>
  </MainSection>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUIStore } from '@/stores/ui';

import MainSection from '@/components/common/sections/MainSection.vue';
import CardChartProgress from '@/components/history/CardChartProgress.vue';
import { onMounted, ref } from 'vue';
import { getHistory } from '@/services/history';
import type { IHistory } from '@/interfaces/history';

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();

const { isLoading } = storeToRefs(uiStore);

const history = ref<IHistory>();

onMounted(async () => {
  const categoryId = route.params.categoryId as string;
  if (!categoryId) {
    router.back();
  }

  try {
    isLoading.value = true;
    const res = await getHistory({ categoryId });
    if (res.error || !res.data) {
      return;
    }

    history.value = res.data;
  } catch (error) {
    console.log({ error });
  } finally {
    isLoading.value = false;
  }
});
</script>
