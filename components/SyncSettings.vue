<template>
    <UCard :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
      class="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-cloud" class="mr-2 text-primary-600 dark:text-primary-400" size="lg" />
          <h2 class="text-xl font-semibold text-primary-700 dark:text-primary-400">Синхронизация между устройствами</h2>
        </div>
      </template>
  
      <!-- <div v-if="syncStore.error && !syncStore.configValid" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">
          Ошибка конфигурации синхронизации
        </h3>
        <p class="text-gray-800 dark:text-gray-200 mb-3">
          Для работы синхронизации необходимо правильно настроить подключение к Supabase:
        </p>
        <div class="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 mb-3 font-mono overflow-auto">
          {{ syncStore.diagnostics || syncStore.error }}
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-3">
          Убедитесь, что вы создали проект в Supabase и добавили правильные ключи в переменные окружения.
        </p>
        <div class="flex justify-end">
          <UButton color="primary" size="sm" @click="syncStore.diagnoseConnection()" :loading="isChecking">
            Проверить подключение
          </UButton>
        </div>
      </div> -->
  
      <div v-if="!syncStore.isSessionActive && syncStore.configValid">
        <p class="mb-4 text-gray-700 dark:text-gray-300">
          Включите синхронизацию, чтобы использовать данные о вашем прогрессе на разных устройствах.
        </p>
        
        <UButton color="primary" block @click="enableSync" icon="i-heroicons-cloud-arrow-up">
          Включить синхронизацию
        </UButton>
      </div>
  
      <div v-else-if="syncStore.configValid">
        <div class="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <div class="font-medium text-lg">Статус синхронизации</div>
            <p class="text-sm" :class="syncStore.error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'">
              {{ syncStore.error || syncStore.syncStatus }}
            </p>
          </div>
          <UButton color="primary" size="sm" icon="i-heroicons-arrow-path" :loading="syncStore.isSyncing" 
            @click="syncStore.syncData()">
            Синхронизировать
          </UButton>
        </div>
  
        <div class="mt-4">
          <div class="text-center mb-4">
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Отсканируйте этот QR-код на другом устройстве, чтобы синхронизировать данные
            </p>
            
            <div v-if="syncStore.qrCodeDataUrl" class="bg-white p-3 rounded-lg inline-block shadow-md">
              <img :src="syncStore.qrCodeDataUrl" alt="QR код для синхронизации" class="mx-auto" />
            </div>
            <div v-else class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg inline-block w-64 h-64 flex items-center justify-center">
              <UButton color="primary" @click="syncStore.generateQRCode()" icon="i-heroicons-qr-code">
                Сгенерировать QR-код
              </UButton>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div>
              <div class="font-medium">ID сессии</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ syncStore.sessionId }}</p>
            </div>
            
            <UButton color="gray" size="sm" @click="syncStore.generateQRCode()" icon="i-heroicons-arrow-path">
              Обновить код
            </UButton>
          </div>
        </div>
  
        <div class="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div class="flex justify-between items-center">
            <div>
              <div class="font-medium text-red-600 dark:text-red-400">Отключить синхронизацию</div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Локальные данные сохранятся, но связь между устройствами будет разорвана
              </p>
            </div>
            <UButton color="red" variant="soft" size="sm" @click="showDisableConfirm = true" icon="i-heroicons-no-symbol">
              Отключить
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  
    <UCard v-if="!syncStore.isSessionActive && syncStore.configValid" :ui="{ ring: '', header: { padding: 'px-6 py-4' }, body: { base: 'p-6' } }"
      class="mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md">
      <template #header>
        <div class="flex items-center">
          <UIcon name="i-heroicons-qr-code" class="mr-2 text-blue-600 dark:text-blue-400" size="lg" />
          <h2 class="text-xl font-semibold text-blue-700 dark:text-blue-400">Подключиться к существующей сессии</h2>
        </div>
      </template>
  
      <p class="mb-4 text-gray-700 dark:text-gray-300">
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
    </UCard>
  
    <UModal v-model="showDisableConfirm">
      <UCard :ui="{ ring: '', body: { base: 'p-6' } }">
        <template #header>
          <div class="flex items-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="mr-2 text-red-600" size="sm" />
            <h3 class="text-lg font-semibold">Отключить синхронизацию?</h3>
          </div>
        </template>
  
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Вы уверены, что хотите отключить синхронизацию? Данные на этом устройстве сохранятся, но связь с другими устройствами будет разорвана.
        </p>
  
        <div class="flex justify-end gap-2">
          <UButton color="gray" @click="showDisableConfirm = false">
            Отмена
          </UButton>
          <UButton color="red" @click="disableSync">
            Отключить
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
          <div v-else class="mx-auto w-full max-w-sm h-64 bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
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
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useSyncStore } from '~/stores/sync';
  
  const syncStore = useSyncStore();
  const toast = useToast();
  
  const sessionInput = ref('');
  const showDisableConfirm = ref(false);
  const showScannerModal = ref(false);
  const isCameraActive = ref(false);
  const isChecking = ref(false);
  let scanner = null;
  
  const enableSync = async () => {
    await syncStore.enableSync();
    
    if (syncStore.error) {
      toast.add({
        title: 'Ошибка синхронизации',
        description: syncStore.error,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red',
        timeout: 5000
      });
      return;
    }
    
    toast.add({
      title: 'Синхронизация включена',
      description: 'Теперь вы можете синхронизировать данные между устройствами',
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000
    });
  };
  
  const disableSync = () => {
    syncStore.disableSync();
    showDisableConfirm.value = false;
    
    toast.add({
      title: 'Синхронизация отключена',
      icon: 'i-heroicons-information-circle',
      color: 'blue',
      timeout: 2000
    });
  };
  
  const joinSession = async () => {
    if (!sessionInput.value) return;
    
    const success = await syncStore.joinSession(sessionInput.value);
    
    if (success) {
      toast.add({
        title: 'Подключено успешно',
        description: 'Ваши данные синхронизированы',
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 3000
      });
      sessionInput.value = '';
    } else {
      toast.add({
        title: 'Ошибка подключения',
        description: syncStore.error || 'Не удалось подключиться к сессии',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red',
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
      container.innerHTML = '';
      container.appendChild(videoElement);
      
      scanner = new QrScanner(
        videoElement,
        result => {
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
    } catch (error) {
      console.error('Ошибка при запуске сканера:', error);
      toast.add({
        title: 'Ошибка камеры',
        description: 'Не удалось получить доступ к камере',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'red',
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
  
  const handleScanResult = (data) => {
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
  
  onMounted(async () => {
    await syncStore.initialize();
    
    if (syncStore.error && !syncStore.configValid) {
      isChecking.value = true;
      await syncStore.diagnoseConnection();
      isChecking.value = false;
    }
    
    await syncStore.processUrlParams();
    
    if (syncStore.isSessionActive && !syncStore.qrCodeDataUrl) {
      await syncStore.generateQRCode();
    }
  });
  
  onUnmounted(() => {
    if (scanner) {
      scanner.stop();
      scanner.destroy();
    }
  });
  </script>