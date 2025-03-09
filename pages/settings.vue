<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
      Настройки
    </h1>

    <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
      class="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-fire" class="mr-2 text-primary-600 dark:text-primary-400" size="lg" />
          <h2 class="text-xl font-semibold text-primary-700 dark:text-primary-400">Информация о курении</h2>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UFormGroup label="Сигарет в день:">
          <UInput v-model.number="smokingSettings.cigarettesPerDay" type="text" pattern="[0-9]*" inputmode="numeric"
            :min="1" :max="100" placeholder="20" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-500 mr-2">шт.</span>
            </template>
          </UInput>
        </UFormGroup>

        <UFormGroup label="Сигарет в пачке:">
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
      </div>

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
        <p class="flex items-center">
          <UIcon name="i-heroicons-information-circle" class="mr-2" size="sm" />
          Эти данные используются для расчёта сэкономленных средств и других статистик
        </p>
      </div>
    </UCard>


    <UTabs :items="[
      {
        icon: 'i-heroicons-cog-6-tooth',
        label: 'Приложение',
        slot: 'app'
      },
      {
        icon: 'i-heroicons-calendar',
        label: 'Отказ от курения',
        slot: 'quit'
      },
      {
        icon: 'i-heroicons-trash',
        label: 'Сброс данных',
        slot: 'reset'
      }
    ]" class="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">

      <template #app>
        <div class="p-6">
          <div class="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <div class="font-medium text-lg">Уведомления о достижениях</div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Узнавайте о новых разблокированных достижениях
              </p>
            </div>
            <UToggle v-model="appSettings.achievementNotifications" color="primary" />
          </div>

          <div class="flex justify-between items-center py-4">
            <div>
              <div class="font-medium text-lg">Темная тема</div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Включить темный режим интерфейса</p>
            </div>
            <UToggle v-model="appSettings.darkMode" color="primary" />
          </div>

          <UFormGroup label="Ваше имя:">
            <UInput v-model="userNameInput" placeholder="Введите ваше имя" @blur="updateUserName"
              icon="i-heroicons-user-circle">
            </UInput>
          </UFormGroup>

          <div class="pt-4 border-primary-100 dark:border-primary-800/50 text-sm text-gray-600 dark:text-gray-400">
            <p class="flex items-center">
              <UIcon name="i-heroicons-information-circle" class="mr-2" size="sm" />
              Ваше имя будет использоваться для персонализированных сообщений
            </p>
          </div>
        </div>
      </template>


      <template #quit>
        <div class="p-6">
          <div v-if="userStore.hasQuit">
            <div class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 flex items-start mb-6">
              <UIcon name="i-heroicons-information-circle"
                class="mr-3 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-medium text-primary-700 dark:text-primary-400">Информация</h3>
                <p class="text-gray-700 dark:text-gray-300 text-sm mt-1">
                  Вы бросили курить {{ userStore.quitDate ? formatDate(userStore.quitDate) : '' }}
                </p>
              </div>
            </div>

            <UFormGroup label="Изменить дату отказа:">
              <UInput v-model="quitDateInput" type="datetime-local" :max="today" icon="i-heroicons-calendar"
                class="hide-spinners" />
            </UFormGroup>

            <div class="flex justify-end mt-4">
              <UButton color="primary" @click="updateQuitDate" icon="i-heroicons-check">
                Обновить дату
              </UButton>
            </div>
          </div>

          <div v-else class="py-6 text-center">
            <div class="rounded-full h-20 w-20 bg-primary-100 dark:bg-primary-900/40 text-primary-500 dark:text-primary-400 
                     flex items-center justify-center text-3xl mx-auto mb-4">
              <UIcon name="i-heroicons-calendar" size="xl" />
            </div>
            <p class="text-lg mb-6 text-gray-700 dark:text-gray-300">
              Вы еще не установили дату отказа от курения.
            </p>
            <UButton to="/" color="primary" class="px-6">
              Перейти на главную
            </UButton>
          </div>
        </div>
      </template>


      <template #reset>
        <div class="p-6">
          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <div class="flex items-start">
              <UIcon name="i-heroicons-exclamation-triangle"
                class="mr-3 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
              <div>
                <h3 class="font-medium text-red-700 dark:text-red-400">Внимание</h3>
                <p class="text-gray-700 dark:text-gray-300 text-sm mt-2">
                  Сброс данных удалит всю вашу статистику, включая:
                </p>
                <ul class="text-gray-700 dark:text-gray-300 text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Дату отказа от курения</li>
                  <li>Все полученные достижения</li>
                  <li>Статистику сэкономленных денег</li>
                  <li>Количество невыкуренных сигарет</li>
                </ul>
                <p class="text-gray-700 dark:text-gray-300 text-sm mt-2 font-medium">
                  Восстановление данных будет невозможно.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <UButton color="red" @click="showResetConfirm = true" icon="i-heroicons-trash" size="lg">
              Сбросить все данные
            </UButton>
          </div>
        </div>
      </template>
    </UTabs>

    <SyncSettings />

    <UModal v-model="showResetConfirm" :ui="{
      width: 'sm:max-w-md md:max-w-lg',
      container: 'flex items-center sm:py-8 justify-center min-h-screen',
      overlay: { background: 'bg-gray-950/75' },
      base: 'relative w-full max-h-[90vh] overflow-auto m-4 sm:m-6'
    }">
      <UCard :ui="{
        ring: '',
        base: 'overflow-hidden',
        header: { padding: 'p-4 sm:px-6 sm:py-4' },
        body: { base: 'p-4 sm:p-6' },
        footer: { padding: 'p-4 sm:p-4' }
      }">
        <template #header>
          <div class="flex items-center text-red-600">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 text-lg" />
            <span class="text-base sm:text-lg font-semibold">Подтверждение сброса данных</span>
          </div>
        </template>

        <UAlert title="Внимание"
          description="Вы действительно хотите удалить все данные? Это действие нельзя отменить и все ваши достижения будут потеряны."
          color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

        <UFormGroup label='Введите "УДАЛИТЬ" для подтверждения:' class="modal-delete-confirm">
          <UInput v-model="confirmText" placeholder="УДАЛИТЬ" size="lg" class="text-base" :autofocus="false"
            tabindex="-1" />
        </UFormGroup>

        <template #footer>
          <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <UButton @click="showResetConfirm = false" color="gray" size="lg"
              class="order-1 sm:order-none sm:block-none w-full sm:w-auto">
              Отмена
            </UButton>
            <UButton @click="resetAllData" color="red" size="lg" class="w-full sm:w-auto"
              :disabled="confirmText !== 'УДАЛИТЬ'">
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
import { useSyncStore } from '~/stores/sync';

const toast = useToast();
const userStore = useUserStore();
const achievementsStore = useAchievementsStore();
const syncStore = useSyncStore();

const activeToastsCount = ref(0);

type ToastOptions = {
  title?: string;
  description?: string;
  icon?: string;
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  timeout?: number;
};

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
const userNameInput = ref(userStore.userName || '');

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

const showToast = (options: ToastOptions) => {
  if (activeToastsCount.value >= 2) {
    toast.clear();
    activeToastsCount.value = 0;
  }

  activeToastsCount.value++;

  const toastId = toast.add({
    ...options,
    timeout: options.timeout || 1500,

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
        color: 'danger',
        timeout: 3000
      });
      return;
    }

    const dateValue = selectedDate.toISOString();

    const hasChanged = userStore.quitDate !== dateValue;

    if (hasChanged) {
      userStore.setQuitDate(dateValue);
      achievementsStore.checkAchievements();

      if (syncStore.syncEnabled) {
        syncStore.pushData();
      }

      showToast({
        title: 'Успешно',
        description: 'Дата отказа обновлена!',
        icon: 'i-heroicons-check-circle',
        color: 'success',
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

    if (syncStore.syncEnabled) {
      syncStore.pushData();
    }

    showToast({
      title: 'Успешно',
      description: 'Настройки курения сохранены!',
      icon: 'i-heroicons-check-circle',
      color: 'success',
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

  if (syncStore.syncEnabled) {
    syncStore.pushData();
  }

  showToast({
    title: 'Успешно',
    description: 'Настройки приложения сохранены!',
    icon: 'i-heroicons-check-circle',
    color: 'success',
    timeout: 1500,
  });
};

const updateUserName = () => {
  if (userNameInput.value !== userStore.userName) {
    userStore.setUserName(userNameInput.value);

    if (syncStore.syncEnabled) {
      syncStore.pushData();
    }

    showToast({
      title: 'Успешно',
      description: 'Имя сохранено!',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 1500
    });
  }
};

const resetAllData = () => {
  if (confirmText.value !== 'УДАЛИТЬ') return;

  if (typeof window !== 'undefined') {
    syncStore.resetSync();

    localStorage.removeItem('clean-day-user');
    localStorage.removeItem('clean-day-achievements');

    showResetConfirm.value = false;
    showToast({
      title: 'Внимание',
      description: 'Все данные успешно удалены. Перезагрузка...',
      icon: 'i-heroicons-information-circle',
      color: 'info',
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

watch(showResetConfirm, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      const inputElement = document.querySelector('.modal-delete-confirm input');
      if (inputElement instanceof HTMLElement) {
        inputElement.blur();
      }
      document.body.focus();
    }, 50);
  }
});

onMounted(() => {
  syncStore.initialize();

  if (userStore.quitDate) {
    try {
      const date = new Date(userStore.quitDate);
      quitDateInput.value = date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error setting quit date input:', error);
    }
  }

  userNameInput.value = userStore.userName || '';

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