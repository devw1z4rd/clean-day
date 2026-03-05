<template>
  <div class="px-1">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-8">
      Настройки
    </h1>

    <!-- Smoking info -->
    <div class="mb-10">
      <div class="text-[11px] md:text-xs text-gray-600 uppercase tracking-widest mb-4">
        Информация о курении
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Сигарет в день</label>
          <UInput v-model.number="smokingSettings.cigarettesPerDay" type="text" pattern="[0-9]*" inputmode="numeric"
            placeholder="20" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-600 mr-2 text-xs">шт.</span>
            </template>
          </UInput>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Сигарет в пачке</label>
          <UInput v-model.number="smokingSettings.cigarettesInPack" type="text" pattern="[0-9]*" inputmode="numeric"
            placeholder="20" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-600 mr-2 text-xs">шт.</span>
            </template>
          </UInput>
        </div>

        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Стоимость пачки</label>
          <UInput v-model.number="smokingSettings.cigarettePrice" type="text" pattern="[0-9]*[.]?[0-9]*"
            inputmode="decimal" placeholder="10" @blur="saveSmokingSettings" class="hide-spinners">
            <template #trailing>
              <span class="text-gray-600 mr-2 text-xs">EUR</span>
            </template>
          </UInput>
        </div>
      </div>

      <p class="text-xs text-gray-700">
        Эти данные используются для расчёта сэкономленных средств
      </p>
    </div>

    <!-- Your name -->
    <div class="mb-10">
      <div class="text-[11px] md:text-xs text-gray-600 uppercase tracking-widest mb-4">
        Приложение
      </div>

      <div class="mb-4">
        <label class="text-xs text-gray-500 mb-1.5 block">Ваше имя</label>
        <div class="relative max-w-sm">
          <UInput
            v-model="userNameInput"
            placeholder="Введите ваше имя"
            @blur="updateUserName"
          />
          <div v-if="userNameInput && userNameInput === userStore.userName"
               class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <UIcon name="i-heroicons-check-circle" class="text-green-500" size="sm" />
          </div>
        </div>
        <p class="text-xs text-gray-700 mt-1">Используется для персонализированных сообщений</p>
      </div>
    </div>

    <!-- Quit date -->
    <div class="mb-10">
      <div class="text-[11px] md:text-xs text-gray-600 uppercase tracking-widest mb-4">
        Отказ от курения
      </div>

      <div v-if="userStore.hasQuit">
        <p class="text-sm text-gray-400 mb-4">
          Вы бросили курить {{ userStore.quitDate ? formatDate(userStore.quitDate) : '' }}
        </p>

        <div class="max-w-sm">
          <label class="text-xs text-gray-500 mb-1.5 block">Изменить дату</label>
          <UInput v-model="quitDateInput" type="datetime-local" :max="today" class="hide-spinners" />
        </div>

        <button @click="updateQuitDate"
          class="mt-3 text-xs bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
          Обновить дату
        </button>
      </div>

      <div v-else class="text-sm text-gray-600">
        <p class="mb-3">Вы ещё не установили дату отказа от курения.</p>
        <NuxtLink to="/" class="text-green-500 hover:text-green-400 transition-colors">
          Перейти на главную
        </NuxtLink>
      </div>
    </div>

    <!-- Sync -->
    <div class="mb-10">
      <div class="text-[11px] md:text-xs text-gray-600 uppercase tracking-widest mb-4">
        Синхронизация
      </div>

      <div v-if="!syncStore.configValid">
        <p class="text-sm text-gray-500 mb-3">
          Сервер синхронизации не настроен или недоступен. Данные сохраняются локально.
        </p>

        <details class="mb-3">
          <summary class="cursor-pointer text-xs text-gray-700 hover:text-gray-400 transition-colors">
            Техническая информация
          </summary>
          <div class="mt-2 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
            <pre class="whitespace-pre-wrap text-gray-600">{{ syncStore.diagnostics || 'Диагностика недоступна' }}</pre>
          </div>
        </details>

        <button @click="checkConnection" :disabled="isChecking"
          class="text-xs text-gray-700 hover:text-gray-400 transition-colors">
          {{ isChecking ? 'Проверка...' : 'Проверить снова' }}
        </button>
      </div>

      <div v-else-if="!syncStore.isSessionActive && syncStore.configValid">
        <p class="text-sm text-gray-400 mb-4">
          Включите синхронизацию для использования данных на разных устройствах.
        </p>

        <button @click="enableSync"
          class="text-sm bg-green-600 text-white py-2.5 px-6 rounded-lg hover:bg-green-500 transition-colors">
          Включить синхронизацию
        </button>

        <div class="mt-8 pt-6 border-t border-white/5">
          <div class="text-xs text-gray-500 mb-3">Подключиться к существующей сессии</div>

          <div class="max-w-sm">
            <UInput v-model="sessionInput" placeholder="ID сессии" />
          </div>

          <div class="flex gap-3 mt-3">
            <button @click="showScannerModal = true"
              class="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              Сканировать QR
            </button>
            <button :disabled="!sessionInput" @click="joinSession"
              class="text-xs text-green-500 hover:text-green-400 transition-colors disabled:opacity-30">
              Подключиться
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="syncStore.configValid">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm text-gray-300">Синхронизация активна</div>
            <p class="text-xs" :class="syncStore.error ? 'text-red-500' : 'text-gray-600'">
              {{ syncStore.error || syncStore.syncStatus }}
            </p>
          </div>
          <button @click="syncStore.syncData()"
            class="text-xs bg-white/5 text-gray-400 py-1.5 px-3 rounded-lg hover:bg-white/10 transition-colors">
            Синхронизировать
          </button>
        </div>

        <div class="mb-6">
          <div class="text-xs text-gray-600 mb-3">QR-код для синхронизации</div>

          <Transition name="qr-fade" mode="out-in">
            <div v-if="syncStore.qrCodeDataUrl" :key="qrCodeKey"
              :class="{ 'animate-refresh': isRefreshingQR }"
              class="bg-white p-3 rounded-lg inline-block mb-3">
              <img :src="syncStore.qrCodeDataUrl" alt="QR" class="mx-auto" />
            </div>
            <div v-else class="mb-3">
              <button @click="refreshQrCode"
                class="text-xs text-green-500 hover:text-green-400 transition-colors">
                Сгенерировать QR-код
              </button>
            </div>
          </Transition>

          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <code class="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">
                {{ syncStore.sessionId.slice(0, 8) }}...{{ syncStore.sessionId.slice(-4) }}
              </code>
              <button @click="copySessionId"
                class="text-xs transition-colors"
                :class="sessionIdCopied ? 'text-green-500' : 'text-gray-700 hover:text-gray-400'">
                {{ sessionIdCopied ? 'Скопировано' : 'Копировать ID' }}
              </button>
            </div>

            <div class="flex items-center gap-2">
              <code class="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded max-w-48 truncate">
                {{ syncStore.syncUrl }}
              </code>
              <button @click="copySyncUrl"
                class="text-xs transition-colors"
                :class="syncUrlCopied ? 'text-green-500' : 'text-gray-700 hover:text-gray-400'">
                {{ syncUrlCopied ? 'Скопировано' : 'Копировать ссылку' }}
              </button>
            </div>
          </div>

          <button @click="refreshQrCode" :disabled="isRefreshingQR"
            class="mt-3 text-xs text-gray-700 hover:text-gray-400 transition-colors">
            Обновить QR-код
          </button>
        </div>

        <div class="space-y-4 pt-4 border-t border-white/5">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-orange-500">Отключить синхронизацию</div>
              <p class="text-xs text-gray-700">Данные сохранятся, но связь будет разорвана</p>
            </div>
            <button @click="showDisableConfirm = true"
              class="text-xs text-orange-500 hover:text-orange-400 transition-colors">
              Отключить
            </button>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <div>
              <div class="text-sm text-red-500">Удалить сессию</div>
              <p class="text-xs text-gray-700">Полностью удалить сессию с сервера</p>
            </div>
            <button @click="showDeleteConfirm = true"
              class="text-xs text-red-500 hover:text-red-400 transition-colors">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset data -->
    <div class="mb-10">
      <div class="text-[11px] md:text-xs text-gray-600 uppercase tracking-widest mb-4">
        Сброс данных
      </div>

      <p class="text-sm text-gray-600 mb-4">
        Сброс удалит дату отказа, достижения, статистику. Восстановление невозможно.
      </p>

      <button @click="showResetConfirm = true"
        class="text-sm text-red-500 hover:text-red-400 transition-colors">
        Сбросить все данные
      </button>
    </div>

    <!-- Modals -->
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
              class="order-1 sm:order-none w-full sm:w-auto">
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

        <p class="text-gray-400 mb-4">
          Данные на этом устройстве сохранятся, но связь с другими устройствами будет разорвана.
        </p>

        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="showDisableConfirm = false">Отмена</UButton>
          <UButton color="orange" @click="disableSync">Отключить</UButton>
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

        <p class="text-gray-400 mb-4">
          Все подключённые устройства потеряют доступ к данным. Это действие нельзя отменить.
        </p>

        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="showDeleteConfirm = false">Отмена</UButton>
          <UButton color="red" @click="deleteSession" :loading="isDeleting">Удалить навсегда</UButton>
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
          <div v-if="isCameraActive" class="relative mx-auto w-full max-w-sm h-64 bg-[#111] mb-4">
            <div id="qr-scanner-container" class="w-full h-full"></div>
            <div class="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"></div>
          </div>
          <div v-else class="mx-auto w-full max-w-sm h-64 bg-[#111] flex items-center justify-center mb-4 rounded-lg">
            <button @click="startScanner"
              class="text-sm text-green-500 hover:text-green-400 transition-colors">
              Включить камеру
            </button>
          </div>

          <p class="text-xs text-gray-600 mb-4">
            Наведите камеру на QR-код
          </p>
        </div>

        <div class="flex justify-between">
          <UButton color="gray" @click="closeScanner">Отмена</UButton>
          <UButton color="gray" @click="manualInput">Ввести вручную</UButton>
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
const sessionIdCopied = ref(false);
const syncUrlCopied = ref(false);
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

const copySessionId = async () => {
  const success = await syncStore.copySessionId();
  if (success) {
    sessionIdCopied.value = true;
    showToast({ title: 'ID скопирован', icon: 'i-heroicons-clipboard-document', color: 'success', timeout: 2000 });
    setTimeout(() => { sessionIdCopied.value = false; }, 2000);
  } else {
    showToast({ title: 'Ошибка копирования', icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 3000 });
  }
};

const copySyncUrl = async () => {
  const success = await syncStore.copySyncUrl();
  if (success) {
    syncUrlCopied.value = true;
    showToast({ title: 'Ссылка скопирована', icon: 'i-heroicons-link', color: 'success', timeout: 2000 });
    setTimeout(() => { syncUrlCopied.value = false; }, 2000);
  } else {
    showToast({ title: 'Ошибка копирования', icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 3000 });
  }
};

const checkConnection = async () => {
  isChecking.value = true;
  await syncStore.diagnoseConnection();
  isChecking.value = false;
};

const updateQuitDate = () => {
  if (quitDateInput.value) {
    const selectedDate = new Date(quitDateInput.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      showToast({ title: 'Ошибка', description: 'Невозможно установить дату в будущем', icon: 'i-heroicons-exclamation-circle', color: 'danger', timeout: 3000 });
      return;
    }
    const dateValue = selectedDate.toISOString();
    if (userStore.quitDate !== dateValue) {
      userStore.setQuitDate(dateValue);
      achievementsStore.checkAchievements();
      if (syncStore.syncEnabled) syncStore.pushData();
      showToast({ title: 'Дата обновлена', icon: 'i-heroicons-check-circle', color: 'success', timeout: 1500 });
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
    if (syncStore.syncEnabled) syncStore.pushData();
    showToast({ title: 'Настройки сохранены', icon: 'i-heroicons-check-circle', color: 'success', timeout: 1500 });
  }
};

const applyTheme = () => {
  document.documentElement.classList.add('dark');
};

const saveAppSettings = () => {
  userStore.updateAppSettings({
    notifications: appSettings.value.notifications,
    achievementNotifications: appSettings.value.achievementNotifications,
    theme: appSettings.value.theme,
  });
  applyTheme();
  if (syncStore.syncEnabled) syncStore.pushData();
};

const updateUserName = () => {
  if (userNameInput.value !== userStore.userName) {
    userStore.setUserName(userNameInput.value);
    if (syncStore.syncEnabled) syncStore.pushData();
    showToast({ title: 'Имя сохранено', icon: 'i-heroicons-check-circle', color: 'success', timeout: 1500 });
  }
};

const resetAllData = () => {
  if (confirmText.value !== 'УДАЛИТЬ') return;
  if (typeof window !== 'undefined') {
    syncStore.resetSync();
    localStorage.removeItem('clean-day-user');
    localStorage.removeItem('clean-day-achievements');
    showResetConfirm.value = false;
    showToast({ title: 'Данные удалены', description: 'Перезагрузка...', icon: 'i-heroicons-information-circle', color: 'info', timeout: 1500 });
    setTimeout(() => { window.location.reload(); }, 1500);
  }
};

const enableSync = async () => {
  await syncStore.enableSync();
  if (syncStore.error) {
    showToast({ title: 'Ошибка', description: syncStore.error, icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 5000 });
    return;
  }
  showToast({ title: 'Синхронизация включена', icon: 'i-heroicons-check-circle', color: 'success', timeout: 3000 });
};

const refreshQrCode = async () => {
  if (isRefreshingQR.value) return;
  isRefreshingQR.value = true;
  try {
    await syncStore.generateQRCode();
    qrCodeKey.value++;
    setTimeout(() => { isRefreshingQR.value = false; }, 1000);
  } catch (error) {
    console.error('QR refresh error:', error);
    isRefreshingQR.value = false;
  }
};

const disableSync = () => {
  syncStore.disableSync();
  showDisableConfirm.value = false;
  showToast({ title: 'Синхронизация отключена', icon: 'i-heroicons-information-circle', color: 'info', timeout: 3000 });
};

const deleteSession = async () => {
  isDeleting.value = true;
  try {
    await syncStore.deleteSession();
    showDeleteConfirm.value = false;
    showToast({ title: 'Сессия удалена', icon: 'i-heroicons-check-circle', color: 'success', timeout: 3000 });
  } catch (error) {
    showToast({ title: 'Ошибка', description: syncStore.error || 'Не удалось удалить', icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 3000 });
  } finally {
    isDeleting.value = false;
  }
};

const joinSession = async () => {
  if (!sessionInput.value) return;
  const success = await syncStore.joinSession(sessionInput.value);
  if (success) {
    showToast({ title: 'Подключено', icon: 'i-heroicons-check-circle', color: 'success', timeout: 3000 });
    sessionInput.value = '';
  } else {
    showToast({ title: 'Ошибка', description: syncStore.error || 'Не удалось подключиться', icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 3000 });
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
      scanner = new QrScanner(videoElement, (result: any) => { handleScanResult(result.data); closeScanner(); },
        { highlightScanRegion: true, highlightCodeOutline: true });
      await scanner.start();
      isCameraActive.value = true;
    }
  } catch (error) {
    console.error('Scanner error:', error);
    showToast({ title: 'Ошибка камеры', icon: 'i-heroicons-exclamation-triangle', color: 'danger', timeout: 3000 });
  }
};

const closeScanner = () => {
  if (scanner) { scanner.stop(); scanner.destroy(); scanner = null; }
  isCameraActive.value = false;
  showScannerModal.value = false;
};

const handleScanResult = (data: string) => {
  try {
    const url = new URL(data);
    const sessionId = url.searchParams.get('session');
    sessionInput.value = sessionId || data;
  } catch (error) {
    sessionInput.value = data;
  }
  joinSession();
};

const manualInput = () => { closeScanner(); };

watch(appSettings, () => { saveAppSettings(); }, { deep: true });

watch(showResetConfirm, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      const inputElement = document.querySelector('.modal-delete-confirm input');
      if (inputElement instanceof HTMLElement) inputElement.blur();
      document.body.focus();
    }, 50);
  }
});

onMounted(async () => {
  await syncStore.initialize();
  if (syncStore.error && !syncStore.configValid) await syncStore.diagnoseConnection();
  await syncStore.processUrlParams();
  if (syncStore.isSessionActive && !syncStore.qrCodeDataUrl) await syncStore.generateQRCode();
  if (userStore.quitDate) {
    try { quitDateInput.value = new Date(userStore.quitDate).toISOString().slice(0, 16); } catch (error) {}
  }
  userNameInput.value = userStore.userName || '';
  applyTheme();

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const styles = document.createElement('style');
    styles.textContent = `
    .hide-spinners::-webkit-outer-spin-button,
    .hide-spinners::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    .hide-spinners { -moz-appearance: textfield; }
    .qr-container { transition: all 0.3s ease; }
    .animate-refresh { animation: pulse 1s ease; }
    .qr-fade-enter-active, .qr-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
    .qr-fade-enter-from, .qr-fade-leave-to { opacity: 0; transform: scale(0.95); }
    @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.97); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(styles);
  }
});

onUnmounted(() => {
  if (scanner) { scanner.stop(); scanner.destroy(); }
});
</script>
