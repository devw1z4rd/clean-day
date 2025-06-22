<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-white mb-8">
      Ваша статистика
    </h1>
    
    <div v-if="userStore.hasQuit">
     
      <!-- Прогресс здоровья -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <h2 class="text-lg font-semibold text-white mb-4">🫁 Восстановление здоровья</h2>
        
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-slate-300">Прогресс восстановления</span>
            <span class="text-green-400 font-semibold">{{ Math.round(healthProgress) }}%</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-3">
            <div 
              class="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
              :style="{ width: `${healthProgress}%` }"
            ></div>
          </div>
          <div class="text-sm text-slate-400 mt-2">{{ healthStatusText }}</div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="(benefit, index) in visibleHealthBenefits" 
            :key="index"
            class="p-4 rounded-lg border transition-all duration-300"
            :class="isBenefitActive(benefit.days) ? 'bg-green-900/30 border-green-500' : 'bg-slate-700/50 border-slate-600'"
          >
            <div class="flex items-start">
              <span 
                class="text-lg mr-3 mt-1"
                :class="isBenefitActive(benefit.days) ? '' : 'grayscale opacity-50'"
              >
                {{ isBenefitActive(benefit.days) ? '✅' : '⏳' }}
              </span>
              <div>
                <div 
                  class="font-semibold mb-1"
                  :class="isBenefitActive(benefit.days) ? 'text-green-400' : 'text-slate-400'"
                >
                  {{ benefit.days }} дней
                </div>
                <div 
                  class="text-sm"
                  :class="isBenefitActive(benefit.days) ? 'text-slate-200' : 'text-slate-500'"
                >
                  {{ benefit.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Достижения -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-white">🏆 Ваши достижения</h2>
          <div class="text-green-400 font-semibold">
            Открыто {{ achievedCount }} из {{ achievements.length }} ({{ Math.round((achievedCount / achievements.length) * 100) }}%)
          </div>
        </div>
        
        <div class="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-1000"
            :style="{ width: `${(achievedCount / achievements.length) * 100}%` }"
          ></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(achievement, index) in achievements" 
            :key="index"
            class="p-4 rounded-lg border transition-all duration-300"
            :class="achievement.achieved ? 'bg-green-900/30 border-green-500' : 'bg-slate-700/50 border-slate-600'"
          >
            <div class="flex items-center mb-3">
              <div 
                class="w-12 h-12 rounded-lg flex items-center justify-center mr-3 transition-all duration-300"
                :class="achievement.achieved ? 'bg-green-500' : 'bg-slate-600'"
              >
                <span class="text-xl">{{ achievement.icon }}</span>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span 
                    class="font-semibold"
                    :class="achievement.achieved ? 'text-white' : 'text-slate-400'"
                  >
                    {{ achievement.title }}
                  </span>
                  <span 
                    v-if="achievement.achieved"
                    class="bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    ПОЛУЧЕНО
                  </span>
                </div>
                <div 
                  class="text-sm"
                  :class="achievement.achieved ? 'text-slate-300' : 'text-slate-500'"
                >
                  {{ achievement.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Следующие цели -->
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-white mb-4">🎯 Следующие цели</h2>
        
        <div v-if="nextGoals.length > 0" class="space-y-4">
          <div 
            v-for="(goal, index) in nextGoals" 
            :key="index"
            class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
                <span class="text-lg">{{ goal.icon }}</span>
              </div>
              <div>
                <div class="font-semibold text-white">{{ goal.title }}</div>
                <div class="text-sm text-slate-400">{{ goal.description }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-slate-400">через</div>
              <div class="font-semibold text-green-400">{{ goal.daysLeft }} дней</div>
            </div>
          </div>
        </div>
        
        <div v-else class="text-center py-8">
          <div class="text-4xl mb-4">🎉</div>
          <div class="text-lg font-semibold text-white mb-2">Поздравляем!</div>
          <div class="text-slate-400">Вы достигли всех основных целей!</div>
        </div>
      </div>
      
    </div>
    
    <div v-else>
      <div class="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
        <div class="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center mx-auto mb-6">
          <span class="text-2xl">📊</span>
        </div>
        
        <h2 class="text-xl font-semibold text-white mb-4">
          Нет данных для отображения
        </h2>
        
        <p class="text-slate-400 mb-6 max-w-md mx-auto">
          Укажите дату отказа от курения на главной странице, чтобы увидеть свою статистику.
        </p>
        
        <UButton
          to="/"
          color="primary"
          size="lg"
          class="rounded-lg px-6"
        >
          Перейти на главную
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const savedTime = computed(() => {
  return Math.floor((userStore.cigarettesNotSmoked * 10) / 60);
});

const healthProgress = computed(() => {
  const days = userStore.timeSinceQuit.days;
  return Math.min((days / 365) * 100, 100);
});

const healthStatusText = computed(() => {
  const progress = healthProgress.value;
  if (progress < 10) return 'Организм начинает восстанавливаться';
  if (progress < 25) return 'Заметные улучшения в дыхании';
  if (progress < 50) return 'Значительное восстановление легких';
  if (progress < 75) return 'Существенное укрепление здоровья';
  return 'Практически полное восстановление';
});

const achievements = computed(() => {
  const days = userStore.timeSinceQuit.days;
  const money = userStore.moneySaved;
  const cigarettes = userStore.cigarettesNotSmoked;
  
  return [
    {
      icon: '🌅',
      title: 'Первый день',
      description: 'Продержались целый день без курения',
      achieved: days >= 1
    },
    {
      icon: '💪',
      title: 'Сила воли',
      description: 'Три дня подряд без сигарет',
      achieved: days >= 3
    },
    {
      icon: '🎯',
      title: 'Неделя силы',
      description: 'Целая неделя без курения',
      achieved: days >= 7
    },
    {
      icon: '💰',
      title: 'Экономист',
      description: 'Сэкономили первые €50',
      achieved: money >= 50
    },
    {
      icon: '🚭',
      title: 'Отказник',
      description: 'Не выкурили 100 сигарет',
      achieved: cigarettes >= 100
    },
    {
      icon: '🏆',
      title: 'Месяц победы',
      description: 'Целый месяц без курения',
      achieved: days >= 30
    },
    {
      icon: '💎',
      title: 'Чемпион',
      description: 'Три месяца без курения',
      achieved: days >= 90
    },
    {
      icon: '👑',
      title: 'Легенда',
      description: 'Целый год без курения',
      achieved: days >= 365
    }
  ];
});

const achievedCount = computed(() => {
  return achievements.value.filter(a => a.achieved).length;
});

const nextGoals = computed(() => {
  const days = userStore.timeSinceQuit.days;
  
  const goals = [
    { days: 1, icon: '🌅', title: 'Первый день', description: 'Продержаться целый день' },
    { days: 3, icon: '💪', title: 'Три дня силы', description: 'Преодолеть первый барьер' },
    { days: 7, icon: '🎯', title: 'Неделя без курения', description: 'Важная веха в отказе' },
    { days: 30, icon: '🏆', title: 'Месяц свободы', description: 'Серьезное достижение' },
    { days: 90, icon: '💎', title: 'Квартал здоровья', description: 'Кардинальные изменения' },
    { days: 365, icon: '👑', title: 'Год без сигарет', description: 'Полная трансформация' }
  ];
  
  return goals
    .filter(goal => days < goal.days)
    .slice(0, 3)
    .map(goal => ({
      ...goal,
      daysLeft: goal.days - days
    }));
});

const visibleHealthBenefits = computed(() => {
  const allBenefits = [
    { days: 1, description: 'Уровень кислорода в крови нормализуется' },
    { days: 2, description: 'Обоняние и вкус улучшаются' },
    { days: 3, description: 'Уровень угарного газа снижается' },
    { days: 7, description: 'Дыхание становится легче' },
    { days: 14, description: 'Кровообращение улучшается' },
    { days: 30, description: 'Функция легких увеличивается' },
    { days: 90, description: 'Значительное улучшение здоровья' },
    { days: 365, description: 'Риск болезней сердца снижается вдвое' }
  ];
  
  const days = userStore.timeSinceQuit.days;
  
  // Показываем достигнутые + следующие 2-3 цели
  const achieved = allBenefits.filter(b => days >= b.days);
  const upcoming = allBenefits.filter(b => days < b.days).slice(0, 3);
  
  return [...achieved.slice(-3), ...upcoming].slice(0, 6);
});

const motivationalMessage = computed(() => {
  const days = userStore.timeSinceQuit.days;
  
  if (days === 1) return 'Отличная работа! Первый день - самый сложный, и вы справились!';
  if (days < 7) return 'Продолжайте в том же духе! Каждый день делает вас сильнее.';
  if (days < 30) return 'Невероятно! Ваше тело уже начинает восстанавливаться.';
  if (days < 90) return 'Потрясающий результат! Вы на пути к полному восстановлению.';
  if (days < 365) return 'Выдающееся достижение! Ваше здоровье кардинально улучшилось.';
  return 'Легендарный результат! Вы полностью изменили свою жизнь к лучшему!';
});

const suggestPurchase = () => {
  const money = userStore.moneySaved;
  
  if (money < 50) return 'хороший кофе на неделю';
  if (money < 100) return 'качественную книгу';
  if (money < 300) return 'поход в ресторан';
  if (money < 500) return 'новую одежду';
  if (money < 1000) return 'современный гаджет';
  if (money < 2000) return 'короткое путешествие';
  return 'серьезную покупку мечты';
};

const isBenefitActive = (requiredDays) => {
  return userStore.timeSinceQuit.days >= requiredDays;
};
</script>