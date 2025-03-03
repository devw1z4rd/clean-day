<template>
  <div class="home-page">
    <Timer class="timer-container" />
    
    <div class="stats-preview">
      <div class="stat-card card" v-for="(stat, index) in statsData" :key="index">
        <div class="stat-icon">
          <span class="icon">{{ stat.icon }}</span>
        </div>
        <div class="stat-info">
          <h3>{{ stat.title }}</h3>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </div>
    </div>
    
    <div class="motivation-fact card" v-if="userStore.hasQuit">
      <h2>Факт дня</h2>
      <p class="fact-text">{{ currentFact }}</p>
      <button @click="getRandomFact" class="btn btn-primary">Новый факт</button>
    </div>

    <div class="health-improvements card" v-if="userStore.hasQuit">
      <h2>Улучшения здоровья</h2>
      <div class="health-filter">
        <button 
          @click="filterType = 'all'" 
          class="filter-btn" 
          :class="{ 'active': filterType === 'all' }"
        >
          Все
        </button>
        <button 
          @click="filterType = 'active'" 
          class="filter-btn" 
          :class="{ 'active': filterType === 'active' }"
        >
          Достигнуто
        </button>
        <button 
          @click="filterType = 'upcoming'" 
          class="filter-btn" 
          :class="{ 'active': filterType === 'upcoming' }"
        >
          Предстоит
        </button>
      </div>
      <ul class="health-list">
        <li 
          v-for="(item, index) in filteredHealthImprovements" 
          :key="index" 
          class="health-item" 
          :class="{ 'active': isActive(item.time) }"
        >
          <div class="health-time">{{ item.time }}</div>
          <div class="health-info">{{ item.description }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();
const filterType = ref('all');

const statsData = computed(() => [
  {
    icon: '💰',
    title: 'Сэкономлено:',
    value: `${userStore.moneySaved} EUR`
  },
  {
    icon: '🚭',
    title: 'Не выкурено:',
    value: `${userStore.cigarettesNotSmoked} сигарет`
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

const filteredHealthImprovements = computed(() => {
  if (filterType.value === 'all') {
    return healthImprovements;
  } else if (filterType.value === 'active') {
    return healthImprovements.filter(item => isActive(item.time));
  } else if (filterType.value === 'upcoming') {
    return healthImprovements.filter(item => !isActive(item.time));
  }
  return healthImprovements;
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

const currentFact = ref('');

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
.home-page {
  max-width: 900px;
  margin: 0 auto;
}

.timer-container {
  margin-bottom: 2rem;
}

.stats-preview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: var(--border-radius);
  border-bottom: 3px solid var(--primary-color);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  margin-right: 1.25rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(91, 140, 90, 0.1);
}

.stat-card:nth-child(2) .stat-icon {
  background-color: rgba(74, 111, 165, 0.1);
}

.stat-card:nth-child(3) .stat-icon {
  background-color: rgba(249, 136, 102, 0.1);
}

.icon {
  font-size: 2rem;
}

.stat-info h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.motivation-fact {
  text-align: center;
  padding: 2rem;
  border-radius: var(--border-radius);
  background-color: rgba(91, 140, 90, 0.05);
  margin-bottom: 2.5rem;
}

.motivation-fact h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.fact-text {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-style: italic;
  color: var(--text-color);
  line-height: 1.6;
}

.health-improvements {
  margin-bottom: 2.5rem;
  border-radius: var(--border-radius);
}

.health-improvements h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.health-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--primary-color);
  background-color: transparent;
  color: var(--primary-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.health-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.health-item {
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid #ddd;
}

.health-item.active {
  background-color: rgba(91, 140, 90, 0.08);
  border-left: 3px solid var(--primary-color);
}

.health-time {
  min-width: 100px;
  font-weight: bold;
  color: var(--text-light);
}

.health-item.active .health-time {
  color: var(--primary-color);
}

.health-info {
  color: var(--text-color);
}

@media (max-width: 992px) {
  .stats-preview {
    gap: 1.25rem;
  }
  
  .stat-value {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .stats-preview {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .motivation-fact {
    padding: 1.5rem;
  }
  
  .fact-text {
    font-size: 1.1rem;
  }
  
  .health-item {
    flex-direction: column;
  }
  
  .health-time {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .stat-card {
    padding: 1.25rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    margin-right: 1rem;
  }
  
  .icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.4rem;
  }
  
  .motivation-fact {
    padding: 1.25rem;
  }
  
  .fact-text {
    font-size: 1rem;
  }
  
  .health-filter {
    flex-wrap: wrap;
  }
  
  .filter-btn {
    flex: 1;
    min-width: 30%;
    text-align: center;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 420px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    margin-right: 0.75rem;
  }
  
  .icon {
    font-size: 1.25rem;
  }
  
  .stat-info h3 {
    font-size: 0.8rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .health-item {
    padding: 0.75rem;
  }
}

@media (prefers-color-scheme: dark) {
  .stat-icon {
    background-color: rgba(106, 191, 110, 0.1);
  }
  
  .stat-card:nth-child(2) .stat-icon {
    background-color: rgba(100, 181, 246, 0.1);
  }
  
  .stat-card:nth-child(3) .stat-icon {
    background-color: rgba(255, 158, 128, 0.1);
  }
  
  .motivation-fact {
    background-color: rgba(74, 143, 77, 0.1);
  }
  
  .health-item {
    background-color: rgba(255, 255, 255, 0.03);
  }
  
  .health-item.active {
    background-color: rgba(106, 191, 110, 0.15);
  }
}
</style>