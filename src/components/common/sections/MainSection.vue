<template>
  <main class="mx-auto flex w-10/12 flex-col gap-y-8 pb-32 pt-10">
    <header class="flex items-center gap-x-4">
      <IconBack v-show="showBackArrow" @click="goToBack" class="hover-button w-6 transition" />
      <h2 class="text-2xl font-semibold">{{ title }}</h2>
    </header>
    <slot></slot>
  </main>
</template>

<script setup lang="ts">
import IconBack from '@/components/icons/IconBack.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

withDefaults(defineProps<{ showBackArrow?: boolean; title?: string }>(), {
  title: '',
  showBackArrow: false,
});

const goToBack = () => router.back();
</script>
