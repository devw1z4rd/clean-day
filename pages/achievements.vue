<template>
  <div class="achievements-page">
    <h1>Ваши достижения</h1>
    
    <div class="progress-container card">
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${achievementsStore.achievementProgress}%` }"></div>
      </div>
      <div class="progress-text">
        Открыто {{ achievementsStore.unlockedCount }} из {{ achievementsStore.achievements.length }} достижений
        ({{ achievementsStore.achievementProgress }}%)
      </div>
    </div>
    
    <div v-if="userStore.hasQuit">
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievementsStore.achievements" 
          :key="achievement.id" 
          class="achievement-card"
          :class="{ 'unlocked': achievement.unlocked, 'locked': !achievement.unlocked }"
        >
          <div class="achievement-icon">
            <span class="icon">{{ getEmojiForIcon(achievement.icon) }}</span>
          </div>
          <div class="achievement-info">
            <h3>{{ achievement.title }}</h3>
            <p v-if="achievement.unlocked" class="achievement-description">
              {{ achievement.description }}
            </p>
            <p v-else class="achievement-hint">
              {{ getAchievementHint(achievement) }}
            </p>
          </div>
          <div class="achievement-status">
            <span v-if="achievement.unlocked" class="status-badge unlocked">Получено</span>
            <span v-else class="status-badge locked">Заблокировано</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="no-data-message card">
      <h2>Начните свой путь к здоровью</h2>
      <p>Укажите дату отказа от курения на главной странице, чтобы начать получать достижения.</p>
      <NuxtLink to="/" class="btn btn-primary">Перейти на главную</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

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
    return `Не курите ${achievement.requiredDays} дней`;
  }
  
  if (achievement.requiredMoney) {
    return `Сэкономьте ${achievement.requiredMoney} EUR`;
  }
  
  if (achievement.requiredCigarettes) {
    return `Не выкурите ${achievement.requiredCigarettes} сигарет`;
  }
  
  return 'Продолжайте не курить';
};

onMounted(() => {
  achievementsStore.initialize();
  achievementsStore.checkAchievements();
});
</script>

<style scoped>
.achievements-page {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 2.25rem;
}

.progress-container {
  padding: 2rem;
  margin-bottom: 2.5rem;
  text-align: center;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  border-top: 4px solid var(--primary-color);
}

.progress-bar-container {
  height: 16px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background-image: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  border-radius: 8px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 1.1rem;
  color: var(--text-color);
  font-weight: 500;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.achievement-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.achievement-card.unlocked {
  border-top: 4px solid var(--success-color);
}

.achievement-card.locked {
  border-top: 4px solid #ccc;
  opacity: 0.8;
  filter: grayscale(40%);
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.achievement-icon {
  font-size: 2.5rem;
  margin-bottom: 1.25rem;
  text-align: center;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-info {
  flex: 1;
}

.achievement-info h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--primary-color);
  font-size: 1.25rem;
  font-weight: 600;
}

.achievement-description, .achievement-hint {
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
}

.achievement-hint {
  font-style: italic;
  color: var(--text-light);
}

.achievement-status {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.unlocked {
  background-color: var(--success-color);
  color: white;
}

.status-badge.locked {
  background-color: #ddd;
  color: #666;
}

.no-data-message {
  text-align: center;
  padding: 3.5rem 2rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  border-top: 4px solid var(--primary-color);
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
  font-size: 1rem;
  border-radius: 30px;
}

@media (max-width: 768px) {
  .achievements-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .progress-container {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .achievement-card {
    padding: 1.25rem;
  }
  
  .achievement-icon {
    font-size: 2rem;
    height: 50px;
    margin-bottom: 1rem;
  }
  
  .achievement-status {
    top: 1.25rem;
    right: 1.25rem;
  }
}
</style>