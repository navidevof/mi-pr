<template>
  <MainSection title="Categorías" :show-back-arrow="true">
    <section class="flex flex-col gap-y-4">
      <GoToCard v-for="category in categories" :key="category.categoryId" :link="`/configuracion/categorias/${category.categoryId}`">
        <h4 class="font-semibold">{{ category.name }} ({{ category.exercises.length }})</h4>
        <IconChevron class="w-5 -rotate-90" />
      </GoToCard>
    </section>
    <ModalCreateCategory />
  </MainSection>
</template>

<script lang="ts" setup>
import GoToCard from '@/components/common/cards/GoToCard.vue';
import MainSection from '@/components/common/sections/MainSection.vue';
import IconChevron from '@/components/icons/IconChevron.vue';

import type { ICategory } from '@/interfaces/category';
import { getCategories } from '@/services/category';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUIStore } from '@/stores/ui';
import { POSITION, useToast } from 'vue-toastification';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import ModalCreateCategory from '@/components/settings/categories/ModalCreateCategory.vue';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const { isLoading } = storeToRefs(uiStore);

const categories = ref<ICategory[]>([]); // Use ref() for reactive data

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await getCategories({ uid: uid.value });
    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    categories.value = res.data;
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
