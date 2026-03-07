<template>
  <div>
    <div v-if="userStore.hasQuit" class="text-center select-none">

      <!-- Label -->
      <div class="text-[10px] tracking-[0.5em] text-white/50 uppercase mb-4 shadow-text">
        без&nbsp;курения
      </div>

      <!-- Days -->
      <div class="text-[120px] sm:text-[150px] md:text-[170px] font-black text-white leading-none tabular-nums tracking-tight days-shadow">
        {{ timeSinceQuit.days }}
      </div>

      <!-- Word form -->
      <div class="text-sm tracking-[0.35em] text-white/60 uppercase mt-2 mb-8 shadow-text">
        {{ getWordForm(timeSinceQuit.days, dayForms) }}
      </div>

      <!-- Thin separator -->
      <div class="h-px bg-white/15 mx-auto w-40 mb-7"></div>

      <!-- H · M · S -->
      <div class="flex items-center justify-center gap-6 sm:gap-10 mb-7">
        <div class="text-center shadow-text">
          <div class="text-2xl sm:text-3xl font-light text-white tabular-nums">
            {{ String(timeSinceQuit.hours).padStart(2, '0') }}
          </div>
          <div class="text-[9px] text-white/40 uppercase tracking-widest mt-1">
            {{ getWordForm(timeSinceQuit.hours, hourForms) }}
          </div>
        </div>
        <div class="text-white/25 text-xl mb-5">·</div>
        <div class="text-center shadow-text">
          <div class="text-2xl sm:text-3xl font-light text-white tabular-nums">
            {{ String(timeSinceQuit.minutes).padStart(2, '0') }}
          </div>
          <div class="text-[9px] text-white/40 uppercase tracking-widest mt-1">
            {{ getWordForm(timeSinceQuit.minutes, minuteForms) }}
          </div>
        </div>
        <div class="text-white/25 text-xl mb-5">·</div>
        <div class="text-center shadow-text">
          <div class="text-2xl sm:text-3xl font-light text-white/45 tabular-nums">
            {{ String(timeSinceQuit.seconds).padStart(2, '0') }}
          </div>
          <div class="text-[9px] text-white/25 uppercase tracking-widest mt-1">
            {{ getWordForm(timeSinceQuit.seconds, secondForms) }}
          </div>
        </div>
      </div>

      <!-- Progress -->
      <div class="max-w-[180px] mx-auto shadow-text">
        <div class="bg-white/[0.12] rounded-full h-px overflow-hidden">
          <div
            class="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${progressPercent}%`"
          ></div>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-[10px] text-white/30">{{ progressPercent }}% цели</span>
          <span class="text-[10px] text-white/20">{{ timeSinceQuit.days }} / 21</span>
        </div>
      </div>

      <!-- Reset -->
      <div v-if="showResetButton" class="mt-6">
        <button @click="showResetConfirm = true"
          class="text-xs text-white/20 hover:text-white/50 transition-colors shadow-text">
          Сбросить прогресс
        </button>
      </div>
    </div>

    <!-- Not started -->
    <div v-else class="text-center select-none">
      <div class="text-[10px] tracking-[0.5em] text-white/40 uppercase mb-8 shadow-text">
        clean&nbsp;day
      </div>
      <p class="text-white/70 mb-10 text-base sm:text-lg leading-relaxed shadow-text">
        Начните свой путь<br>к здоровому образу жизни
      </p>
      <button @click="startQuit"
        class="bg-green-600 text-white font-medium text-sm py-3 px-10 rounded-full transition active:scale-95 hover:bg-green-500 shadow-lg">
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
        <UButton color="gray" @click="showResetConfirm = false">Отмена</UButton>
        <UButton color="red" @click="resetProgress">Сбросить</UButton>
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

const progressPercent = computed(() => {
  return Math.min(Math.round((timeSinceQuit.value.days / 21) * 100), 100);
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
    seconds: Math.floor((diffMs % (1000 * 60)) / 1000),
  };
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

.days-shadow {
  text-shadow:
    0 4px 40px rgba(0, 0, 0, 0.9),
    0 2px 12px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(0, 0, 0, 0.4);
}

.shadow-text {
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.7);
}
</style>
