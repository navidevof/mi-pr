<template>
  <aside class="w-full overflow-clip rounded-lg shadow shadow-custom-orange-1/80">
    <div class="flex w-full items-center justify-between bg-custom-gray-1 p-3">
      <strong class="line-clamp-2 w-full font-semibold">{{ name }}</strong>
      <div class="flex w-fit min-w-20 flex-col text-end text-sm font-light">
        Último peso
        <strong class="font-semibold text-custom-orange-1">{{ weight }} {{ unit }} x {{ reps }}</strong>
      </div>
    </div>
    <div class="flex w-full flex-col">
      <button @click="showMoreInfo = !showMoreInfo" class="flex w-full items-center justify-between px-5 py-3 outline-none">
        <span class="w-auto">{{ showMoreInfo ? 'Ocultar registro' : 'Mostrar registro' }}</span>
        <IconChevron class="w-6 transition" :class="[showMoreInfo && 'rotate-180']" />
      </button>
      <div v-show="showMoreInfo" class="grid grid-cols-2 gap-3 px-5 py-3 text-sm font-light transition">
        <label class="flex flex-col gap-y-2">
          <strong class="font-semibold">Peso</strong>
          <input @input="change" type="number" v-model="data.weight" />
        </label>
        <label class="flex flex-col gap-y-2">
          <strong class="font-semibold">Unidad</strong>
          <select @change="change" v-model="data.unit">
            <option value="">Seleccionar opción</option>
            <option value="kg">Kg</option>
            <option value="lbs">Lbs</option>
            <option value="laminas">Laminas</option>
          </select>
        </label>
        <label class="flex flex-col gap-y-2">
          <strong class="font-semibold">Repeticiones</strong>
          <input @input="change" type="number" v-model="data.reps" />
        </label>
        <label class="flex flex-col gap-y-2">
          <strong class="font-semibold">Series</strong>
          <input @input="change" type="number" list="series" v-model="data.series" />
        </label>
      </div>
    </div>
  </aside>

  <datalist id="series">
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
  </datalist>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import IconChevron from '@/components/icons/IconChevron.vue';
import type { IExerciseInformation } from '@/interfaces/exercise';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';

const { exerciseId } = defineProps<IExerciseInformation>();
const categoryStore = useCategoryStore();
const { exercises } = storeToRefs(categoryStore);
const emit = defineEmits(['change']);

const showMoreInfo = ref<boolean>(false);

const data = ref({
  exerciseId: '',
  weight: '',
  unit: '',
  reps: '',
  series: '',
});

onMounted(() => {
  const exercise = exercises.value.find(e => e.exerciseId == exerciseId);
  if (exercise) {
    data.value = { ...exercise };
  }
});

const change = () => {
  emit('change', data.value);
};
</script>
