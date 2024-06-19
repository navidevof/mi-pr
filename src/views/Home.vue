<template>
  <MainSection title="Mis PRs">
    <section class="flex flex-col gap-4">
      <CardGeneralInformationPr
        v-for="(data, idx) in informationCategories"
        :key="idx"
        :uid="data.uid"
        :name="data.name"
        :updatedAt="data.updatedAt"
        :categoryId="data.categoryId"
        :exercises="data.exercises"
      />
      <div v-if="informationCategories.length <= 0" class="flex flex-col gap-y-3 text-center font-semibold">
        <span>Aún no cuentas con tu primera categoría</span>
        <ModalCreateCategory :customButton="true"> Créala aquí </ModalCreateCategory>
      </div>
    </section>

    <BackToRegisterPr />
  </MainSection>
</template>

<script lang="ts" setup>
import type { IInformationCategory } from '@/interfaces/category';
import { getInformationCategories } from '@/services/category';
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUIStore } from '@/stores/ui';
import MainSection from '@/components/common/sections/MainSection.vue';
import CardGeneralInformationPr from '@/components/home/CardGeneralInformationPr.vue';
import { POSITION, useToast } from 'vue-toastification';
import { ERROR_MESSAGE_DEFAULT } from '@/constants/messages';
import ModalCreateCategory from '@/components/settings/categories/ModalCreateCategory.vue';
import BackToRegisterPr from '@/components/common/alerts/BackToRegisterPr.vue';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { uid } = storeToRefs(authStore);
const { isLoading } = storeToRefs(uiStore);

const informationCategories = ref<IInformationCategory[]>([]);

onMounted(async () => {
  try {
    isLoading.value = true;
    const res = await getInformationCategories({ uid: uid.value });
    if (res.error) {
      toast.error(res.message, {
        timeout: 5000,
        position: POSITION.TOP_CENTER,
      });
      return;
    }

    informationCategories.value = res.data;
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
