<template>
  <div class="px-1 md:px-0">
    <h1 class="text-2xl md:text-3xl font-bold text-white mb-8">Настройки</h1>

    <!-- Smoking info -->
    <div class="mb-10">
      <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Информация о курении</div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Сигарет в день</label>
          <div class="relative">
            <input
              v-model.number="smokingSettings.cigarettesPerDay"
              type="text" pattern="[0-9]*" inputmode="numeric" placeholder="20"
              @blur="saveSmokingSettings"
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 pr-10 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">шт.</span>
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Сигарет в пачке</label>
          <div class="relative">
            <input
              v-model.number="smokingSettings.cigarettesInPack"
              type="text" pattern="[0-9]*" inputmode="numeric" placeholder="20"
              @blur="saveSmokingSettings"
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 pr-10 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">шт.</span>
          </div>
        </div>
        <div>
          <label class="text-xs text-gray-500 mb-1.5 block">Стоимость пачки</label>
          <div class="relative">
            <input
              v-model.number="smokingSettings.cigarettePrice"
              type="text" pattern="[0-9]*[.]?[0-9]*" inputmode="decimal" placeholder="10"
              @blur="saveSmokingSettings"
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 pr-12 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-600">EUR</span>
          </div>
        </div>
      </div>
      <p class="text-xs text-gray-600">Используются для расчёта сэкономленных средств</p>
    </div>

    <!-- Your name -->
    <div class="mb-10">
      <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Приложение</div>
      <div class="mb-4 max-w-sm">
        <label class="text-xs text-gray-500 mb-1.5 block">Ваше имя</label>
        <div class="relative">
          <input
            v-model="userNameInput"
            placeholder="Введите ваше имя"
            @blur="updateUserName"
            class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 pr-8 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
          />
          <div v-if="userNameInput && userNameInput === userStore.userName"
               class="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <p class="text-xs text-gray-600 mt-1">Используется для персонализированных сообщений</p>
      </div>
    </div>

    <!-- Quit date -->
    <div class="mb-10">
      <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Отказ от курения</div>

      <div v-if="userStore.hasQuit">
        <p class="text-sm text-gray-400 mb-4">
          Вы бросили курить {{ userStore.quitDate ? formatDate(userStore.quitDate) : '' }}
        </p>
        <div class="max-w-sm mb-3">
          <label class="text-xs text-gray-500 mb-1.5 block">Изменить дату</label>
          <input
            v-model="quitDateInput"
            type="datetime-local" :max="today"
            class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] [color-scheme:dark]"
          />
        </div>
        <button @click="updateQuitDate"
          class="text-xs bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition-colors">
          Обновить дату
        </button>
      </div>

      <div v-else>
        <p class="text-sm text-gray-500 mb-3">Вы ещё не установили дату отказа от курения.</p>
        <NuxtLink to="/" class="text-sm text-green-500 hover:text-green-400 transition-colors">
          Перейти на главную →
        </NuxtLink>
      </div>
    </div>

    <!-- Sync -->
    <div class="mb-10">
      <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Синхронизация</div>

      <!-- Server not configured -->
      <div v-if="!syncStore.configValid">
        <p class="text-sm text-gray-500 mb-3">
          Сервер синхронизации не настроен или недоступен. Данные сохраняются локально.
        </p>
        <details class="mb-3">
          <summary class="cursor-pointer text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Техническая информация
          </summary>
          <div class="mt-2 p-3 rounded-lg bg-[#161b22] border border-[#30363d] text-xs">
            <pre class="whitespace-pre-wrap text-gray-500">{{ syncStore.diagnostics || 'Диагностика недоступна' }}</pre>
          </div>
        </details>
        <button @click="checkConnection" :disabled="isChecking"
          class="text-xs text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50">
          {{ isChecking ? 'Проверка...' : 'Проверить снова' }}
        </button>
      </div>

      <!-- Sync not active -->
      <div v-else-if="!syncStore.isSessionActive && syncStore.configValid">
        <p class="text-sm text-gray-400 mb-4">
          Включите синхронизацию для использования данных на разных устройствах.
        </p>
        <button @click="enableSync"
          class="text-sm bg-green-600 text-white py-2.5 px-6 rounded-lg hover:bg-green-500 transition-colors">
          Включить синхронизацию
        </button>

        <div class="mt-8 pt-6 border-t border-[#30363d]">
          <div class="text-xs text-gray-500 mb-3">Подключиться к существующей сессии</div>
          <div class="max-w-sm mb-3">
            <input
              v-model="sessionInput"
              placeholder="ID сессии"
              class="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
            />
          </div>
          <div class="flex gap-4">
            <button @click="showScannerModal = true"
              class="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Сканировать QR
            </button>
            <button :disabled="!sessionInput" @click="joinSession"
              class="text-xs text-green-500 hover:text-green-400 transition-colors disabled:opacity-30">
              Подключиться
            </button>
          </div>
        </div>
      </div>

      <!-- Sync active -->
      <div v-else-if="syncStore.configValid">
        <div class="flex items-center justify-between mb-5">
          <div>
            <div class="text-sm text-gray-300">Синхронизация активна</div>
            <p class="text-xs mt-0.5" :class="syncStore.error ? 'text-red-500' : 'text-gray-500'">
              {{ syncStore.error || syncStore.syncStatus }}
            </p>
          </div>
          <button @click="syncStore.syncData()"
            class="text-xs bg-[#161b22] border border-[#30363d] text-gray-400 py-1.5 px-3 rounded-lg hover:bg-[#21262d] hover:border-[#444d56] transition-colors">
            Синхронизировать
          </button>
        </div>

        <div class="mb-6">
          <div class="text-xs text-gray-500 mb-3">QR-код для синхронизации</div>

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

          <div class="space-y-2 mb-3">
            <div class="flex items-center gap-2">
              <code class="text-xs text-gray-500 bg-[#161b22] border border-[#30363d] px-2 py-1 rounded">
                {{ syncStore.sessionId.slice(0, 8) }}...{{ syncStore.sessionId.slice(-4) }}
              </code>
              <button @click="copySessionId"
                class="text-xs transition-colors"
                :class="sessionIdCopied ? 'text-green-500' : 'text-gray-600 hover:text-gray-300'">
                {{ sessionIdCopied ? 'Скопировано' : 'Копировать ID' }}
              </button>
            </div>
            <div class="flex items-center gap-2">
              <code class="text-xs text-gray-500 bg-[#161b22] border border-[#30363d] px-2 py-1 rounded max-w-48 truncate">
                {{ syncStore.syncUrl }}
              </code>
              <button @click="copySyncUrl"
                class="text-xs transition-colors"
                :class="syncUrlCopied ? 'text-green-500' : 'text-gray-600 hover:text-gray-300'">
                {{ syncUrlCopied ? 'Скопировано' : 'Копировать ссылку' }}
              </button>
            </div>
          </div>

          <button @click="refreshQrCode" :disabled="isRefreshingQR"
            class="text-xs text-gray-600 hover:text-gray-300 transition-colors disabled:opacity-50">
            Обновить QR-код
          </button>
        </div>

        <div class="space-y-4 pt-4 border-t border-[#30363d]">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-orange-400">Отключить синхронизацию</div>
              <p class="text-xs text-gray-600 mt-0.5">Данные сохранятся, но связь будет разорвана</p>
            </div>
            <button @click="showDisableConfirm = true"
              class="text-xs text-orange-400 hover:text-orange-300 transition-colors">
              Отключить
            </button>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-[#30363d]">
            <div>
              <div class="text-sm text-red-500">Удалить сессию</div>
              <p class="text-xs text-gray-600 mt-0.5">Полностью удалить сессию с сервера</p>
            </div>
            <button @click="showDeleteConfirm = true"
              class="text-xs text-red-500 hover:text-red-400 transition-colors">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Background GIF -->
    <div class="mb-10">
      <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Фон таймера</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-2">
        <button
          @click="setFavoriteGif(null)"
          class="relative rounded-lg overflow-hidden border-2 transition-colors aspect-video"
          :class="!userStore.favoriteGif ? 'border-green-500' : 'border-[#30363d] hover:border-[#444d56]'"
        >
          <div class="w-full h-full bg-[#161b22] flex items-center justify-center">
            <span class="text-[9px] text-gray-500 px-1 text-center leading-tight">Случайный</span>
          </div>
          <div v-if="!userStore.favoriteGif" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
        </button>
        <button
          v-for="gif in availableGifs"
          :key="gif.name"
          @click="setFavoriteGif(gif.name)"
          class="relative rounded-lg overflow-hidden border-2 transition-colors aspect-video"
          :class="userStore.favoriteGif === gif.name ? 'border-green-500' : 'border-[#30363d] hover:border-[#444d56]'"
        >
          <img :src="gif.src" :alt="gif.label" class="w-full h-full object-cover" />
          <div v-if="userStore.favoriteGif === gif.name" class="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
        </button>
      </div>
      <p class="text-xs text-gray-600">
        {{ userStore.favoriteGif ? `Выбрано: ${availableGifs.find(g => g.name === userStore.favoriteGif)?.label || userStore.favoriteGif}` : 'Каждый раз показывается случайная гифка' }}
      </p>
    </div>

    <!-- Reset data -->
    <div class="mb-10">
      <!-- <div class="text-[11px] text-gray-500 uppercase tracking-widest mb-4">Сброс данных</div> -->
      <!-- <p class="text-sm text-gray-500 mb-4">
        Сброс удалит дату отказа, достижения и статистику. Восстановление невозможно.
      </p> -->
      <button @click="showResetConfirm = true"
        class="text-sm text-red-500 hover:text-red-400 transition-colors">
        Сбросить все данные
      </button>
    </div>

    <!-- Modal: Reset confirm -->
    <Teleport to="body">
      <div v-if="showResetConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div class="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center gap-2 px-6 py-4 border-b border-[#30363d]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span class="text-base font-semibold text-white">Подтверждение сброса</span>
          </div>
          <div class="px-6 py-5">
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5">
              <p class="text-sm text-red-400">Вы действительно хотите удалить все данные? Это действие нельзя отменить и все ваши достижения будут потеряны.</p>
            </div>
            <label class="text-xs text-gray-500 mb-1.5 block">Введите "УДАЛИТЬ" для подтверждения:</label>
            <input
              v-model="confirmText"
              placeholder="УДАЛИТЬ"
              class="modal-delete-confirm w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#444d56] placeholder-gray-600"
            />
          </div>
          <div class="flex flex-col-reverse sm:flex-row gap-2 px-6 pb-6 sm:justify-end">
            <button @click="showResetConfirm = false"
              class="py-2 px-5 rounded-lg text-sm text-gray-400 bg-[#21262d] hover:bg-[#30363d] transition-colors">
              Отмена
            </button>
            <button @click="resetAllData" :disabled="confirmText !== 'УДАЛИТЬ'"
              class="py-2 px-5 rounded-lg text-sm text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Да, удалить все
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Disable sync confirm -->
    <Teleport to="body">
      <div v-if="showDisableConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div class="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center gap-2 px-6 py-4 border-b border-[#30363d]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span class="text-base font-semibold text-white">Отключить синхронизацию?</span>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-gray-400">
              Данные на этом устройстве сохранятся, но связь с другими устройствами будет разорвана.
            </p>
          </div>
          <div class="flex gap-2 px-6 pb-6 justify-end">
            <button @click="showDisableConfirm = false"
              class="py-2 px-5 rounded-lg text-sm text-gray-400 bg-[#21262d] hover:bg-[#30363d] transition-colors">
              Отмена
            </button>
            <button @click="disableSync"
              class="py-2 px-5 rounded-lg text-sm text-white bg-orange-600 hover:bg-orange-500 transition-colors">
              Отключить
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Delete session confirm -->
    <Teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div class="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center gap-2 px-6 py-4 border-b border-[#30363d]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.5 4h3a.5.5 0 000-1h-3a.5.5 0 000 1zM3 5.5A.5.5 0 013.5 5h13a.5.5 0 010 1H3.5a.5.5 0 01-.5-.5zM5 7.5a.5.5 0 01.5-.5h9a.5.5 0 010 1H5.5a.5.5 0 01-.5-.5zM6 10h8v6a2 2 0 01-2 2H8a2 2 0 01-2-2v-6z" clip-rule="evenodd" />
            </svg>
            <span class="text-base font-semibold text-white">Удалить сессию с сервера?</span>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-gray-400">
              Все подключённые устройства потеряют доступ к данным. Это действие нельзя отменить.
            </p>
          </div>
          <div class="flex gap-2 px-6 pb-6 justify-end">
            <button @click="showDeleteConfirm = false"
              class="py-2 px-5 rounded-lg text-sm text-gray-400 bg-[#21262d] hover:bg-[#30363d] transition-colors">
              Отмена
            </button>
            <button @click="deleteSession" :disabled="isDeleting"
              class="py-2 px-5 rounded-lg text-sm text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50">
              {{ isDeleting ? 'Удаление...' : 'Удалить навсегда' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: QR Scanner -->
    <Teleport to="body">
      <div v-if="showScannerModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
        <div class="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center gap-2 px-6 py-4 border-b border-[#30363d]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 5a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm8 0a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3h-2a3 3 0 01-3-3V5zm-8 8a3 3 0 013-3h2a3 3 0 013 3v2a3 3 0 01-3 3H5a3 3 0 01-3-3v-2zm2-8a1 1 0 000 2h2a1 1 0 000-2H4zm0 8a1 1 0 000 2h2a1 1 0 000-2H4zm8-8a1 1 0 000 2h2a1 1 0 000-2h-2z" clip-rule="evenodd" />
            </svg>
            <span class="text-base font-semibold text-white">Сканировать QR-код</span>
          </div>
          <div class="px-6 py-5">
            <div v-if="isCameraActive" class="relative mx-auto w-full max-w-sm h-64 bg-[#0d1117] rounded-lg mb-4 overflow-hidden">
              <div id="qr-scanner-container" class="w-full h-full"></div>
              <div class="absolute inset-0 border-2 border-green-500/50 border-dashed pointer-events-none rounded-lg"></div>
            </div>
            <div v-else class="mx-auto w-full max-w-sm h-64 bg-[#0d1117] rounded-lg flex items-center justify-center mb-4">
              <button @click="startScanner"
                class="text-sm text-green-500 hover:text-green-400 transition-colors">
                Включить камеру
              </button>
            </div>
            <p class="text-xs text-gray-600 text-center">Наведите камеру на QR-код</p>
          </div>
          <div class="flex justify-between px-6 pb-6">
            <button @click="closeScanner"
              class="py-2 px-5 rounded-lg text-sm text-gray-400 bg-[#21262d] hover:bg-[#30363d] transition-colors">
              Отмена
            </button>
            <button @click="manualInput"
              class="py-2 px-5 rounded-lg text-sm text-gray-400 bg-[#21262d] hover:bg-[#30363d] transition-colors">
              Ввести вручную
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '~/stores/user';
import { useAchievementsStore } from '~/stores/achievements';
import { useSyncStore } from '~/stores/sync';

const availableGifs = [
  { name: 'timer.gif', src: '/bg/timer.gif', label: 'Оригинал' },
  { name: 'elon.gif', src: '/bg/elon.gif', label: 'Маск' },
  { name: 'timer1.gif', src: '/bg/timer1.gif', label: 'Таймер' },
  { name: 'mads.gif', src: '/bg/mads.gif', label: 'Мадс' },
  { name: 'cigarrillo.gif', src: '/bg/cigarrillo.gif', label: 'Классик' },
  { name: 'sad.gif', src: '/bg/sad.gif', label: 'Грусть' },
  { name: 'marlboro.gif', src: '/bg/marlboro.gif', label: 'Пачка Marlboro' },
  { name: 'morning.gif', src: '/bg/morning.gif', label: 'Утро' },
  { name: 'no.gif', src: '/bg/no.gif', label: 'Нет курению' },
  { name: 'nono.gif', src: '/bg/nono.gif', label: 'Нет курению' },
  { name: 'nonono.gif', src: '/bg/nonono.gif', label: 'Нет курению' },
  { name: 'superman.gif', src: '/bg/superman.gif', label: 'Супермен' },
  { name: 'smoking.gif', src: '/bg/smoking.gif', label: 'Jack' },
];

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

const setFavoriteGif = (gifName: string | null) => {
  userStore.setFavoriteGif(gifName);
  if (syncStore.syncEnabled) syncStore.pushData();
};

watch(appSettings, () => { saveAppSettings(); }, { deep: true });

watch(showResetConfirm, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      const inputElement = document.querySelector('.modal-delete-confirm');
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
});

onUnmounted(() => {
  if (scanner) { scanner.stop(); scanner.destroy(); }
});
</script>

<style scoped>
.qr-fade-enter-active,
.qr-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.qr-fade-enter-from,
.qr-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.animate-refresh {
  animation: pulse-qr 1s ease;
}
@keyframes pulse-qr {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.97); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
