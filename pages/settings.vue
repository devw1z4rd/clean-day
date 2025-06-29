<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
      Настройки
    </h1>

    <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
      class="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-fire" class="mr-2 text-gray-600 dark:text-gray-100" size="lg" />
          <h2 class="text-xl font-semibold text-gray-600 dark:text-gray-100">Информация о курении</h2>
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
        icon: 'i-heroicons-cloud',
        label: 'Синхронизация',
        slot: 'sync'
      },
      {
        icon: 'i-heroicons-trash',
        label: 'Сброс данных',
        slot: 'reset'
      }
    ]" class="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">

      <template #app>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
              <div class="flex-1 mr-4">
                <div class="font-medium text-lg text-gray-900 dark:text-gray-100 mb-2">Ваше имя</div>
                <div class="relative">
                  <UInput 
                    v-model="userNameInput" 
                    placeholder="Введите ваше имя" 
                    @blur="updateUserName"
                    icon="i-heroicons-user-circle"
                    class="pr-10"
                  />
                  <div v-if="userNameInput !== userStore.userName" 
                       class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <UIcon name="i-heroicons-pencil" class="text-orange-500 animate-pulse" size="sm" />
                  </div>
                  <div v-else-if="userNameInput && userNameInput === userStore.userName" 
                       class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <UIcon name="i-heroicons-check-circle" class="text-green-500" size="sm" />
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Используется для персонализированных сообщений</p>
              </div>
            </div>

            <div class="flex justify-between items-center py-4">
              <div>
                <div class="font-medium text-lg text-gray-900 dark:text-gray-100">Тема</div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Выберите тему интерфейса</p>
              </div>
              <USelect 
                v-model="appSettings.theme" 
                :options="themeOptions"
                size="md"
                class="w-40"
              />
            </div>
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

      <template #sync>
        <div class="p-6">
          <div v-if="!syncStore.configValid">
            <UAlert 
              title="API синхронизации недоступен"
              :description="syncStore.error || 'Сервер синхронизации не настроен или недоступен'"
              color="orange" 
              variant="soft" 
              icon="i-heroicons-exclamation-triangle" 
              class="mb-4" 
            />
            
            <p class="mb-4 text-gray-700 dark:text-gray-300 text-sm">
              Синхронизация между устройствами временно недоступна. Ваши данные сохраняются локально и доступны на этом устройстве.
            </p>

            <details class="mb-4">
              <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <UIcon name="i-heroicons-information-circle" class="inline mr-1" size="sm" />
                Показать техническую информацию
              </summary>
              <div class="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <pre class="whitespace-pre-wrap text-gray-600 dark:text-gray-400">{{ syncStore.diagnostics || 'Диагностика недоступна' }}</pre>
              </div>
            </details>

            <div class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Синхронизация будет доступна после настройки сервера API
              </p>
              <UButton 
                color="gray" 
                variant="soft" 
                @click="checkConnection" 
                icon="i-heroicons-arrow-path"
                :loading="isChecking"
              >
                Проверить снова
              </UButton>
            </div>
          </div>

          <div v-else-if="!syncStore.isSessionActive && syncStore.configValid">
            <div class="text-center py-6">
              <div class="rounded-full h-20 w-20 bg-primary-100 dark:bg-primary-900/40 text-primary-500 dark:text-primary-400 
                       flex items-center justify-center text-3xl mx-auto mb-4">
                <UIcon name="i-heroicons-cloud" size="xl" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Синхронизация между устройствами
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Включите синхронизацию, чтобы использовать данные о вашем прогрессе на разных устройствах.
              </p>
              <UButton color="primary" size="lg" @click="enableSync" icon="i-heroicons-cloud-arrow-up">
                Включить синхронизацию
              </UButton>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Подключиться к существующей сессии
              </h4>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Подключитесь к существующей сессии, введя ID сессии или отсканировав QR-код с другого устройства.
              </p>

              <UFormGroup label="ID сессии:">
                <UInput v-model="sessionInput" placeholder="Введите ID сессии" />
              </UFormGroup>

              <div class="flex justify-between mt-4">
                <UButton color="gray" @click="showScannerModal = true" icon="i-heroicons-camera">
                  Сканировать QR-код
                </UButton>
                <UButton color="blue" :disabled="!sessionInput" @click="joinSession" icon="i-heroicons-link">
                  Подключиться
                </UButton>
              </div>
            </div>
          </div>

          <div v-else-if="syncStore.configValid">
            <div class="space-y-6">
              <div class="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <div class="font-medium text-lg text-gray-900 dark:text-gray-100">Статус синхронизации</div>
                  <p class="text-sm" :class="syncStore.error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'">
                    {{ syncStore.error || syncStore.syncStatus }}
                  </p>
                </div>
                <UButton color="primary" size="sm" icon="i-heroicons-arrow-path" :loading="syncStore.isSyncing"
                  @click="syncStore.syncData()">
                  Синхронизировать
                </UButton>
              </div>

              <div class="text-center">
                <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-3">QR-код для синхронизации</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Отсканируйте этот QR-код на другом устройстве
                </p>

                <Transition name="qr-fade" mode="out-in">
                  <div v-if="syncStore.qrCodeDataUrl" :key="qrCodeKey"
                    :class="{ 'qr-container': true, 'animate-refresh': isRefreshingQR }"
                    class="bg-white p-3 rounded-lg inline-block shadow-md">
                    <img :src="syncStore.qrCodeDataUrl" alt="QR код для синхронизации" class="mx-auto" />
                  </div>
                  <div v-else
                    class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg inline-block w-64 h-64 flex items-center justify-center">
                    <UButton color="primary" @click="refreshQrCode" icon="i-heroicons-qr-code">
                      Сгенерировать QR-код
                    </UButton>
                  </div>
                </Transition>

                <div class="flex items-center justify-center mt-4 gap-4">
                  <div class="text-center">
                    <div class="text-xs text-gray-500 dark:text-gray-400">ID сессии</div>
                    <p class="text-xs text-gray-600 dark:text-gray-300 font-mono">{{ syncStore.sessionId.slice(0, 8) }}...</p>
                  </div>
                  <UButton color="gray" size="sm"
                    :icon="isRefreshingQR ? 'i-heroicons-arrow-path animate-spin' : 'i-heroicons-arrow-path'"
                    @click="refreshQrCode" :disabled="isRefreshingQR">
                    Обновить
                  </UButton>
                </div>
              </div>

              <div class="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium text-orange-600 dark:text-orange-400">Отключить синхронизацию</div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Локальные данные сохранятся, но связь между устройствами будет разорвана
                    </p>
                  </div>
                  <UButton color="orange" variant="soft" size="sm" @click="showDisableConfirm = true" icon="i-heroicons-no-symbol">
                    Отключить
                  </UButton>
                </div>
                
                <div class="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <div class="font-medium text-red-600 dark:text-red-400">Удалить сессию с сервера</div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Полностью удалить сессию с сервера. Другие устройства потеряют доступ к данным
                    </p>
                  </div>
                  <UButton color="red" size="sm" @click="showDeleteConfirm = true" icon="i-heroicons-trash">
                    Удалить навсегда
                  </UButton>
                </div>
              </div>
            </div>
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

    <UModal v-model="showDisableConfirm">
      <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 text-orange-600" size="sm" />
            <h3 class="text-lg font-semibold">Отключить синхронизацию?</h3>
          </div>
        </template>

        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Вы уверены, что хотите отключить синхронизацию? Данные на этом устройстве сохранятся, но связь с другими
          устройствами будет разорвана. Сессия останется на сервере.
        </p>

        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="showDisableConfirm = false">
            Отмена
          </UButton>
          <UButton color="orange" @click="disableSync">
            Отключить
          </UButton>
        </div>
      </UCard>
    </UModal>

    <UModal v-model="showDeleteConfirm">
      <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-trash" class="mr-2 text-red-600" size="sm" />
            <h3 class="text-lg font-semibold">Удалить сессию с сервера?</h3>
          </div>
        </template>

        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Вы уверены, что хотите <strong>полностью удалить</strong> сессию с сервера? Все подключенные устройства 
          потеряют доступ к синхронизированным данным. Это действие нельзя отменить.
        </p>

        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="showDeleteConfirm = false">
            Отмена
          </UButton>
          <UButton color="red" @click="deleteSession" :loading="isDeleting">
            Удалить навсегда
          </UButton>
        </div>
      </UCard>
    </UModal>

    <UModal v-if="showScannerModal" v-model="showScannerModal">
      <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-camera" class="mr-2 text-blue-600" size="sm" />
            <h3 class="text-lg font-semibold">Сканировать QR-код</h3>
          </div>
        </template>

        <div class="text-center">
          <div v-if="isCameraActive" class="relative mx-auto w-full max-w-sm h-64 bg-gray-200 dark:bg-gray-800 mb-4">
            <div id="qr-scanner-container" class="w-full h-full"></div>
            <div class="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"></div>
          </div>
          <div v-else
            class="mx-auto w-full max-w-sm h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
            <UButton color="primary" @click="startScanner" icon="i-heroicons-camera">
              Включить камеру
            </UButton>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Наведите камеру на QR-код для синхронизации с другим устройством
          </p>
        </div>

        <div class="flex justify-between">
          <UButton color="gray" @click="closeScanner">
            Отмена
          </UButton>
          <UButton color="blue" @click="manualInput">
            Ввести вручную
          </UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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

const themeOptions = [
  { label: 'Светлая', value: 'light' },
  { label: 'Темная', value: 'dark' },
  { label: 'Системная', value: 'system' }
];

const appSettings = ref({
  notifications: userStore.notifications || false,
  achievementNotifications: userStore.achievementNotifications || false,
  theme: userStore.theme || 'system',
});

const quitDateInput = ref('');
const showResetConfirm = ref(false);
const confirmText = ref('');
const userNameInput = ref(userStore.userName || '');

const sessionInput = ref('');
const showDisableConfirm = ref(false);
const showDeleteConfirm = ref(false);
const showScannerModal = ref(false);
const isCameraActive = ref(false);
const isDeleting = ref(false);
const isRefreshingQR = ref(false);
const qrCodeKey = ref(0);
const isChecking = ref(false);
let scanner: any = null;

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

const applyTheme = (theme: string) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (theme === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

const saveAppSettings = () => {
  userStore.updateAppSettings({
    notifications: appSettings.value.notifications,
    achievementNotifications: appSettings.value.achievementNotifications,
    theme: appSettings.value.theme,
  });

  applyTheme(appSettings.value.theme);

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

const checkConnection = async () => {
  isChecking.value = true;
  await syncStore.diagnoseConnection();
  isChecking.value = false;
};

const enableSync = async () => {
  await syncStore.enableSync();

  if (syncStore.error) {
    showToast({
      title: 'Ошибка синхронизации',
      description: syncStore.error,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'danger',
      timeout: 5000
    });
    return;
  }

  showToast({
    title: 'Синхронизация включена',
    description: 'Теперь вы можете синхронизировать данные между устройствами',
    icon: 'i-heroicons-check-circle',
    color: 'success',
    timeout: 3000
  });
};

const refreshQrCode = async () => {
  if (isRefreshingQR.value) return;

  isRefreshingQR.value = true;

  try {
    await syncStore.generateQRCode();
    qrCodeKey.value++; 

    setTimeout(() => {
      isRefreshingQR.value = false;
    }, 1000);
  } catch (error) {
    console.error('Ошибка при обновлении QR-кода:', error);
    isRefreshingQR.value = false;
  }
};

const disableSync = () => {
  syncStore.disableSync();
  showDisableConfirm.value = false;

  showToast({
    title: 'Синхронизация отключена',
    description: 'Сессия остается на сервере, но синхронизация на этом устройстве отключена',
    icon: 'i-heroicons-information-circle',
    color: 'info',
    timeout: 3000
  });
};

const deleteSession = async () => {
  isDeleting.value = true;
  
  try {
    await syncStore.deleteSession();
    showDeleteConfirm.value = false;

    showToast({
      title: 'Сессия удалена',
      description: 'Сессия полностью удалена с сервера',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 3000
    });
  } catch (error) {
    showToast({
      title: 'Ошибка удаления',
      description: syncStore.error || 'Не удалось удалить сессию с сервера',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'danger',
      timeout: 3000
    });
  } finally {
    isDeleting.value = false;
  }
};

const joinSession = async () => {
  if (!sessionInput.value) return;

  const success = await syncStore.joinSession(sessionInput.value);

  if (success) {
    showToast({
      title: 'Подключено успешно',
      description: 'Ваши данные синхронизированы',
      icon: 'i-heroicons-check-circle',
      color: 'success',
      timeout: 3000
    });
    sessionInput.value = '';
  } else {
    showToast({
      title: 'Ошибка подключения',
      description: syncStore.error || 'Не удалось подключиться к сессии',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'danger',
      timeout: 3000
    });
  }
};

const startScanner = async () => {
  try {
    const { default: QrScanner } = await import('qr-scanner');

    const videoElement = document.createElement('video');
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';

    const container = document.getElementById('qr-scanner-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(videoElement);

      scanner = new QrScanner(
        videoElement,
        (result: any) => {
          handleScanResult(result.data);
          closeScanner();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scanner.start();
      isCameraActive.value = true;
    }
  } catch (error) {
    console.error('Ошибка при запуске сканера:', error);
    showToast({
      title: 'Ошибка камеры',
      description: 'Не удалось получить доступ к камере',
      icon: 'i-heroicons-exclamation-triangle',
      color: 'danger',
      timeout: 3000
    });
  }
};

const closeScanner = () => {
  if (scanner) {
    scanner.stop();
    scanner.destroy();
    scanner = null;
  }
  isCameraActive.value = false;
  showScannerModal.value = false;
};

const handleScanResult = (data: string) => {
  try {
    const url = new URL(data);
    const sessionId = url.searchParams.get('session');

    if (sessionId) {
      sessionInput.value = sessionId;
      joinSession();
    } else {
      sessionInput.value = data;
      joinSession();
    }
  } catch (error) {
    sessionInput.value = data;
    joinSession();
  }
};

const manualInput = () => {
  closeScanner();
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

onMounted(async () => {
  await syncStore.initialize();

  if (syncStore.error && !syncStore.configValid) {
    await syncStore.diagnoseConnection();
  }

  await syncStore.processUrlParams();

  if (syncStore.isSessionActive && !syncStore.qrCodeDataUrl) {
    await syncStore.generateQRCode();
  }

  if (userStore.quitDate) {
    try {
      const date = new Date(userStore.quitDate);
      quitDateInput.value = date.toISOString().slice(0, 16);
    } catch (error) {
      console.error('Error setting quit date input:', error);
    }
  }

  userNameInput.value = userStore.userName || '';
  applyTheme(userStore.theme || 'system');

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (appSettings.value.theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
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
    .qr-container {
      transition: all 0.3s ease;
    }
    .animate-refresh {
      animation: pulse 1s ease;
    }
    .qr-fade-enter-active,
    .qr-fade-leave-active {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .qr-fade-enter-from,
    .qr-fade-leave-to {
      opacity: 0;
      transform: scale(0.95);
    }
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.97);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    `;
    document.head.appendChild(styles);
  }
});

onUnmounted(() => {
  if (scanner) {
    scanner.stop();
    scanner.destroy();
  }
});
</script>