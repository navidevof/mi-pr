<template>
  <BaseAlert v-show="showAlert && !isMinimized">
    <div class="relative flex flex-col gap-y-3 text-center">
      <button @click="minimizeAlert" class="absolute -top-3 right-0 ml-auto"><IconClose class="w-5" /></button>
      <strong class="uppercase">¡Alerta!</strong>
      <p>Parece que aún no terminas de registrar tus PRs ¿Quieres continuar realizando los ejercicios?</p>
      <div class="mt-3 flex w-full items-center justify-end gap-3">
        <button @click="closeAlert" class="text-red-500">Borrar proceso</button>
        <router-link :to="`/pr/${categoryId}`" class="main-button">Si, continuar</router-link>
      </div>
    </div>
  </BaseAlert>
  <aside v-show="!showAlert && isMinimized" class="fixed left-0 top-5 flex w-full transition duration-300">
    <button
      @click="handleClickAlert"
      class="mx-auto flex w-10/12 max-w-fit animate-bounce items-center justify-center gap-x-2 rounded-3xl bg-custom-black-3 px-5 py-2 text-center"
    >
      <IconInformation class="w-9 text-blue-500" />
      <h4 class="font-semibold">¡Entrenamiento en curso!</h4>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

import BaseAlert from '@/components/common/alerts/BaseAlert.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconInformation from '@/components/icons/IconInformation.vue';

const categoryStore = useCategoryStore();
const { categoryId } = storeToRefs(categoryStore);

const showAlert = ref<boolean>(false);
const isMinimized = ref<boolean>(false);

const closeAlert = () => {
  categoryStore.resetStore();
  showAlert.value = false;
};

const minimizeAlert = () => {
  showAlert.value = false;
  isMinimized.value = true;
};

const handleClickAlert = () => {
  isMinimized.value = false;
  showAlert.value = true;
};

onMounted(() => {
  if (categoryId.value) {
    isMinimized.value = true;
  }
});
</script>
