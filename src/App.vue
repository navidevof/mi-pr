<template>
  <RouterView />
  <Loader v-show="isLoading" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import Loader from '@/components/common/Loader.vue';

const uiStore = useUIStore();
const { isLoading } = storeToRefs(uiStore);
</script>

<style scoped></style>
