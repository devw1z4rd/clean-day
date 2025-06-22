<template>
  <div class="hidden md:block">
    <UCard class="mb-8 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6">
      <template #header>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center uppercase tracking-wide">
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
        
        <div v-if="showResetButton" class="mt-6">
          <UButton color="red" variant="soft" @click="showResetConfirm = true" size="sm" icon="i-heroicons-arrow-path">
            Я сорвался
          </UButton>
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
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-3">
        Время без курения
      </h2>

      <div v-if="userStore.hasQuit" class="flex flex-col">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-4 text-center">
          <div class="text-5xl font-bold text-primary-600 dark:text-primary-400">
            {{ timeSinceQuit.days }}
          </div>
          <div class="text-sm uppercase font-medium text-gray-500 dark:text-gray-400 mt-1">
            {{ getWordForm(timeSinceQuit.days, dayForms) }}
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
        
        <div v-if="showResetButton" class="flex justify-center mt-4">
          <UButton color="red" variant="soft" @click="showResetConfirm = true" size="sm" icon="i-heroicons-arrow-path" class="w-full">
            Я сорвался
          </UButton>
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
  
  <UModal v-model="showResetConfirm">
    <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 text-red-600" size="sm" />
          <h3 class="text-lg font-semibold">Сбросить прогресс?</h3>
        </div>
      </template>

      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Вы уверены, что хотите сбросить весь прогресс? Все ваши достижения и статистика будут сохранены, но счетчик времени будет сброшен.
      </p>

      <div class="flex justify-end gap-2">
        <UButton color="gray" @click="showResetConfirm = false">
          Отмена
        </UButton>
        <UButton color="red" @click="resetProgress">
          Сбросить
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const showResetConfirm = ref(false);
const timeSinceQuit = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });

const dayForms = ['день', 'дня', 'дней'];
const hourForms = ['час', 'часа', 'часов'];
const minuteForms = ['минута', 'минуты', 'минут'];
const secondForms = ['секунда', 'секунды', 'секунд'];

// Computed property to determine if the reset button should be shown
const showResetButton = computed(() => {
  if (!userStore.hasQuit) return false;
  
  // Show reset button only if the user has been smoke-free for more than 2 hours
  const totalHours = timeSinceQuit.value.days * 24 + timeSinceQuit.value.hours;
  return totalHours >= 2;
});

const getWordForm = (number, forms) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2]; 
  }
  
  if (lastDigit === 1) {
    return forms[0]; 
  }
  
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]; 
  }
  
  return forms[2]; 
};

const timeUnits = computed(() => [
  { 
    label: getWordForm(timeSinceQuit.value.days, dayForms), 
    value: timeSinceQuit.value.days 
  },
  { 
    label: getWordForm(timeSinceQuit.value.hours, hourForms), 
    value: timeSinceQuit.value.hours 
  },
  { 
    label: getWordForm(timeSinceQuit.value.minutes, minuteForms), 
    value: timeSinceQuit.value.minutes 
  },
  { 
    label: getWordForm(timeSinceQuit.value.seconds, secondForms), 
    value: timeSinceQuit.value.seconds 
  }
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