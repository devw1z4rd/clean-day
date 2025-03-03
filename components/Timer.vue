<template>
  <div class="timer-card card">
    <h2 class="title">Время без курения</h2>
    
    <div v-if="userStore.hasQuit" class="timer-display">
      <div class="timer-unit">
        <div class="timer-value">{{ timeSinceQuit.days }}</div>
        <div class="timer-label">дней</div>
      </div>
      <div class="timer-divider">:</div>
      <div class="timer-unit">
        <div class="timer-value">{{ timeSinceQuit.hours }}</div>
        <div class="timer-label">часов</div>
      </div>
      <div class="timer-divider">:</div>
      <div class="timer-unit">
        <div class="timer-value">{{ timeSinceQuit.minutes }}</div>
        <div class="timer-label">минут</div>
      </div>
      <div class="timer-divider">:</div>
      <div class="timer-unit">
        <div class="timer-value">{{ timeSinceQuit.seconds }}</div>
        <div class="timer-label">секунд</div>
      </div>
    </div>
    
    <div v-else class="start-container">
      <p class="start-message">Начните свой путь к здоровому образу жизни прямо сейчас!</p>
      <button @click="startQuit" class="btn btn-primary start-button">Бросить курить</button>
    </div>
    
    <!-- <div v-if="userStore.hasQuit" class="reset-container">
      <button @click="showResetConfirm = true" class="btn btn-danger">Сбросить прогресс</button>
    </div> -->
    
    <div v-if="showResetConfirm" class="reset-modal">
      <div class="reset-modal-content">
        <h3>Подтверждение сброса</h3>
        <p>Вы действительно хотите сбросить свой прогресс? Это действие нельзя отменить.</p>
        <div class="reset-modal-buttons">
          <button @click="resetProgress" class="btn btn-danger">Да, сбросить</button>
          <button @click="showResetConfirm = false" class="btn btn-primary">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const showResetConfirm = ref(false);

const timeSinceQuit = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

const calculateTimeDifference = () => {
  if (!userStore.quitDate) return;
  
  const quitDate = new Date(userStore.quitDate);
  const now = new Date();
  
  const diffMs = now - quitDate;
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  timeSinceQuit.value = {
    days,
    hours,
    minutes,
    seconds
  };
};

let timer = null;

onMounted(() => {
  calculateTimeDifference();
  
  timer = setInterval(() => {
    calculateTimeDifference();
    achievementsStore.checkAchievements();
  }, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

const startQuit = () => {
  userStore.setQuitDate(new Date().toISOString());
  calculateTimeDifference();
};

const resetProgress = () => {
  userStore.resetProgress();
  showResetConfirm.value = false;
};
</script>

<style scoped>
.timer-card {
  text-align: center;
  padding: 2.5rem;
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  border-top: 5px solid var(--primary-color);
}

.title {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2.5rem 0;
  font-family: 'Roboto Mono', monospace;
}

.timer-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.5rem;
}

.timer-value {
  font-size: 2.5rem;
  font-weight: bold;
  min-width: 3.5rem;
  padding: 1rem 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.timer-label {
  font-size: 0.9rem;
  margin-top: 0.75rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timer-divider {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0.25rem;
  color: var(--text-light);
  align-self: flex-start;
  margin-top: 1rem;
}

.start-container {
  padding: 3rem 0;
}

.start-message {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: var(--text-color);
}

.start-button {
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reset-container {
  margin-top: 2rem;
}

.reset-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.reset-modal-content {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.reset-modal-content h3 {
  margin-top: 0;
  color: var(--danger-color);
}

.reset-modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .timer-display {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .timer-unit {
    margin: 0 0.25rem;
  }
  
  .timer-value {
    font-size: 2rem;
    min-width: 2.5rem;
    padding: 0.75rem 0.5rem;
  }
  
  .timer-divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .reset-modal-buttons {
    flex-direction: column;
    gap: 1rem;
  }
  
  .timer-card {
    padding: 1.5rem;
  }
}
</style>