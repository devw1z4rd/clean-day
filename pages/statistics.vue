<template>
  <div class="statistics-page">
    <h1>Ваша статистика</h1>
    
    <div v-if="userStore.hasQuit">
      <div class="stats-cards">
        <div class="card stat-card">
          <h3>Время без курения</h3>
          <div class="stat-value">{{ formatTime(userStore.timeSinceQuit) }}</div>
        </div>
        
        <div class="card stat-card">
          <h3>Непокуренные сигареты</h3>
          <div class="stat-value">{{ userStore.cigarettesNotSmoked }}</div>
          <div class="stat-description">
            Это примерно {{ Math.floor(userStore.cigarettesNotSmoked / userStore.cigarettesInPack) }} пачек
          </div>
        </div>
        
        <div class="card stat-card">
          <h3>Сэкономлено денег</h3>
          <div class="stat-value">{{ userStore.moneySaved }} EUR</div>
          <div class="stat-description">
            На эти деньги можно купить {{ suggestPurchase() }}
          </div>
        </div>
        
        <div class="card stat-card">
          <h3>Сохраненное время</h3>
          <div class="stat-value">{{ savedTime }} часов</div>
          <div class="stat-description">
            Столько времени вы сэкономили, не выходя на перекуры
          </div>
        </div>
      </div>
      
      <div class="charts-section">
        <div class="chart-selectors">
          <button 
            v-for="period in periods" 
            :key="period.value" 
            @click="selectedPeriod = period.value"
            class="period-button"
            :class="{ 'active': selectedPeriod === period.value }"
          >
            {{ period.label }}
          </button>
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
      
      <div class="health-impact card">
        <h2>Влияние на здоровье</h2>
        <p>
          Отказавшись от курения, вы значительно улучшили свое здоровье. Вот некоторые преимущества, которые вы уже получили:
        </p>
        
        <ul class="health-benefits">
          <li v-for="(benefit, index) in healthBenefits" :key="index" :class="{ 'active': isBenefitActive(benefit.days) }">
            <span class="benefit-day">{{ benefit.days }} дней:</span> {{ benefit.description }}
          </li>
        </ul>
      </div>
    </div>
    
    <div v-else class="no-data-message card">
      <h2>Нет данных для отображения</h2>
      <p>Укажите дату отказа от курения на главной странице, чтобы увидеть свою статистику.</p>
      <NuxtLink to="/" class="btn btn-primary">Перейти на главную</NuxtLink>
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

<style scoped>
.statistics-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 2.5rem;
  font-size: 2.25rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  border-radius: var(--border-radius);
  transition: transform 0.3s ease;
  border-top: 4px solid var(--primary-color);
}

.stat-card:nth-child(2) {
  border-top-color: var(--secondary-color);
}

.stat-card:nth-child(3) {
  border-top-color: var(--accent-color);
}

.stat-card:nth-child(4) {
  border-top-color: var(--success-color);
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  margin-top: 0;
  color: var(--text-light);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1rem 0;
  color: var(--primary-color);
  line-height: 1.2;
}

.stat-card:nth-child(2) .stat-value {
  color: var(--secondary-color);
}

.stat-card:nth-child(3) .stat-value {
  color: var(--accent-color);
}

.stat-card:nth-child(4) .stat-value {
  color: var(--success-color);
}

.stat-description {
  color: var(--text-light);
  font-size: 0.95rem;
}

.charts-section {
  margin-bottom: 3rem;
}

.chart-selectors {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.75rem;
}

.period-button {
  background: none;
  border: 2px solid var(--primary-light);
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: var(--text-color);
}

.period-button:hover {
  background-color: var(--primary-light);
  color: white;
}

.period-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.health-impact {
  padding: 2.5rem;
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  border-left: 5px solid var(--primary-color);
}

.health-impact h2 {
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
}

.health-impact p {
  color: var(--text-color);
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.health-benefits {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
}

.health-benefits li {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  color: var(--text-light);
  transition: all 0.3s ease;
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid #ddd;
}

.health-benefits li.active {
  color: var(--text-color);
  background-color: rgba(91, 140, 90, 0.08);
  border-left: 3px solid var(--primary-color);
}

.benefit-day {
  font-weight: bold;
  color: var(--primary-color);
  display: inline-block;
  margin-right: 0.5rem;
}

.no-data-message {
  text-align: center;
  padding: 4rem 2rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  border-top: 5px solid var(--primary-color);
}

.no-data-message h2 {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.no-data-message p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  color: var(--text-color);
}

.no-data-message .btn {
  padding: 0.75rem 2rem;
  font-weight: 600;
  border-radius: 30px;
  font-size: 1rem;
}

@media (max-width: 992px) {
  .health-benefits {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .chart-selectors {
    flex-wrap: wrap;
  }
  
  .period-button {
    margin-bottom: 0.5rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .health-impact {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .health-benefits li {
    padding: 1rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
}
</style>