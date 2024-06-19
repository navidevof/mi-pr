<template>
  <BaseAlert v-show="showAlert">
    <div class="flex flex-col gap-y-3 text-center">
      <strong class="uppercase">¡Alerta!</strong>
      <p>Parece que aún no terminas de registrar tus PRs ¿Quieres continuar realizando los ejercicios?</p>
      <div class="flex w-full items-center justify-end gap-3">
        <button @click="closeAlert" class="text-red-500">Borrar proceso</button>
        <router-link :to="`/pr/${categoryId}`" class="main-button">Si, continuar</router-link>
      </div>
    </div>
  </BaseAlert>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import BaseAlert from '@/components/common/alerts/BaseAlert.vue';

const categoryStore = useCategoryStore();
const { categoryId } = storeToRefs(categoryStore);

const showAlert = ref<boolean>(false);

const closeAlert = () => {
  categoryStore.resetStore();
  showAlert.value = false;
};

onMounted(() => {
  if (categoryId.value) {
    showAlert.value = true;
  }
});
</script>
