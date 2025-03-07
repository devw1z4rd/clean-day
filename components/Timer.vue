<template>
  <div class="hidden md:block">
    <UCard class="mb-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
      <template #header>
        <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400 text-center uppercase tracking-wide">
          Время без курения
        </h2>
      </template>

      <div v-if="userStore.hasQuit" class="py-6 flex flex-col items-center">
        <div class="grid grid-cols-4 gap-4 text-center">
          <div v-for="(unit, index) in timeUnits" :key="index" class="flex flex-col items-center">
            <div
              class="w-24 h-24 flex items-center justify-center bg-primary-500 text-white text-3xl font-bold rounded-lg shadow-md">
              {{ unit.value }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mt-2 uppercase tracking-wide">
              {{ unit.label }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-10 text-center">
        <p class="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Начните свой путь к здоровому образу жизни прямо сейчас!
        </p>
        <UButton color="primary" size="xl" @click="startQuit"
          class="rounded-full px-8 shadow-md hover:bg-primary-700 transition">
          Бросить курить
        </UButton>
      </div>
    </UCard>
  </div>

  <div class="block md:hidden">
    <div
      class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-5 mb-4">
      <h2 class="text-xl font-bold text-primary-700 dark:text-primary-300 text-center mb-3">
        Время без курения
      </h2>

      <div v-if="userStore.hasQuit" class="flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 text-center">
          <div class="text-5xl font-bold text-primary-600 dark:text-primary-400">
            {{ timeSinceQuit.days }}
          </div>
          <div class="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mt-1">
            дней
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div v-for="(unit, index) in timeUnits.slice(1)" :key="index"
            class="bg-white dark:bg-gray-800 rounded-lg shadow p-3 text-center">
            <div class="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {{ unit.value }}
            </div>
            <div class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
              {{ unit.label }}
            </div>
          </div>
        </div>

        <div class="mt-4 bg-white dark:bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
          <div class="h-full bg-gradient-to-r from-green-400 to-primary-500"
            :style="`width: ${calculateProgressPercentage()}%`"></div>
        </div>
        <div class="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
          Прогресс: {{ calculateProgressPercentage() }}%
        </div>
      </div>

      <div v-else class="py-8 text-center">
        <p class="text-base mb-6 text-gray-700 dark:text-gray-300">
          Начните свой путь к здоровому образу жизни прямо сейчас!
        </p>
        <button @click="startQuit"
          class="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 active:scale-95">
          Бросить курить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const showResetConfirm = ref(false);
const timeSinceQuit = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });

const timeUnits = computed(() => [
  { label: 'Дней', value: timeSinceQuit.value.days },
  { label: 'Часов', value: timeSinceQuit.value.hours },
  { label: 'Минут', value: timeSinceQuit.value.minutes },
  { label: 'Секунд', value: timeSinceQuit.value.seconds }
]);

const calculateTimeDifference = () => {
  if (!userStore.quitDate) return;
  const quitDate = new Date(userStore.quitDate);
  const now = new Date();
  const diffMs = now - quitDate;

  timeSinceQuit.value = {
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffMs % (1000 * 60)) / 1000)
  };
};

const calculateProgressPercentage = () => {
  const goalDays = 100;
  const percentage = Math.min(Math.round((timeSinceQuit.value.days / goalDays) * 100), 100);
  return percentage;
};

let timer = null;

onMounted(() => {
  calculateTimeDifference();
  timer = setInterval(() => {
    calculateTimeDifference();
    achievementsStore.checkAchievements();
  }, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const startQuit = () => {
  userStore.setQuitDate(new Date().toISOString());
  calculateTimeDifference();
};

const resetProgress = () => {
  userStore.resetProgress();
  showResetConfirm.value = false;
};
</script>