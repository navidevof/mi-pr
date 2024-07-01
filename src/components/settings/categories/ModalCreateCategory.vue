<template>
  <BaseAlert v-show="showModalCreate">
    <div class="relative flex flex-col gap-y-3">
      <form @submit.prevent="addNewCategory" class="flex flex-col gap-y-4">
        <IconClose @click="showModalCreate = false" class="hover-button -my-2 ml-auto w-5" />
        <label class="flex flex-col gap-y-2">
          <span class="font-semibold">Nombre la rutina</span>
          <input required id="name" name="name" v-model="name" />
        </label>
        <button class="main-button mx-auto">Crear</button>
      </form>
    </div>
  </BaseAlert>

  <button
    v-if="!customButton"
    @click="showModalCreate = true"
    class="main-button fixed bottom-20 right-5 flex items-center justify-center gap-2 p-6"
  >
    <IconPlus class="w-4" /> Rutina
  </button>
  <button v-else @click="showModalCreate = true" class="main-button mx-auto flex items-center justify-center gap-2">
    <IconPlus class="w-4" />
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import BaseAlert from '@/components/common/alerts/BaseAlert.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconPlus from '@/components/icons/IconPlus.vue';

import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import { createCategory } from '@/services/category';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { POSITION, useToast } from 'vue-toastification';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const router = useRouter();
const { isLoading } = storeToRefs(uiStore);

const name = ref<string>('');
const showModalCreate = ref<boolean>(false);

defineProps<{ customButton?: boolean }>();

const addNewCategory = async () => {
  if (name.value.trim() == '') return;

  try {
    isLoading.value = true;
    const res = await createCategory({ name: name.value, uid: uid.value });

    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    toast.success('Ejercicio creado con Éxito', {
      timeout: 5000,
      position: POSITION.TOP_CENTER,
    });

    router.push(`/configuracion/rutinas/${res.data}`);
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
