<template>
  <MainSection title="configuración">
    <section class="flex flex-col gap-y-4">
      <GoToCard v-for="route in routes" :key="route.title" :link="route.link">
        <h4 class="font-semibold">{{ route.title }}</h4>
        <IconChevron class="w-5 -rotate-90" />
      </GoToCard>
    </section>
  </MainSection>
</template>

<script lang="ts" setup>
import GoToCard from '@/components/common/cards/GoToCard.vue';
import MainSection from '@/components/common/sections/MainSection.vue';
import IconChevron from '@/components/icons/IconChevron.vue';

const routes = [
  { link: '/configuracion/rutinas', title: 'Rutinas' },
  { link: '/configuracion/ejercicios', title: 'Ejercicios' },
];
</script>
