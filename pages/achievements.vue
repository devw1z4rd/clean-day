<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
      Ваши достижения
    </h1>
    
    <UCard class="mb-8" :ui="{ ring: '', divide: '', body: { base: 'p-6' } }">
      <UProgress
        :value="achievementsStore.achievementProgress"
        color="primary"
        size="lg"
        class="mb-3"
      />
      <div class="text-center text-gray-700 dark:text-gray-300">
        Открыто <span class="font-semibold">{{ achievementsStore.unlockedCount }}</span> 
        из <span class="font-semibold">{{ achievementsStore.achievements.length }}</span> достижений
        (<span class="font-semibold">{{ achievementsStore.achievementProgress }}%</span>)
      </div>
    </UCard>
    
    <div v-if="userStore.hasQuit">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <UCard
          v-for="achievement in achievementsStore.achievements" 
          :key="achievement.id" 
          class="relative transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          :class="achievement.unlocked ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-gray-300 dark:border-t-gray-600 opacity-80'"
          :ui="{ ring: '', body: { base: 'p-5' } }"
        >
          <div class="absolute top-3 right-3">
            <UBadge 
              :color="achievement.unlocked ? 'green' : 'gray'" 
              :variant="achievement.unlocked ? 'solid' : 'soft'"
              class="text-xs uppercase tracking-wider"
            >
              {{ achievement.unlocked ? 'Получено' : 'Заблокировано' }}
            </UBadge>
          </div>
          
          <div class="flex flex-col items-center mb-4">
            <div class="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl mb-4">
              {{ getEmojiForIcon(achievement.icon) }}
            </div>
            <h3 class="text-lg font-semibold mb-2 text-center" :class="achievement.unlocked ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'">
              {{ achievement.title }}
            </h3>
          </div>
          
          <p v-if="achievement.unlocked" class="text-gray-700 dark:text-gray-300 text-center">
            {{ achievement.description }}
          </p>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center italic">
            {{ getAchievementHint(achievement) }}
          </p>
        </UCard>
      </div>
    </div>
    
    <div v-else>
      <UCard :ui="{ ring: '', header: { padding: 'p-6' }, body: { base: 'px-6 py-10' }, footer: { padding: 'p-6' } }">
        <template #header>
          <h2 class="text-xl font-semibold text-center">Начните свой путь к здоровью</h2>
        </template>
        
        <p class="text-center text-lg text-gray-700 dark:text-gray-300 mb-6">
          Укажите дату отказа от курения на главной странице, чтобы начать получать достижения.
        </p>
        
        <template #footer>
          <div class="flex justify-center">
            <UButton
              to="/"
              color="primary"
              size="lg"
              class="rounded-full px-6"
            >
              Перейти на главную
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const dayForms = ['день', 'дня', 'дней'];
const cigaretteForms = ['сигарету', 'сигареты', 'сигарет'];

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