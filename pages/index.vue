<template>
  <div>
    <Timer />

    <div v-if="userStore.hasQuit">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <UCard v-for="(stat, index) in statsData" :key="index" class="transition-all hover:-translate-y-1 duration-300"
          :ui="{
            ring: '',
            header: { padding: 'px-6 py-4' },
            body: { base: 'p-4' }
          }" >
          <div class="flex items-center">
            <div class="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center mr-4" :class="{
              'bg-primary-50 text-primary-500': index === 0,
              'bg-blue-50 text-blue-500': index === 1,
              'bg-yellow-50 text-yellow-500': index === 2
            }">
              <span class="text-2xl">{{ stat.icon }}</span>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {{ stat.title }}
              </h3>
              <div class="text-xl md:text-2xl font-bold mt-1" :class="{
                'text-primary-600': index === 0,
                'text-blue-600': index === 1,
                'text-yellow-600': index === 2
              }">
                {{ stat.value }}
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <UCard
        class="mb-8 bg-primary-50 dark:bg-primary-950 dark:bg-opacity-30 border border-primary-100 dark:border-primary-900"
        :ui="{
          ring: '',
          header: { padding: 'px-6 py-4' },
          body: { base: 'p-5' },
          footer: { padding: 'px-6 py-4' }
        }">
        <template #header>
          <h2 class="text-xl font-semibold text-primary-700 dark:text-primary-300 text-center">
            Факт дня
          </h2>
        </template>

        <transition name="fade" mode="out-in">
          <p :key="currentFact" class="text-lg text-gray-700 dark:text-gray-300 italic text-center">
            {{ currentFact }}
          </p>
        </transition>

        <template #footer>
          <div class="flex justify-center">
            <UButton color="primary" variant="soft" @click="getRandomFact" icon="i-heroicons-arrow-path"
              class="rounded-full">
              Новый факт
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard class="mb-8" :ui="{
        ring: '',
        header: { padding: 'px-6 py-4' },
        body: { base: 'p-5' },
        footer: { padding: 'px-0 py-0' }
      }">
        <template #header>
          <h2 class="text-xl font-semibold text-center">
            Улучшения здоровья
          </h2>
        </template>

        <UTabs :items="[
          { label: 'Все', slot: 'all' },
          { label: 'Достигнуто', slot: 'active' },
          { label: 'Предстоит', slot: 'upcoming' }
        ]" class="mb-4">
          <template #all>
            <ul class="space-y-3 pt-4">
              <li v-for="(item, index) in healthImprovements" :key="index" class="p-3 rounded-md"
                :class="isActive(item.time) ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary-500' : 'bg-gray-50 dark:bg-gray-800/30 border-l-4 border-l-gray-200 dark:border-l-gray-700'">
                <span class="font-bold mr-2"
                  :class="isActive(item.time) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'">
                  {{ item.time }}:
                </span>
                <span
                  :class="isActive(item.time) ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'">
                  {{ item.description }}
                </span>
              </li>
            </ul>
          </template>

          <template #active>
            <ul class="space-y-3 pt-4">
              <li v-for="(item, index) in healthImprovements.filter(item => isActive(item.time))" :key="index"
                class="p-3 rounded-md bg-primary-50 dark:bg-primary-900/30 border-l-4 border-l-primary-500">
                <span class="font-bold mr-2 text-primary-600 dark:text-primary-400">
                  {{ item.time }}:
                </span>
                <span class="text-gray-800 dark:text-gray-100">
                  {{ item.description }}
                </span>
              </li>
            </ul>
          </template>

          <template #upcoming>
            <ul class="space-y-3 pt-4">
              <li v-for="(item, index) in healthImprovements.filter(item => !isActive(item.time))" :key="index"
                class="p-3 rounded-md bg-gray-50 dark:bg-gray-800/30 border-l-4 border-l-gray-200 dark:border-l-gray-700">
                <span class="font-bold mr-2 text-gray-500 dark:text-gray-400">
                  {{ item.time }}:
                </span>
                <span class="text-gray-500 dark:text-gray-400">
                  {{ item.description }}
                </span>
              </li>
            </ul>
          </template>
        </UTabs>
      </UCard>

      <div class="mb-8">
        <h2 class="text-xl font-semibold text-center mb-6">
          Часто задаваемые вопросы
        </h2>

        <div class="grid grid-cols-1 gap-4">
          <UCard v-for="(item, index) in faqItems" :key="index" 
            class="overflow-hidden transition-all duration-300"
          >
            <div class="p-5">
              <div 
                @click="toggleFaq(index)" 
                class="flex items-center justify-between cursor-pointer"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4"
                    :class="{
                      'bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400': index === 0,
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400': index === 1,
                      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400': index === 2
                    }">
                    <UIcon name="i-heroicons-question-mark-circle" class="text-xl" />
                  </div>
                  <h3 class="text-lg font-bold">
                    {{ item.question }}
                  </h3>
                </div>
                <div class="transition-transform duration-300" :class="{'rotate-180': openFaqs[index]}">
                  <UIcon name="i-heroicons-chevron-down" class="text-xl" />
                </div>
              </div>
              
              <div 
                class="overflow-hidden transition-all duration-300"
                :class="[openFaqs[index] ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0']"
              >
                <div class="ml-14 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {{ item.answer }}
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const cigaretteForms = ['сигарета', 'сигареты', 'сигарет'];

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

const statsData = computed(() => [
  {
    icon: '💰',
    title: 'Сэкономлено:',
    value: `${userStore.moneySaved} EUR`
  },
  {
    icon: '🚭',
    title: 'Не выкурено:',
    value: `${userStore.cigarettesNotSmoked} ${getWordForm(userStore.cigarettesNotSmoked, cigaretteForms)}`
  },
  {
    icon: '🏆',
    title: 'Достижения:',
    value: `${achievementsStore.unlockedCount} / ${achievementsStore.achievements.length}`
  }
]);

const healthImprovements = [
  { time: '20 минут', description: 'Пульс и кровяное давление начинают приходить в норму.' },
  { time: '12 часов', description: 'Уровень угарного газа в крови снижается до нормы.' },
  { time: '24 часа', description: 'Снижается риск сердечного приступа.' },
  { time: '48 часов', description: 'Вкусовые рецепторы и обоняние начинают восстанавливаться.' },
  { time: '72 часа', description: 'Дыхательная система начинает функционировать лучше.' },
  { time: '2 недели', description: 'Улучшается кровообращение и функция легких.' },
  { time: '1 месяц', description: 'Уменьшается кашель и одышка.' },
  { time: '3 месяца', description: 'Функция легких увеличивается на 30%.' },
  { time: '9 месяцев', description: 'Уменьшаются инфекции легких и кашель.' },
  { time: '1 год', description: 'Риск сердечно-сосудистых заболеваний снижается вдвое.' },
  { time: '5 лет', description: 'Риск рака ротовой полости, горла и пищевода снижается вдвое.' },
  { time: '10 лет', description: 'Риск рака легких снижается на 50%.' },
  { time: '15 лет', description: 'Риск сердечно-сосудистых заболеваний становится таким же, как у некурящего.' },
];

const facts = [
  'Курение ответственно за более чем 480,000 смертей ежегодно.',
  'Бросив курить, вы снижаете риск сердечного приступа уже через 24 часа.',
  'Никотин достигает мозга всего за 10 секунд после затяжки.',
  'Курение может привести к потере зрения и слепоте.',
  'Дети, живущие с курильщиками, чаще страдают от астмы и ушных инфекций.',
  'В сигаретах содержится более 7000 химических веществ, из которых 69 являются канцерогенными.',
  'Курение ускоряет старение кожи и приводит к ранним морщинам.',
  'Бросив курить, вы сможете лучше ощущать вкус еды.',
  'Курильщики в три раза чаще страдают от катаракты.',
  'Через 8 часов после отказа от курения уровень кислорода в крови возвращается к норме.',
  'Через 48 часов нервные окончания начинают восстанавливаться, и обоняние улучшается.',
  'Ежегодно во всем мире от последствий курения умирает около 6 миллионов человек.',
  'Курение делает волосы тоньше и может привести к раннему облысению.',
  'Курение влияет на иммунную систему, делая вас более восприимчивым к инфекциям.',
  'Отказ от курения приводит к улучшению настроения и снижению стресса в долгосрочной перспективе.',
];

const faqItems = [
  {
    question: 'Как справиться с тягой к курению?',
    answer: 'Тяга к курению обычно длится всего 3-5 минут. Попробуйте сделать глубокий вдох, выпить стакан воды, прогуляться или заняться чем-то, что отвлечет вас. Используйте функцию достижений в Clean Day как дополнительную мотивацию - каждый раз, когда вы преодолеваете желание закурить, вы становитесь на шаг ближе к новому достижению.'
  },
  {
    question: 'Как долго продлятся симптомы отказа от курения?',
    answer: 'Симптомы отказа от курения обычно наиболее интенсивны в первую неделю и могут включать раздражительность, беспокойство, проблемы с концентрацией и повышенный аппетит. В большинстве случаев эти симптомы значительно уменьшаются через 2-4 недели. Приложение Clean Day поможет вам отслеживать прогресс и увидеть, как каждый день без сигарет улучшает ваше здоровье.'
  },
  {
    question: 'Повысится ли моя популярность среди друзей в школе?',
    answer: 'При использовании Clean Day спина становится шире, причёска - гуще, зубы - белее, бицепсы - больше. Вы гарантировано получите внимание женщин, уважение друзей и зависть недоброжелателей.'
  }
];

const currentFact = ref('');
const openFaqs = ref(faqItems.map(() => false));

const toggleFaq = (index) => {
  openFaqs.value[index] = !openFaqs.value[index];
};

const getRandomFact = () => {
  const randomIndex = Math.floor(Math.random() * facts.length);
  currentFact.value = facts[randomIndex];
};

const isActive = (timeStr) => {
  if (!userStore.hasQuit) return false;

  const days = userStore.timeSinceQuit.days;
  const hours = days * 24 + userStore.timeSinceQuit.hours;

  const timeMap = {
    '20 минут': hours > 0,
    '12 часов': hours >= 12,
    '24 часа': hours >= 24,
    '48 часов': hours >= 48,
    '72 часа': hours >= 72,
    '2 недели': days >= 14,
    '1 месяц': days >= 30,
    '3 месяца': days >= 90,
    '9 месяцев': days >= 270,
    '1 год': days >= 365,
    '5 лет': days >= 1825,
    '10 лет': days >= 3650,
    '15 лет': days >= 5475,
  };

  return timeMap[timeStr] || false;
};

onMounted(() => {
  getRandomFact();
  achievementsStore.initialize();
  achievementsStore.checkAchievements();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>