<template>
  <aside class="mx-auto flex w-full max-w-screen-sm flex-col gap-y-2">
    <h3 class="line-clamp-1 text-xl font-semibold">{{ exercise.name }}</h3>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    <div class="flex justify-between">
      <div class="flex flex-col items-center justify-center gap-1">
        <span class="font-semibold">Último peso</span>
        <span>
          {{ last ?? '--' }}
          <h6 v-show="last" class="inline-block first-letter:uppercase">{{ exercise.prs[0].unit }}</h6>
        </span>
      </div>
      <div class="flex flex-col items-center justify-center gap-1">
        <span class="font-semibold">Peso actual</span>
        <span>
          {{ current ?? '--' }}
          <h6 v-show="current" class="inline-block first-letter:uppercase">{{ exercise.prs[0].unit }}</h6>
        </span>
      </div>
      <div class="flex flex-col items-center justify-center gap-1">
        <span class="font-semibold">Progreso</span>
        <strong :class="[percent > 0 && 'text-green-500', percent < 0 && 'text-red-500', percent == 0 && 'text-custom-orange-1']">
          <span v-show="percent != 0">{{ percent > 0 ? '+' : '' }}</span>
          {{ percent }}%
        </strong>
      </div>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import Chart from 'primevue/chart';
import type { IHistoryExercise } from '@/interfaces/history';
import type { IPr } from '@/interfaces/pr';

const chartData = ref();
const chartOptions = ref();

const { exercise } = defineProps<{ exercise: IHistoryExercise }>();

const last = ref<number>(exercise.prs[exercise.prs.length - 2].weight ?? 0);
const current = ref<number>(exercise.prs[exercise.prs.length - 1].weight ?? 0);

const percent = computed(() => {
  if (!exercise) return 0;
  if (last.value == 0 && current.value == 0) return 0;

  if (current.value != 0 && last.value == 0) return 100;

  const newPercent = ((current.value * 100) / last.value - 100).toFixed(0);

  return parseInt(newPercent);
});

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const setChartData = () => {
  return {
    labels: exercise.prs.map((p: IPr) => p.date),
    datasets: [
      {
        label: 'Progresión',
        data: exercise.prs.map((p: IPr) => p.weight),
        fill: false,
        tension: 0.4,
        borderColor: '#FB6705',
        pointBackgroundColor: 'white',
      },
    ],
  };
};

const setChartOptions = () => {
  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const data = exercise.prs[tooltipItem.dataIndex];
            return `Peso: ${data.weight} ${data.unit} Reps: ${data.reps} Series: ${data.series}
            `;
          },
        },
      },
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'gray',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'gray',
        },
      },
    },
  };
};
</script>
