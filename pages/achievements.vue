<template>
  <div>
    <div class="px-1 mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-6">
        Достижения
      </h1>

      <div class="mb-6">
        <div class="bg-[#161b22] rounded-full h-1.5 overflow-hidden">
          <div class="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
            :style="`width: ${achievementsStore.achievementProgress}%`"></div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-[11px] text-gray-500">{{ achievementsStore.achievementProgress }}%</span>
          <span class="text-[11px] text-gray-600">{{ achievementsStore.unlockedCount }} / {{ achievementsStore.achievements.length }}</span>
        </div>
      </div>
    </div>

    <div v-if="userStore.hasQuit">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
        <div
          v-for="achievement in sortedAchievements"
          :key="achievement.id"
          class="rounded-xl border p-5 transition-all duration-200"
          :class="achievement.unlocked
            ? 'border-green-500/20 bg-green-500/[0.03]'
            : 'border-[#30363d] bg-[#161b22]/50 opacity-60'"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="text-2xl">
              {{ getEmojiForIcon(achievement.icon) }}
            </div>
            <span class="text-[10px] uppercase tracking-widest"
              :class="achievement.unlocked ? 'text-green-500' : 'text-gray-600'">
              {{ achievement.unlocked ? 'Получено' : 'Закрыто' }}
            </span>
          </div>

          <h3 class="text-sm font-medium mb-1"
            :class="achievement.unlocked ? 'text-white' : 'text-gray-400'">
            {{ achievement.title }}
          </h3>

          <p class="text-xs leading-relaxed"
            :class="achievement.unlocked ? 'text-gray-400' : 'text-gray-600'">
            {{ achievement.unlocked ? achievement.description : getAchievementHint(achievement) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="rounded-xl border border-[#30363d] bg-[#161b22] py-10 px-6 text-center mx-1">
      <p class="text-gray-500 mb-6 text-sm">
        Укажите дату отказа от курения на главной странице, чтобы начать получать достижения.
      </p>
      <NuxtLink to="/"
        class="inline-block bg-green-600 text-white font-medium text-sm py-3 px-8 rounded-full transition active:scale-95 hover:bg-green-500">
        Перейти на главную
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const sortedAchievements = computed(() => {
  return [...achievementsStore.achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });
});

const dayForms = ['день', 'дня', 'дней'];
const cigaretteForms = ['сигарету', 'сигареты', 'сигарет'];

const getWordForm = (number, forms) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
};

const getEmojiForIcon = (iconName) => {
  const iconMap = {
    'mdi-star-circle': '🌟',
    'mdi-star-circle-outline': '⭐',
    'mdi-calendar-week': '📅',
    'mdi-calendar-weekend': '📆',
    'mdi-calendar-month': '📆',
    'mdi-calendar-text': '📅',
    'mdi-calendar-check': '✅',
    'mdi-calendar-star': '🌟',
    'mdi-currency-rub': '💰',
    'mdi-piggy-bank': '🐖',
    'mdi-cash-multiple': '💵',
    'mdi-smoking-off': '🚭',
    'mdi-lungs': '🫁',
    'mdi-heart-pulse': '💓',
  };

  return iconMap[iconName] || '🏆';
};

const getAchievementHint = (achievement) => {
  if (achievement.requiredDays) {
    return `Не курите ${achievement.requiredDays} ${getWordForm(achievement.requiredDays, dayForms)}`;
  }
  if (achievement.requiredMoney) {
    return `Сэкономьте ${achievement.requiredMoney} EUR`;
  }
  if (achievement.requiredCigarettes) {
    return `Не выкурите ${achievement.requiredCigarettes} ${getWordForm(achievement.requiredCigarettes, cigaretteForms)}`;
  }
  return 'Продолжайте не курить';
};

onMounted(() => {
  achievementsStore.initialize();
  achievementsStore.checkAchievements();
});
</script>
