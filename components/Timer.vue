<template>
  <div class="mb-6 md:mb-8">
    <div v-if="userStore.hasQuit">
      <!-- Days row -->
      <div class="flex items-end justify-between mb-6 md:mb-8 px-1">
        <div>
          <div class="text-5xl md:text-8xl font-bold text-white tabular-nums leading-none">
            {{ timeSinceQuit.days }}
          </div>
          <div class="text-[11px] md:text-xs text-gray-600 mt-1.5 uppercase tracking-widest">
            {{ getWordForm(timeSinceQuit.days, dayForms) }}
          </div>
        </div>
        <div class="tabular-nums text-right pb-1">
          <div class="flex items-baseline gap-3 md:gap-4">
            <div>
              <div class="text-2xl md:text-4xl font-semibold text-white leading-none">{{ String(timeSinceQuit.hours).padStart(2, '0') }}</div>
              <div class="text-[10px] md:text-[11px] text-gray-600 uppercase tracking-widest mt-1">{{ getWordForm(timeSinceQuit.hours, hourForms) }}</div>
            </div>
            <div>
              <div class="text-2xl md:text-4xl font-semibold text-white leading-none">{{ String(timeSinceQuit.minutes).padStart(2, '0') }}</div>
              <div class="text-[10px] md:text-[11px] text-gray-600 uppercase tracking-widest mt-1">{{ getWordForm(timeSinceQuit.minutes, minuteForms) }}</div>
            </div>
            <div>
              <div class="text-2xl md:text-4xl font-semibold text-gray-500 leading-none">{{ String(timeSinceQuit.seconds).padStart(2, '0') }}</div>
              <div class="text-[10px] md:text-[11px] text-gray-700 uppercase tracking-widest mt-1">{{ getWordForm(timeSinceQuit.seconds, secondForms) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="px-1">
        <div class="bg-white/5 rounded-full h-1 overflow-hidden">
          <div class="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${calculateProgressPercentage()}%`"></div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-[11px] text-gray-600">{{ calculateProgressPercentage() }}% цели</span>
          <span class="text-[11px] text-gray-700">{{ timeSinceQuit.days }} / 21</span>
        </div>
      </div>

      <div v-if="showResetButton" class="mt-4 px-1">
        <button @click="showResetConfirm = true"
          class="text-xs text-gray-700 hover:text-gray-400 transition-colors">
          Сбросить прогресс
        </button>
      </div>
    </div>

    <div v-else class="rounded-xl border border-white/5 bg-[#111] py-10 md:py-14 px-6 text-center">
      <p class="text-gray-500 mb-6 text-sm md:text-base">
        Начните свой путь к здоровому образу жизни
      </p>
      <button @click="startQuit"
        class="bg-green-600 text-white font-medium text-sm md:text-base py-3 px-8 rounded-full transition active:scale-95 hover:bg-green-500">
        Бросить курить
      </button>
    </div>
  </div>

  <UModal v-model="showResetConfirm">
    <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 text-red-500" size="sm" />
          <h3 class="text-lg font-semibold">Сбросить прогресс?</h3>
        </div>
      </template>

      <p class="text-gray-400 mb-4">
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

const showResetButton = computed(() => {
  if (!userStore.hasQuit) return false;
  const totalHours = timeSinceQuit.value.days * 24 + timeSinceQuit.value.hours;
  return totalHours >= 2;
});

const getWordForm = (number, forms) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
};

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
  const goalDays = 21;
  return Math.min(Math.round((timeSinceQuit.value.days / goalDays) * 100), 100);
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

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
