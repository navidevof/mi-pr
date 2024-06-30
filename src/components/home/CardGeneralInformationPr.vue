<template>
  <aside class="w-full overflow-clip rounded-lg shadow shadow-custom-orange-1/80">
    <router-link :to="`/pr/${categoryId}`" class="flex w-full items-center justify-between bg-custom-gray-1 p-3">
      <h4 class="line-clamp-1 w-full font-bold">{{ name }}</h4>
      <div v-show="updatedAt != 0" class="flex w-full flex-col text-end text-sm font-light">
        Última vez
        <strong class="font-semibold">{{ moment(updatedAt).fromNow() }}</strong>
      </div>
      <div v-show="updatedAt == 0" class="flex w-full flex-col py-3 text-end text-sm font-light">Sin realizar</div>
    </router-link>
    <div class="flex flex-col gap-y-3 bg-custom-black-3 px-5 py-2 text-sm font-light transition">
      <button @click="showMoreInfo = !showMoreInfo" class="flex w-full items-center justify-between outline-none">
        <span class="w-auto">{{ exercises.length }} Ejercicio{{ exercises.length != 1 ? 's' : '' }}</span>
        <IconChevron class="w-6 transition" :class="[showMoreInfo && 'rotate-180']" />
      </button>

      <div v-show="showMoreInfo" class="mx-auto flex w-11/12 flex-col divide-y divide-white/70 transition duration-300">
        <div
          v-for="exercise in exercises.sort((a, b) => b.weight - a.weight)"
          :key="exercise.exerciseId"
          class="flex items-center justify-between gap-4 py-3"
        >
          <strong class="w-full">{{ exercise.name }}</strong>
          <span class="w-fit min-w-14 text-end font-bold text-custom-orange-1">{{ exercise.weight }} {{ exercise.unit }}</span>
        </div>
        <router-link
          :to="`/pr/historial/${categoryId}`"
          v-show="exercises.length > 0"
          class="flex items-center gap-x-2 py-3 text-blue-500 hover:saturate-200"
        >
          <IconHistory class="w-4" />
          Ir al historial
        </router-link>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import moment from '@/utils/moment-config';
import IconChevron from '@/components/icons/IconChevron.vue';
import { ref } from 'vue';
import type { IInformationCategory } from '@/interfaces/category';
import IconHistory from '../icons/IconHistory.vue';

defineProps<IInformationCategory>();

const showMoreInfo = ref<boolean>(false);
</script>
