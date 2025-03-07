<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
      Ваша статистика
    </h1>
    
    <div v-if="userStore.hasQuit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <UCard class="border-t-4 border-t-primary-500">
          <div class="p-5 text-center">
            <h3 class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Время без курения</h3>
            <div class="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
              {{ formatTime(userStore.timeSinceQuit) }}
            </div>
          </div>
        </UCard>
        
        <UCard class="border-t-4 border-t-blue-500">
          <div class="p-5 text-center">
            <h3 class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Не выкурено</h3>
            <div class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {{ userStore.cigarettesNotSmoked }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Это примерно {{ Math.floor(userStore.cigarettesNotSmoked / userStore.cigarettesInPack) }} пачек
            </div>
          </div>
        </UCard>
        
        <UCard class="border-t-4 border-t-yellow-500">
          <div class="p-5 text-center">
            <h3 class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Сэкономлено денег</h3>
            <div class="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {{ userStore.moneySaved }} EUR
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              На эти деньги можно купить {{ suggestPurchase() }}
            </div>
          </div>
        </UCard>
        
        <UCard class="border-t-4 border-t-green-500">
          <div class="p-5 text-center">
            <h3 class="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Сохраненное время</h3>
            <div class="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
              {{ savedTime }} часов
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Столько времени вы сэкономили, не выходя на перекуры
            </div>
          </div>
        </UCard>
      </div>
      
      <div class="mb-8">
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <UButton
            v-for="period in periods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            :color="selectedPeriod === period.value ? 'primary' : 'gray'"
            :variant="selectedPeriod === period.value ? 'solid' : 'ghost'"
            size="sm"
            class="rounded-full"
          >
            {{ period.label }}
          </UButton>
        </div>
        
        <ClientOnly>
          <ProgressChart 
            title="Сэкономленные деньги" 
            type="money" 
            :days="selectedPeriod" 
          />
        </ClientOnly>
        
        <ClientOnly>
          <ProgressChart 
            title="Непокуренные сигареты" 
            type="cigarettes" 
            :days="selectedPeriod" 
          />
        </ClientOnly>
        
        <ClientOnly>
          <ProgressChart 
            title="Улучшение здоровья" 
            type="health" 
            :days="selectedPeriod" 
          />
        </ClientOnly>
      </div>
      
      <UCard class="mb-8" :ui="{ ring: '', header: { padding: 'px-6 py-4' } }">
        <template #header>
          <h2 class="text-xl font-semibold text-primary-600 dark:text-primary-400">
            Влияние на здоровье
          </h2>
        </template>
        
        <div class="p-6">
          <p class="mb-6 text-gray-700 dark:text-gray-300">
            Отказавшись от курения, вы значительно улучшили свое здоровье. Вот некоторые преимущества, которые вы уже получили:
          </p>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div 
              v-for="(benefit, index) in healthBenefits" 
              :key="index" 
              class="p-3 rounded-md"
              :class="isBenefitActive(benefit.days) ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary-500' : 'bg-gray-50 dark:bg-gray-800/30 border-l-4 border-l-gray-200 dark:border-l-gray-700'"
            >
              <span 
                class="font-bold mr-2"
                :class="isBenefitActive(benefit.days) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'"
              >
                {{ benefit.days }} дней:
              </span>
              <span :class="isBenefitActive(benefit.days) ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'">
                {{ benefit.description }}
              </span>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    
    <div v-else>
      <UCard :ui="{ ring: '', header: { padding: 'p-6' }, body: { base: 'px-6 py-10' }, footer: { padding: 'p-6' } }">
        <template #header>
          <h2 class="text-xl font-semibold text-center">Нет данных для отображения</h2>
        </template>
        
        <p class="text-center text-lg text-gray-700 dark:text-gray-300 mb-6">
          Укажите дату отказа от курения на главной странице, чтобы увидеть свою статистику.
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
import { ref, computed } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const periods = [
  { label: '7 дней', value: 7 },
  { label: '30 дней', value: 30 },
  { label: '90 дней', value: 90 },
  { label: '365 дней', value: 365 },
];

const selectedPeriod = ref(30);

const formatTime = (time) => {
  const { days, hours, minutes } = time;
  
  let result = '';
  if (days > 0) {
    result += `${days} дней `;
  }
  if (hours > 0 || days > 0) {
    result += `${hours} часов `;
  }
  result += `${minutes} минут`;
  
  return result;
};

const savedTime = computed(() => {
  return Math.floor((userStore.cigarettesNotSmoked * 10) / 60);
});

const suggestPurchase = () => {
  const money = userStore.moneySaved;
  
  if (money < 500) {
    return 'хорошую книгу или обед в кафе';
  } else if (money < 2000) {
    return 'поход в хороший ресторан или на концерт';
  } else if (money < 5000) {
    return 'новую одежду или гаджеты';
  } else if (money < 15000) {
    return 'новый смартфон или планшет';
  } else if (money < 40000) {
    return 'небольшое путешествие или новую технику';
  } else if (money < 100000) {
    return 'хороший отпуск или новый ноутбук';
  } else {
    return 'серьезное путешествие или существенную покупку';
  }
};

const healthBenefits = [
  { days: 1, description: 'Уровень кислорода в крови нормализуется, а риск сердечного приступа начинает снижаться.' },
  { days: 2, description: 'Обоняние и вкусовые ощущения улучшаются, нервные окончания начинают восстанавливаться.' },
  { days: 3, description: 'Уровень угарного газа в крови снижается до нормального уровня.' },
  { days: 5, description: 'Большинство никотина выводится из организма.' },
  { days: 10, description: 'Кашель уменьшается, дыхание становится легче.' },
  { days: 14, description: 'Функция легких увеличивается, кровообращение улучшается.' },
  { days: 30, description: 'Уменьшается одышка и повышается общая энергичность.' },
  { days: 60, description: 'Риск сердечно-сосудистых заболеваний начинает значительно снижаться.' },
  { days: 90, description: 'Функция легких значительно улучшается, повышается сопротивляемость инфекциям.' },
  { days: 180, description: 'Уровень стресса снижается, улучшается внешний вид кожи.' },
  { days: 270, description: 'Здоровье легких продолжает улучшаться, снижается риск респираторных инфекций.' },
  { days: 365, description: 'Риск сердечно-сосудистых заболеваний снижается наполовину относительно курильщика.' },
];

const isBenefitActive = (requiredDays) => {
  return userStore.timeSinceQuit.days >= requiredDays;
};
</script>