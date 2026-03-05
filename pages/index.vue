<template>
  <div>
    <!-- Mobile: stacked. Desktop: split layout, centered -->
    <div class="md:flex md:gap-12 lg:gap-16 md:items-center md:min-h-[calc(100vh-8rem)] md:justify-center">
      <!-- Left: Timer, sticky on desktop -->
      <div class="md:w-[42%] lg:w-[38%] md:sticky md:top-20 md:self-center">
        <Timer />
      </div>

      <!-- Right: scrollable content -->
      <div class="md:flex-1" v-if="userStore.hasQuit">
        <!-- Stats -->
        <div v-if="isLoading" class="grid grid-cols-3 gap-6 mb-8 md:mb-10 px-1 md:px-0">
          <div v-for="i in 3" :key="i">
            <div class="h-3 skeleton rounded mb-2" style="width: 60%"></div>
            <div class="h-6 skeleton rounded" style="width: 80%"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-3 gap-6 mb-8 md:mb-10 px-1 md:px-0">
          <div v-for="(stat, index) in statsData" :key="index">
            <div class="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest mb-1">
              {{ stat.title }}
            </div>
            <div class="text-lg md:text-2xl font-semibold text-white tabular-nums">
              {{ stat.value }}
            </div>
          </div>
        </div>

        <!-- Fact / encouragement -->
        <div v-if="isLoading" class="mb-8 md:mb-10 px-1 md:px-0">
          <div class="h-4 skeleton rounded mb-2"></div>
          <div class="h-4 skeleton rounded" style="width: 75%"></div>
        </div>

        <div v-else class="mb-8 md:mb-10 px-1 md:px-0">
          <div class="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest mb-3">
            {{ userStore.hasUserName ? 'Подбадривание' : 'Факт дня' }}
          </div>
          <transition name="fade" mode="out-in">
            <p :key="currentMessage" class="text-sm md:text-base text-gray-400 leading-relaxed">
              {{ currentMessage }}
            </p>
          </transition>
        </div>

        <!-- Health improvements -->
        <div v-if="isLoading" class="mb-8 md:mb-10 px-1 md:px-0">
          <div class="h-4 skeleton rounded mb-4" style="width: 160px"></div>
          <div v-for="i in 3" :key="i" class="mb-2">
            <div class="h-4 skeleton rounded mb-1" style="width: 30%"></div>
            <div class="h-4 skeleton rounded" style="width: 80%"></div>
          </div>
        </div>

        <div v-else class="mb-8 md:mb-10 px-1 md:px-0">
          <div class="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest mb-4">
            Улучшения здоровья
          </div>

          <ul class="space-y-1">
            <li v-for="(item, index) in filteredHealthItems" :key="index"
              class="py-2 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3">
              <span class="text-xs font-medium shrink-0 w-20"
                :class="isActive(item.time) ? 'text-green-500' : 'text-gray-600'">
                {{ item.time }}
              </span>
              <span class="text-sm"
                :class="isActive(item.time) ? 'text-gray-300' : 'text-gray-500'">
                {{ item.description }}
              </span>
            </li>
          </ul>

          <div v-if="!showAllHealth && sortedHealthImprovements.length > 5" class="mt-3">
            <button @click="showAllHealth = true"
              class="text-xs text-gray-600 hover:text-gray-300 transition-colors">
              Показать все ({{ sortedHealthImprovements.length }})
            </button>
          </div>
          <div v-if="showAllHealth && sortedHealthImprovements.length > 5" class="mt-3">
            <button @click="showAllHealth = false"
              class="text-xs text-gray-600 hover:text-gray-300 transition-colors">
              Скрыть
            </button>
          </div>
        </div>

        <!-- FAQ -->
        <!-- <div class="mb-8 md:mb-10 px-1 md:px-0">
          <div v-if="isLoading">
            <div class="h-4 skeleton rounded mb-4" style="width: 200px"></div>
            <div v-for="i in 3" :key="i" class="mb-4">
              <div class="h-4 skeleton rounded mb-1" style="width: 60%"></div>
              <div class="h-3 skeleton rounded" style="width: 90%"></div>
            </div>
          </div>

          <div v-else>
            <div class="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest mb-4">
              Вопросы и ответы
            </div>
            <div class="space-y-6">
              <div v-for="(item, index) in faqItems" :key="index">
                <div class="text-sm text-gray-300 mb-1">{{ item.question }}</div>
                <div class="text-sm text-gray-500 leading-relaxed">{{ item.answer }}</div>
              </div>
            </div>
          </div>
        </div> -->
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
const currentMessage = ref('');
const showAllHealth = ref(false);
const isLoading = ref(true);

const getWordForm = (number, forms) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return forms[2];
  if (lastDigit === 1) return forms[0];
  if (lastDigit >= 2 && lastDigit <= 4) return forms[1];
  return forms[2];
};

const statsData = computed(() => [
  {
    title: 'Сэкономлено',
    value: `${userStore.moneySaved} EUR`
  },
  {
    title: 'Не выкурено',
    value: `${userStore.cigarettesNotSmoked} ${getWordForm(userStore.cigarettesNotSmoked, cigaretteForms)}`
  },
  {
    title: 'Достижения',
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

const sortedHealthImprovements = computed(() => {
  return [...healthImprovements].sort((a, b) => {
    const aActive = isActive(a.time);
    const bActive = isActive(b.time);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });
});

const filteredHealthItems = computed(() => {
  return showAllHealth.value
    ? sortedHealthImprovements.value
    : sortedHealthImprovements.value.slice(0, 5);
});

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

const encouragements = computed(() => {
  const name = userStore.userName;
  return [
    `${name}, вы молодец! Каждый день без сигарет — это победа!`,
    `${name}, ваша сила воли вдохновляет! Продолжайте в том же духе!`,
    `Отличная работа, ${name}! Ваше здоровье улучшается с каждым днем.`,
    `${name}, вы на верном пути к здоровой жизни!`,
    `Гордимся вами, ${name}! Уже ${userStore.timeSinceQuit.days} дней без курения!`,
    `${name}, ваше решение бросить курить — одно из лучших в вашей жизни!`,
    `Не сдавайтесь, ${name}! Вы уже достигли замечательных результатов!`,
    `${name}, ваши легкие говорят вам спасибо за каждый день без сигарет!`,
    `Представьте, ${name}, сколько полезного вы можете сделать на сэкономленные ${userStore.moneySaved} EUR!`,
    `${name}, чем дольше вы не курите, тем проще становится оставаться некурящим!`
  ];
});

const faqItems = [
  {
    question: 'Как справиться с тягой к курению?',
    answer: 'Тяга обычно длится 3-5 минут. Глубокий вдох, стакан воды или короткая прогулка помогут переждать. Каждый раз, когда вы преодолеваете желание закурить, вы становитесь ближе к новому достижению.'
  },
  {
    question: 'Как долго продлятся симптомы отказа?',
    answer: 'Наиболее интенсивные симптомы проходят за первую неделю. Раздражительность, беспокойство и повышенный аппетит значительно уменьшаются через 2-4 недели.'
  },
  {
    question: 'Повысится ли моя популярность среди друзей в школе?',
    answer: 'При использовании Clean Day спина становится шире, причёска — гуще, зубы — белее, бицепсы — больше. Вы гарантировано получите внимание женщин, уважение друзей и зависть недоброжелателей.'
  }
];

const getRandomMessage = () => {
  if (userStore.hasUserName) {
    const possibleMessages = encouragements.value;
    let randomMessage;
    do {
      const randomIndex = Math.floor(Math.random() * possibleMessages.length);
      randomMessage = possibleMessages[randomIndex];
    } while (possibleMessages.length > 1 && randomMessage === currentMessage.value);
    currentMessage.value = randomMessage;
  } else {
    const randomIndex = Math.floor(Math.random() * facts.length);
    currentMessage.value = facts[randomIndex];
  }
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

const simulateLoading = async () => {
  await new Promise(resolve => setTimeout(resolve, 250));
  isLoading.value = false;
};

onMounted(async () => {
  simulateLoading();
  getRandomMessage();
  achievementsStore.initialize();
  achievementsStore.checkAchievements();
});
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg,
    #161b22 25%,
    #21262d 50%,
    #161b22 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
