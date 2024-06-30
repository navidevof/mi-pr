<template>
  <aside
    v-show="showModal"
    class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black bg-opacity-60 transition duration-300"
  >
    <aside class="relative flex w-10/12 max-w-screen-sm flex-col gap-y-5 rounded-lg bg-custom-black-3 p-6 text-center text-white">
      <button @click="closeTime"><IconClose class="ml-auto w-5" /></button>
      <aside v-if="!finishTime" class="flex flex-col gap-y-5">
        <header>
          <h3 class="text-2xl font-semibold">¡Tomate un descanso!</h3>
          <small>Te lo mereces... 🎉</small>
        </header>
        <div class="flex w-full items-center justify-center gap-x-5">
          <button @click="decrementTimer" class="text-lg">-5</button>
          <div class="flex aspect-square flex-col items-center justify-center rounded-full bg-custom-orange-1 p-4 text-2xl font-semibold">
            {{ time }}
            <span class="-mt-2 text-xl">Segundos</span>
          </div>
          <button @click="incrementTimer" class="text-lg">+5</button>
        </div>
        <div v-show="!isPlay" class="flex items-center gap-x-3 overflow-x-auto px-1 transition duration-300 md:justify-center">
          <button @click="time = 30" class="min-w-fit rounded-full border px-3 py-1 text-sm">30 seg</button>
          <button @click="time = 60" class="min-w-fit rounded-full border px-3 py-1 text-sm">1 min</button>
          <button @click="time = 120" class="min-w-fit rounded-full border px-3 py-1 text-sm">2 min</button>
          <button @click="time = 180" class="min-w-fit rounded-full border px-3 py-1 text-sm">3 min</button>
        </div>
        <button v-if="!isPlay" @click="playTime" class="main-button mx-auto">Iniciar</button>
        <button v-else @click="stopTimer" class="main-button mx-auto">Pausar</button>
      </aside>
      <aside v-else class="flex flex-col gap-y-5">
        <header>
          <h3 class="animate-bounce text-2xl font-semibold">¡Se acabó el tiempo!</h3>
          <small>Sigamos con el entreno... 😎</small>
        </header>
        <button @click="closeTime" class="main-button mx-auto">Cerrar</button>
      </aside>
    </aside>

    <audio ref="$audio" loop :src="alarm"></audio>
  </aside>

  <button @click="showModal = true" class="main-button fixed bottom-16 right-3"><IconClock class="w-6" /></button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import alarm from '@/assets/sounds/alarm.mp3';
import IconClose from '@/components/icons/IconClose.vue';
import IconClock from '@/components/icons/IconClock.vue';

const isPlay = ref<boolean>(false);
const finishTime = ref<boolean>(false);
const time = ref<number>(0);
let timer: NodeJS.Timeout | null = null;
const $audio = ref<HTMLAudioElement>();

const showModal = ref<boolean>(false);

const decrementTimer = () => {
  if (time.value == 0) return;
  time.value -= 5;
};

const incrementTimer = () => {
  time.value += 5;
};

const stopTimer = () => {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
    isPlay.value = false;
  }
};

const playTime = () => {
  if (time.value == 0) return;
  isPlay.value = true;
  timer = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    } else {
      stopTimer();
    }
  }, 1000);
};

const playAudio = () => {
  if (!$audio.value) return;
  $audio.value.play();
};

const stopAudio = () => {
  if (!$audio.value) return;
  $audio.value.pause();
};

const closeTime = () => {
  stopTimer();
  stopAudio();
  showModal.value = false;
};

watch(time, () => {
  if (!$audio.value) return;

  if (time.value <= 0) {
    playAudio();
    finishTime.value = true;
  }
});
</script>
