<template>
  <div class="settings-page">
    <h1 class="page-title">
      Настройки
    </h1>
    
    <div class="settings-grid">
      <div class="settings-section card">
        <div class="section-header">
          <h2>Информация о курении</h2>
        </div>
        
        <div class="form-group">
          <label for="cigarettesPerDay">Сколько сигарет в день вы курили:</label>
          <div class="input-wrapper">
            <input 
              type="number" 
              id="cigarettesPerDay" 
              v-model="smokingSettings.cigarettesPerDay" 
              min="1" 
              max="100"
            >
            <span class="input-suffix">шт.</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="cigarettesInPack">Сколько сигарет в пачке:</label>
          <div class="input-wrapper">
            <input 
              type="number" 
              id="cigarettesInPack" 
              v-model="smokingSettings.cigarettesInPack" 
              min="1" 
              max="50"
            >
            <span class="input-suffix">шт.</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="cigarettePrice">Стоимость пачки:</label>
          <div class="input-wrapper">
            <input 
              type="number" 
              id="cigarettePrice" 
              v-model="smokingSettings.cigarettePrice" 
              min="1"
            >
            <span class="input-suffix">EUR</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="saveSmokingSettings" class="btn btn-primary">
            Сохранить
          </button>
        </div>
      </div>
      
      <div class="settings-section card">
        <div class="section-header">
          <h2>Настройки приложения</h2>
        </div>
        
        <div class="toggle-group">
          <div class="toggle-label">
            <label for="notifications">Включить уведомления</label>
            <p class="option-description">Получать регулярные напоминания и мотивацию</p>
          </div>
          <label class="toggle">
            <input type="checkbox" id="notifications" v-model="appSettings.notifications">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="toggle-group">
          <div class="toggle-label">
            <label for="achievementNotifications">Уведомления о достижениях</label>
            <p class="option-description">Узнавайте о новых разблокированных достижениях</p>
          </div>
          <label class="toggle">
            <input type="checkbox" id="achievementNotifications" v-model="appSettings.achievementNotifications">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="toggle-group">
          <div class="toggle-label">
            <label for="darkMode">Темная тема</label>
            <p class="option-description">Включить темный режим интерфейса</p>
          </div>
          <label class="toggle">
            <input type="checkbox" id="darkMode" v-model="appSettings.darkMode">
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div class="form-actions">
          <button @click="saveAppSettings" class="btn btn-primary">
            Сохранить
          </button>
        </div>
      </div>
      
      <div class="settings-section card">
        <div class="section-header">
          <h2>Информация об отказе</h2>
        </div>
        
        <div v-if="userStore.hasQuit" class="quit-info">
          <div class="info-card">
            <p>Вы бросили курить <strong>{{ formatDate(userStore.quitDate) }}</strong></p>
          </div>
          
          <div class="form-group">
            <label for="quitDate">Изменить дату отказа:</label>
            <div class="input-wrapper date-input-wrapper">
              <span class="input-prefix">📆</span>
              <input 
                type="datetime-local" 
                id="quitDate" 
                v-model="quitDateInput" 
                :max="today"
              >
            </div>
          </div>
          
          <div class="form-actions">
            <button @click="updateQuitDate" class="btn btn-primary">
              Обновить дату
            </button>
          </div>
        </div>
        
        <div v-else class="no-quit-message">
          <div class="empty-state">
            <p>Вы еще не установили дату отказа от курения.</p>
            <NuxtLink to="/" class="btn btn-primary">
              Перейти на главную
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="settings-section card danger-zone">
        <div class="section-header danger">
          <h2>Сброс данных</h2>
        </div>
        
        <div class="warning-box">
          <p>Это действие удалит все ваши данные, включая достижения и статистику. Восстановление будет невозможно.</p>
        </div>
        
        <div class="form-actions">
          <button @click="showResetConfirm = true" class="btn btn-danger">
            Сбросить все данные
          </button>
        </div>
      </div>
    </div>
    
    <Transition name="fade">
      <div v-if="showResetConfirm" class="modal-overlay" @click.self="showResetConfirm = false">
        <div class="modal-container">
          <div class="modal-header danger">
            <h3>Подтверждение сброса данных</h3>
            <button class="modal-close" @click="showResetConfirm = false" aria-label="Close">×</button>
          </div>
          
          <div class="modal-content">
            <div class="warning-box">
              <p>Вы действительно хотите удалить все данные? Это действие нельзя отменить и все ваши достижения будут потеряны.</p>
            </div>
            
            <div class="confirmation-input">
              <label for="confirmReset">Введите "УДАЛИТЬ" для подтверждения:</label>
              <input type="text" id="confirmReset" v-model="confirmText" placeholder="УДАЛИТЬ">
            </div>
          </div>
          
          <div class="modal-actions">
            <button @click="showResetConfirm = false" class="btn btn-outline">
              Отмена
            </button>
            <button 
              @click="resetAllData" 
              class="btn btn-danger" 
              :disabled="confirmText !== 'УДАЛИТЬ'"
            >
              Да, удалить все
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        <span class="toast-icon">{{ toastIcon }}</span>
        <span class="toast-message">{{ toastMessage }}</span>
        <button class="toast-close" @click="showToast = false">×</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const smokingSettings = ref({
  cigarettesPerDay: userStore.cigarettesPerDay,
  cigarettesInPack: userStore.cigarettesInPack,
  cigarettePrice: userStore.cigarettePrice,
});

const appSettings = ref({
  notifications: userStore.notifications,
  achievementNotifications: userStore.achievementNotifications,
  darkMode: userStore.darkMode,
});

const quitDateInput = ref('');
const showResetConfirm = ref(false);
const confirmText = ref('');

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('');
const toastIcon = ref('');

const today = computed(() => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const displayToast = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  
  if (type === 'success') {
    toastIcon.value = '✅';
  } else if (type === 'error') {
    toastIcon.value = '❌';
  } else if (type === 'warning') {
    toastIcon.value = '⚠️';
  } else if (type === 'info') {
    toastIcon.value = 'ℹ️';
  }
  
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const updateQuitDate = () => {
  if (quitDateInput.value) {
    userStore.setQuitDate(new Date(quitDateInput.value).toISOString());
    achievementsStore.checkAchievements();
    displayToast('Дата отказа обновлена!');
  }
};

const saveSmokingSettings = () => {
  userStore.updateSmokingSettings({
    cigarettesPerDay: Number(smokingSettings.value.cigarettesPerDay),
    cigarettesInPack: Number(smokingSettings.value.cigarettesInPack),
    cigarettePrice: Number(smokingSettings.value.cigarettePrice),
  });
  
  achievementsStore.checkAchievements();
  displayToast('Настройки курения сохранены!');
};

const saveAppSettings = () => {
  userStore.updateAppSettings({
    notifications: appSettings.value.notifications,
    achievementNotifications: appSettings.value.achievementNotifications,
    darkMode: appSettings.value.darkMode,
  });
  
  if (appSettings.value.darkMode) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  
  displayToast('Настройки приложения сохранены!');
};

const resetAllData = () => {
  if (confirmText.value !== 'УДАЛИТЬ') return;
  
  if (process.client) {
    localStorage.removeItem('clean-day-user');
    localStorage.removeItem('clean-day-achievements');
    
    showResetConfirm.value = false;
    displayToast('Все данные успешно удалены. Перезагрузка...', 'info');
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};

onMounted(() => {
  if (userStore.quitDate) {
    const date = new Date(userStore.quitDate);
    quitDateInput.value = date.toISOString().slice(0, 16);
  }
  
  if (userStore.darkMode) {
    document.documentElement.classList.add('dark-theme');
  }
});
</script>

<style scoped>
/* TODO: need to refactor this CSS */
:root {
  --primary-color: #4CAF50;
  --primary-dark: #388E3C;
  --primary-light: #C8E6C9;
  --secondary-color: #2196F3;
  --danger-color: #f44336;
  --warning-color: #ff9800;
  --success-color: #4caf50;
  --info-color: #2196f3;
  --text-color: #333;
  --text-light: #757575;
  --card-bg: #fff;
  --input-bg: #f5f5f5;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  --transition-speed: 0.3s;
}

.settings-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.page-title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 2rem;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-icon {
  margin-right: 0.75rem;
  font-size: 1.8rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.settings-section {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  transition: transform var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
  border-top: 4px solid var(--primary-color);
}

.settings-section:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.danger-zone {
  border-top: 4px solid var(--danger-color);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section-header.danger {
  border-bottom-color: rgba(244, 67, 54, 0.2);
}

.section-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.danger-zone .section-header h2 {
  color: var(--danger-color);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  background-color: var(--input-bg);
  transition: all var(--transition-speed) ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.input-suffix, .input-prefix {
  position: absolute;
  right: 1rem;
  color: var(--text-light);
  pointer-events: none;
}

.input-prefix {
  left: 1rem;
}

.date-input-wrapper input {
  padding-left: 2.5rem;
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.toggle-group:last-of-type {
  border-bottom: none;
}

.toggle-label {
  flex: 1;
}

.toggle-label label {
  font-weight: 500;
  margin-bottom: 0.25rem;
  display: block;
}

.option-description {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-light);
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .3s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

input:focus + .toggle-slider {
  box-shadow: 0 0 1px var(--primary-color);
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-danger:disabled {
  background-color: #ffcdd2;
  color: #b71c1c;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline {
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid #ccc;
}

.btn-outline:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.btn-icon {
  margin-right: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.info-card {
  display: flex;
  align-items: center;
  background-color: var(--primary-light);
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.25rem;
}

.info-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.info-card p {
  margin: 0;
  color: var(--primary-dark);
}

.info-card strong {
  font-weight: 600;
}

.warning-box {
  background-color: rgba(255, 152, 0, 0.1);
  border-left: 3px solid var(--warning-color);
  padding: 1rem;
  margin-bottom: 1.25rem;
  border-radius: var(--border-radius);
}

.warning-box p {
  margin: 0;
  color: #e65100;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: var(--text-light);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 500px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: #f5f5f5;
  position: relative;
}

.modal-header.danger {
  background-color: rgba(244, 67, 54, 0.1);
}

.modal-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.modal-header.danger h3 {
  color: var(--danger-color);
}

.modal-close {
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
}

.modal-content {
  padding: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #f5f5f5;
}

.confirmation-input {
  margin-top: 1.25rem;
}

.confirmation-input label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.confirmation-input input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  font-size: 1rem;
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: white;
  color: var(--text-color);
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  z-index: 1100;
  max-width: 400px;
}

.toast.success {
  border-left: 4px solid var(--success-color);
}

.toast.error {
  border-left: 4px solid var(--danger-color);
}

.toast.warning {
  border-left: 4px solid var(--warning-color);
}

.toast.info {
  border-left: 4px solid var(--info-color);
}

.toast-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.toast-message {
  flex: 1;
}

.toast-close {
  background: none;
  border: none;
  margin-left: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-light);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-speed) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .section-header h2 {
    font-size: 1.2rem;
  }
  
  .toggle-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toggle {
    margin-top: 0.75rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
  
  .toast {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style>