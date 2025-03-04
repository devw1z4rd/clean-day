<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
      Настройки
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
        class="border-t-4 border-t-primary-500">
        <template #header>
          <h2 class="text-lg font-medium">Информация о курении</h2>
        </template>

        <UFormGroup label="Сколько сигарет в день вы курили:">
          <UInput v-model.number="smokingSettings.cigarettesPerDay" type="text" pattern="[0-9]*" inputmode="numeric"
            :min="1" :max="100" placeholder="20" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-500 mr-2">шт.</span>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup label="Сколько сигарет в пачке:">
          <UInput v-model.number="smokingSettings.cigarettesInPack" type="text" pattern="[0-9]*" inputmode="numeric"
            :min="1" :max="50" placeholder="20" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-500 mr-2">шт.</span>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup label="Стоимость пачки:">
          <UInput v-model.number="smokingSettings.cigarettePrice" type="text" pattern="[0-9]*[.]?[0-9]*"
            inputmode="decimal" :min="1" placeholder="10" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-500 mr-2">EUR</span>
            </template>
          </UInput>
        </UFormGroup>
      </UCard>

      <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
        class="border-t-4 border-t-blue-500">
        <template #header>
          <h2 class="text-lg font-medium">Настройки приложения</h2>
        </template>

        <UFormGroup>
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div class="font-medium">Включить уведомления</div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Получать регулярные напоминания и мотивацию</p>
            </div>
            <UToggle v-model="appSettings.notifications" color="primary" />
          </div>
        </UFormGroup>

        <UFormGroup>
          <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div class="font-medium">Уведомления о достижениях</div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Узнавайте о новых разблокированных достижениях</p>
            </div>
            <UToggle v-model="appSettings.achievementNotifications" color="primary" />
          </div>
        </UFormGroup>

        <UFormGroup>
          <div class="flex justify-between items-center py-2">
            <div>
              <div class="font-medium">Темная тема</div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Включить темный режим интерфейса</p>
            </div>
            <UToggle v-model="appSettings.darkMode" color="primary" />
          </div>
        </UFormGroup>
      </UCard>

      <UCard
        :ui="{ ring: '', header: { padding: 'px-6 py-4' }, footer: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
        class="border-t-4 border-t-green-500">
        <template #header>
          <h2 class="text-lg font-medium">Информация об отказе</h2>
        </template>

        <div v-if="userStore.hasQuit">
          <UAlert title="Информация"
            :description="`Вы бросили курить ${userStore.quitDate ? formatDate(userStore.quitDate) : ''}`"
            color="primary" variant="soft" icon="i-heroicons-information-circle" class="mb-4" />

          <UFormGroup label="Изменить дату отказа:">
            <UInput v-model="quitDateInput" type="datetime-local" :max="today" icon="i-heroicons-calendar"
              class="hide-spinners" />
          </UFormGroup>
        </div>

        <div v-else class="py-6 text-center">
          <p class="text-lg mb-6 text-gray-700 dark:text-gray-300">
            Вы еще не установили дату отказа от курения.
          </p>
        </div>

        <template #footer>
          <div v-if="userStore.hasQuit" class="flex justify-end">
            <UButton color="primary" @click="updateQuitDate" icon="i-heroicons-check">
              Обновить дату
            </UButton>
          </div>
          <div v-else class="flex justify-center">
            <UButton to="/" color="primary" class="px-6">
              Перейти на главную
            </UButton>
          </div>
        </template>
      </UCard>

      <UCard
        :ui="{ ring: '', header: { padding: 'px-6 py-4' }, footer: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
        class="border-t-4 border-t-red-500">
        <template #header>
          <h2 class="text-lg font-medium text-red-600 dark:text-red-400">Сброс данных</h2>
        </template>

        <UAlert title="Внимание"
          description="Это действие удалит все ваши данные, включая достижения и статистику. Восстановление будет невозможно."
          color="red" variant="soft" icon="i-heroicons-exclamation-triangle" />

        <template #footer>
          <div class="flex justify-end">
            <UButton color="red" @click="showResetConfirm = true" icon="i-heroicons-trash">
              Сбросить все данные
            </UButton>
          </div>
        </template>
      </UCard>
    </div>

    <UModal v-model="showResetConfirm">
      <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, footer: { padding: 'p-4' } }">
        <template #header>
          <div class="flex items-center text-red-600">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-2" />
            <span class="text-lg font-semibold">Подтверждение сброса данных</span>
          </div>
        </template>

        <UAlert title="Подтверждение"
          description="Вы действительно хотите удалить все данные? Это действие нельзя отменить и все ваши достижения будут потеряны."
          color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

        <UFormGroup label='Введите "УДАЛИТЬ" для подтверждения:'>
          <UInput v-model="confirmText" placeholder="УДАЛИТЬ" />
        </UFormGroup>

        <template #footer>
          <div class="flex gap-3 justify-end">
            <UButton @click="showResetConfirm = false" color="gray" variant="ghost">
              Отмена
            </UButton>
            <UButton @click="resetAllData" color="red" :disabled="confirmText !== 'УДАЛИТЬ'">
              Да, удалить все
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';

const toast = useToast();
const userStore = useUserStore();
const achievementsStore = useAchievementsStore();

const activeToastsCount = ref(0);

const smokingSettings = ref({
  cigarettesPerDay: userStore.cigarettesPerDay || 20,
  cigarettesInPack: userStore.cigarettesInPack || 20,
  cigarettePrice: userStore.cigarettePrice || 10,
});

const appSettings = ref({
  notifications: userStore.notifications || false,
  achievementNotifications: userStore.achievementNotifications || false,
  darkMode: userStore.darkMode || false,
});

const quitDateInput = ref('');
const showResetConfirm = ref(false);
const confirmText = ref('');

const today = computed(() => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateForDisplay = (dateValue: string | Date) => {
  if (!dateValue) return '';

  let date;
  if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    date = dateValue;
  }

  if (isNaN(date.getTime())) return '';

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const showToast = (options) => {
  if (activeToastsCount.value >= 2) {
    toast.clear();
    activeToastsCount.value = 0;
  }

  activeToastsCount.value++;

  const toastId = toast.add({
    ...options,
    timeout: options.timeout || 1500,
    onClose: () => {
      activeToastsCount.value = Math.max(0, activeToastsCount.value - 1);
    }
  });

  setTimeout(() => {
    activeToastsCount.value = Math.max(0, activeToastsCount.value - 1);
  }, options.timeout || 1500);

  return toastId;
};

const updateQuitDate = () => {
  if (quitDateInput.value) {
    const selectedDate = new Date(quitDateInput.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      showToast({
        title: 'Ошибка',
        description: 'Невозможно установить дату отказа в будущем!',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
        timeout: 3000
      });
      return;
    }

    const dateValue = selectedDate.toISOString();

    const hasChanged = userStore.quitDate !== dateValue;

    if (hasChanged) {
      userStore.setQuitDate(dateValue);
      achievementsStore.checkAchievements();
      showToast({
        title: 'Успешно',
        description: 'Дата отказа обновлена!',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 1500
      });
    }
  }
};

const saveSmokingSettings = () => {
  const currentSettings = {
    cigarettesPerDay: userStore.cigarettesPerDay || 0,
    cigarettesInPack: userStore.cigarettesInPack || 0,
    cigarettePrice: userStore.cigarettePrice || 0,
  };

  const newSettings = {
    cigarettesPerDay: Number(smokingSettings.value.cigarettesPerDay),
    cigarettesInPack: Number(smokingSettings.value.cigarettesInPack),
    cigarettePrice: Number(smokingSettings.value.cigarettePrice),
  };

  const hasChanged =
    currentSettings.cigarettesPerDay !== newSettings.cigarettesPerDay ||
    currentSettings.cigarettesInPack !== newSettings.cigarettesInPack ||
    currentSettings.cigarettePrice !== newSettings.cigarettePrice;

  if (hasChanged) {
    userStore.updateSmokingSettings(newSettings);
    achievementsStore.checkAchievements();

    showToast({
      title: 'Успешно',
      description: 'Настройки курения сохранены!',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 1500
    });
  }
};

const saveAppSettings = () => {
  userStore.updateAppSettings({
    notifications: appSettings.value.notifications,
    achievementNotifications: appSettings.value.achievementNotifications,
    darkMode: appSettings.value.darkMode,
  });

  if (appSettings.value.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  showToast({
    title: 'Успешно',
    description: 'Настройки приложения сохранены!',
    icon: 'i-heroicons-check-circle',
    color: 'green',
    timeout: 1500,
  });
};

const resetAllData = () => {
  if (confirmText.value !== 'УДАЛИТЬ') return;

  if (typeof window !== 'undefined') {
    localStorage.removeItem('clean-day-user');
    localStorage.removeItem('clean-day-achievements');

    showResetConfirm.value = false;
    showToast({
      title: 'Внимание',
      description: 'Все данные успешно удалены. Перезагрузка...',
      icon: 'i-heroicons-information-circle',
      color: 'blue',
      timeout: 1500
    });

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};

watch(appSettings, () => {
  saveAppSettings();
}, { deep: true });

onMounted(() => {
  if (userStore.quitDate) {
    try {
      const date = new Date(userStore.quitDate);
      quitDateInput.value = date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error setting quit date input:', error);
    }
  }

  if (userStore.darkMode) {
    document.documentElement.classList.add('dark');
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const styles = document.createElement('style');
    styles.textContent = `
    .hide-spinners::-webkit-outer-spin-button,
    .hide-spinners::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .hide-spinners {
      -moz-appearance: textfield;
    }
    `;
    document.head.appendChild(styles);
  }
});
</script>