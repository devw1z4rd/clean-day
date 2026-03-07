<template>
  <div>
    <!-- Hero: gif bg + timer -->
    <div class="-mx-4 -mt-6 md:mx-0 md:mt-0 md:rounded-2xl relative overflow-hidden mb-8 md:mb-10"
      style="min-height: 58vh">
      <img :src="currentBg" alt="" class="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-75" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/65"></div>
      <div class="relative z-10 flex items-center justify-center w-full px-5 py-10" style="min-height: 58vh">
        <div class="w-full max-w-lg md:max-w-xl mx-auto">
          <Timer />
        </div>
      </div>
    </div>

    <!-- Content below hero -->
    <div v-if="userStore.hasQuit" class="px-1 md:px-0">

      <!-- Stats: 3 cards — number + unit on separate lines -->
      <div class="grid grid-cols-3 gap-3 mb-8 md:mb-10">
        <template v-if="isLoading">
          <div v-for="i in 3" :key="i" class="bg-[#161b22] rounded-xl border border-[#30363d]/50 p-3 sm:p-4">
            <div class="h-2 skeleton rounded mb-2.5" style="width: 55%"></div>
            <div class="h-5 skeleton rounded mb-1.5" style="width: 60%"></div>
            <div class="h-3 skeleton rounded" style="width: 40%"></div>
          </div>
        </template>
        <template v-else>
          <div v-for="(stat, index) in statsData" :key="index"
            class="bg-[#161b22] rounded-xl border border-[#30363d]/50 p-3 sm:p-4">
            <div class="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest mb-1.5 leading-tight">
              {{ stat.title }}
            </div>
            <div class="text-base sm:text-lg font-semibold text-white tabular-nums leading-tight">
              {{ stat.number }}
            </div>
            <div class="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-tight">
              {{ stat.unit }}
            </div>
          </div>
        </template>
      </div>

      <!-- Fact / encouragement -->
      <div v-if="isLoading" class="mb-8">
        <div class="h-2.5 skeleton rounded mb-3" style="width: 80px"></div>
        <div class="h-4 skeleton rounded mb-2"></div>
        <div class="h-4 skeleton rounded" style="width: 70%"></div>
      </div>
      <div v-else class="mb-8">
        <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-3">
          {{ userStore.hasUserName ? 'Подбадривание' : 'Факт дня' }}
        </div>
        <div class="pl-3 border-l-2 border-green-500/25">
          <transition name="fade" mode="out-in">
            <p :key="currentMessage" class="text-sm text-gray-400 leading-relaxed">
              {{ currentMessage }}
            </p>
          </transition>
        </div>
      </div>

      <!-- Health improvements -->
      <div v-if="isLoading" class="mb-8">
        <div class="h-2.5 skeleton rounded mb-4" style="width: 130px"></div>
        <div v-for="i in 4" :key="i" class="flex gap-4 py-2.5 border-b border-[#30363d]/30">
          <div class="h-3 skeleton rounded shrink-0" style="width: 56px"></div>
          <div class="h-3 skeleton rounded flex-1"></div>
        </div>
      </div>
      <div v-else class="mb-8">
        <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">
          Улучшения здоровья
        </div>
        <div>
          <div v-for="(item, index) in filteredHealthItems" :key="index"
            class="flex items-start gap-4 py-2.5 border-b border-[#30363d]/30 last:border-0">
            <span class="text-xs font-medium w-16 shrink-0 pt-0.5"
              :class="isActive(item.time) ? 'text-green-400' : 'text-gray-600'">
              {{ item.time }}
            </span>
            <span class="text-sm leading-relaxed" :class="isActive(item.time) ? 'text-gray-300' : 'text-gray-600'">
              {{ item.description }}
            </span>
          </div>
        </div>
        <div v-if="!showAllHealth && sortedHealthImprovements.length > 5" class="mt-4">
          <button @click="showAllHealth = true" class="text-xs text-gray-600 hover:text-gray-300 transition-colors">
            Показать все ({{ sortedHealthImprovements.length }})
          </button>
        </div>
        <div v-if="showAllHealth && sortedHealthImprovements.length > 5" class="mt-4">
          <button @click="showAllHealth = false" class="text-xs text-gray-600 hover:text-gray-300 transition-colors">
            Скрыть
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const gifNames = [
  'timer.gif',
  'elon.gif',
  'timer1.gif',
  'mads.gif',
  'cigarrillo.gif',
  'sad.gif',
  'marlboro.gif',
  'morning.gif',
  'superman.gif',
  'no.gif',
  'nono.gif',
  'nonono.gif',
  'smoking.gif',
];
const gifSrc = (name) => `/bg/${name}`;

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

// Initialize store synchronously so favoriteGif is available immediately
if (!userStore.initialized) userStore.initialize();

const pickBackground = () => {
  const fav = userStore.favoriteGif;
  if (fav && gifNames.includes(fav)) return gifSrc(fav);
  return gifSrc(gifNames[Math.floor(Math.random() * gifNames.length)]);
};

const cigaretteForms = ['сигарета', 'сигареты', 'сигарет'];
const currentMessage = ref('');
const currentBg = ref(pickBackground()); // Set immediately — no flicker
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
    number: userStore.moneySaved,
    unit: 'EUR',
  },
  {
    title: 'Не выкурено',
    number: userStore.cigarettesNotSmoked,
    unit: getWordForm(userStore.cigarettesNotSmoked, cigaretteForms),
  },
  {
    title: 'Достижения',
    number: `${achievementsStore.unlockedCount} / ${achievementsStore.achievements.length}`,
    unit: 'получено',
  },
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
    `${name}, чем дольше вы не курите, тем проще становится оставаться некурящим!`,
  ];
});

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

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 250));
  isLoading.value = false;
  getRandomMessage();
  achievementsStore.initialize();
  achievementsStore.checkAchievements();
});
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #161b22 25%, #21262d 50%, #161b22 75%);
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
