import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useAchievementsStore } from "./achievements";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_SYNC_API_KEY; 

interface SyncData {
  id: string; 
  quitDate: string;
  userName: string;
  cigarettesPerDay: number;
  cigarettePrice: number;
  cigarettesInPack: number;
  notifications: boolean;
  achievementNotifications: boolean;
  theme: string;
  achievements: string;
  lastUpdated: number;
  createdAt: number;
}

interface SyncState {
  sessionId: string;
  isInitialized: boolean;
  lastSync: number;
  isSyncing: boolean;
  qrCodeDataUrl: string;
  syncEnabled: boolean;
  autoSyncInterval: NodeJS.Timeout | null;
  syncIntervalMinutes: number;
  error: string | null;
  configValid: boolean;
  diagnostics: string | null;
}

export const useSyncStore = defineStore("sync", {
  state: (): SyncState => ({
    sessionId: "",
    isInitialized: false,
    lastSync: 0,
    isSyncing: false,
    qrCodeDataUrl: "",
    syncEnabled: false,
    autoSyncInterval: null,
    syncIntervalMinutes: 10,
    error: null,
    configValid: false,
    diagnostics: null,
  }),

  getters: {
    syncStatus(): string {
      if (!this.syncEnabled) return "Отключена";
      if (this.isSyncing) return "Синхронизация...";

      const timeSinceLastSync = Date.now() - this.lastSync;
      if (this.lastSync === 0) return "Не синхронизировано";
      if (timeSinceLastSync < 60000) return "Синхронизировано только что";

      const minutes = Math.floor(timeSinceLastSync / 60000);
      if (minutes < 60) return `Синхронизировано ${minutes} мин. назад`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `Синхронизировано ${hours} ч. назад`;

      return `Синхронизировано более 1 дня назад`;
    },

    isSessionActive(): boolean {
      return this.sessionId !== "" && this.syncEnabled;
    },
  },

  actions: {
    getApiHeaders(): Record<string, string> {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
      }
      
      return headers;
    },

    async diagnoseConnection(): Promise<boolean> {
      try {
        this.diagnostics = `Проверка подключения к API...
URL: ${API_BASE_URL}
KEY: ${API_KEY ? "задан" : "не задан"}`;

        console.log('Diagnosing connection to:', API_BASE_URL);

        const response = await fetch(`${API_BASE_URL}/sync`, {
          method: 'GET',
          headers: this.getApiHeaders(),
        });

        console.log('Diagnosis response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Diagnosis failed:', errorText);
          
          this.configValid = false;
          this.error = `Ошибка подключения к API: ${response.status} ${response.statusText}`;
          this.diagnostics += `\nОтвет API: ${errorText}`;
          this.diagnostics += `\nПолный URL: ${response.url}`;
          this.diagnostics += `\nЗаголовки запроса: ${JSON.stringify(this.getApiHeaders(), null, 2)}`;
          return false;
        }

        const data = await response.json();
        console.log('API connection successful, sample data:', data);

        this.configValid = true;
        this.error = null;
        this.diagnostics = `Подключение к API успешно установлено
Количество записей: ${Array.isArray(data) ? data.length : 'unknown'}
Тип ответа: ${Array.isArray(data) ? 'array' : typeof data}`;
        return true;
      } catch (error) {
        console.error('Connection diagnosis error:', error);
        
        this.configValid = false;
        this.error = `Ошибка при проверке подключения: ${(error as Error).message}`;
        if (error instanceof Error) {
          this.diagnostics += `\nИсключение: ${error.message}`;
          this.diagnostics += `\nStack trace: ${error.stack}`;
        }
        return false;
      }
    },

    async initialize(): Promise<void> {
      if (this.isInitialized || typeof window === "undefined") return;

      try {
        await this.diagnoseConnection();

        if (!this.configValid) {
          this.isInitialized = true;
          return;
        }

        const savedSessionId = localStorage.getItem("clean-day-session-id");
        if (savedSessionId) {
          this.sessionId = savedSessionId;
          this.syncEnabled = localStorage.getItem("clean-day-sync-enabled") === "true";

          const savedInterval = localStorage.getItem("clean-day-sync-interval");
          if (savedInterval) {
            this.syncIntervalMinutes = parseInt(savedInterval, 10);
          }

          if (this.syncEnabled) {
            await this.fetchData();
            this.startAutoSync();
          }
        } else {
          this.sessionId = uuidv4();
          localStorage.setItem("clean-day-session-id", this.sessionId);
        }

        this.isInitialized = true;
      } catch (error) {
        console.error("Ошибка инициализации синхронизации:", error);
        this.error = "Ошибка инициализации синхронизации";
      }
    },

    async generateQRCode(): Promise<void> {
      if (!this.sessionId) return;

      try {
        const appUrl = window.location.origin + window.location.pathname;
        const syncUrl = `${appUrl}?session=${this.sessionId}`;

        this.qrCodeDataUrl = await QRCode.toDataURL(syncUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#4CAF50",
            light: "#FFFFFF",
          },
        });
      } catch (error) {
        console.error("Ошибка при генерации QR-кода:", error);
        this.error = "Ошибка при генерации QR-кода";
      }
    },

    async enableSync(): Promise<void> {
      if (!this.configValid) {
        await this.diagnoseConnection();
        if (!this.configValid) {
          this.error = "Невозможно включить синхронизацию: проблема с подключением к API";
          return;
        }
      }

      this.syncEnabled = true;
      localStorage.setItem("clean-day-sync-enabled", "true");
      await this.generateQRCode();
      await this.pushData();
      this.startAutoSync();
    },

    disableSync(): void {
      this.syncEnabled = false;
      localStorage.setItem("clean-day-sync-enabled", "false");

      if (this.autoSyncInterval) {
        clearInterval(this.autoSyncInterval);
        this.autoSyncInterval = null;
      }
    },

    startAutoSync(): void {
      if (this.autoSyncInterval) clearInterval(this.autoSyncInterval);

      const intervalMs = this.syncIntervalMinutes * 60 * 1000;

      this.autoSyncInterval = setInterval(() => {
        this.syncData();
      }, intervalMs);

      localStorage.setItem("clean-day-sync-interval", this.syncIntervalMinutes.toString());

      if (this.syncEnabled) {
        this.syncData();
      }
    },

    async joinSession(sessionId: string): Promise<boolean> {
      if (!this.configValid) {
        await this.diagnoseConnection();
        if (!this.configValid) {
          this.error = "Невозможно подключиться к сессии: проблема с подключением к API";
          return false;
        }
      }

      try {
        const response = await fetch(`${API_BASE_URL}/sync/${sessionId}`, {
          method: 'GET',
          headers: this.getApiHeaders(),
        });

        if (response.status === 404) {
          this.error = "Сессия не найдена";
          return false;
        }

        if (!response.ok) {
          this.error = `Ошибка при получении сессии: ${response.status}`;
          return false;
        }

        const sessionData: SyncData = await response.json();

        this.sessionId = sessionId;
        localStorage.setItem("clean-day-session-id", sessionId);

        this.syncEnabled = true;
        localStorage.setItem("clean-day-sync-enabled", "true");

        this.applyReceivedData(sessionData);
        this.startAutoSync();

        return true;
      } catch (error) {
        console.error("Ошибка при подключении к сессии:", error);
        this.error = "Ошибка при подключении к сессии";
        return false;
      }
    },

    async processUrlParams(): Promise<void> {
      if (typeof window === "undefined") return;

      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get("session");

      if (sessionParam) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        await this.joinSession(sessionParam);
      }
    },

    async syncData(): Promise<void> {
      if (!this.syncEnabled || !this.sessionId || this.isSyncing) return;

      this.isSyncing = true;
      this.error = null;

      try {
        await this.fetchData();
        await this.pushData();
        this.lastSync = Date.now();
      } catch (error) {
        console.error("Ошибка при синхронизации:", error);
        this.error = "Ошибка при синхронизации";
      } finally {
        this.isSyncing = false;
      }
    },

    async fetchData(): Promise<void> {
      if (!this.syncEnabled || !this.sessionId) return;

      try {
        console.log('Fetching data for session:', this.sessionId);
        
        const response = await fetch(`${API_BASE_URL}/sync/${this.sessionId}`, {
          method: 'GET',
          headers: this.getApiHeaders(),
        });

        console.log('Fetch response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });

        if (response.status === 404) {
          console.log('Session not found, will create new one');
          await this.pushData();
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch failed:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const sessionData: SyncData = await response.json();
        console.log('Fetched session data:', sessionData);

        if (sessionData.lastUpdated > this.lastSync) {
          console.log('Applying received data, lastUpdated:', sessionData.lastUpdated, 'vs lastSync:', this.lastSync);
          this.applyReceivedData(sessionData);
          this.lastSync = sessionData.lastUpdated;
        } else {
          console.log('Local data is up to date');
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        throw error;
      }
    },

    applyReceivedData(data: SyncData): void {
      const userStore = useUserStore();
      const achievementsStore = useAchievementsStore();

      userStore.$patch({
        quitDate: data.quitDate || null,
        userName: data.userName,
        cigarettesPerDay: data.cigarettesPerDay,
        cigarettePrice: data.cigarettePrice,
        cigarettesInPack: data.cigarettesInPack,
        notifications: data.notifications,
        achievementNotifications: data.achievementNotifications,
        theme: data.theme,
      });
      userStore.saveState();

      const achievementsArray = data.achievements ? data.achievements.split(',').filter(Boolean) : [];
      achievementsStore.unlockedAchievements = achievementsArray;
      achievementsStore.saveAchievements();
    },

    getCurrentSyncData(): SyncData {
      const userStore = useUserStore();
      const achievementsStore = useAchievementsStore();

      return {
        id: this.sessionId,
        quitDate: userStore.quitDate || "",
        userName: userStore.userName,
        cigarettesPerDay: userStore.cigarettesPerDay,
        cigarettePrice: userStore.cigarettePrice,
        cigarettesInPack: userStore.cigarettesInPack,
        notifications: userStore.notifications,
        achievementNotifications: userStore.achievementNotifications,
        theme: userStore.theme,
        achievements: achievementsStore.unlockedAchievements.join(','),
        lastUpdated: Date.now(),
        createdAt: Date.now(),
      };
    },

    async pushData(): Promise<void> {
      if (!this.syncEnabled || !this.sessionId) return;

      try {
        const syncData = this.getCurrentSyncData();
        console.log('Attempting to sync data:', { sessionId: this.sessionId, syncData });

        const checkResponse = await fetch(`${API_BASE_URL}/sync/${this.sessionId}`, {
          method: 'GET',
          headers: this.getApiHeaders(),
        });

        console.log('Check response status:', checkResponse.status);

        let response: Response;

        if (checkResponse.ok) {
          console.log('Session exists, updating with PUT');
          response = await fetch(`${API_BASE_URL}/sync/${this.sessionId}`, {
            method: 'PUT',
            headers: this.getApiHeaders(),
            body: JSON.stringify(syncData),
          });
        } else if (checkResponse.status === 404) {
          console.log('Session does not exist, creating new');
          
          response = await fetch(`${API_BASE_URL}/sync/${this.sessionId}`, {
            method: 'PUT',
            headers: this.getApiHeaders(),
            body: JSON.stringify(syncData),
          });

          if (!response.ok) {
            console.log('PUT failed, trying POST');
            response = await fetch(`${API_BASE_URL}/sync`, {
              method: 'POST',
              headers: this.getApiHeaders(),
              body: JSON.stringify(syncData),
            });
          }
        } else {
          const errorText = await checkResponse.text();
          console.error('Check request failed:', errorText);
          throw new Error(`Ошибка при проверке сессии: ${checkResponse.status} - ${errorText}`);
        }

        console.log('Final response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API error details:`, {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries())
          });
          
          if (response.status === 400) {
            throw new Error(`Неверный формат данных: ${errorText}`);
          } else if (response.status === 401) {
            throw new Error(`Ошибка авторизации: проверьте API ключ`);
          } else if (response.status === 403) {
            throw new Error(`Доступ запрещен: проверьте права доступа`);
          } else if (response.status === 500) {
            throw new Error(`Ошибка сервера: ${errorText}`);
          } else {
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
          }
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);

        this.lastSync = syncData.lastUpdated;
        console.log('Sync completed successfully');
      } catch (error) {
        console.error("Подробная ошибка при отправке данных:", error);
        
        if (error instanceof Error) {
          this.error = `Детальная ошибка: ${error.message}`;
        } else {
          this.error = `Неизвестная ошибка при синхронизации: ${String(error)}`;
        }
        
        throw error;
      }
    },

    async deleteSession(): Promise<void> {
      if (!this.sessionId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/sync/${this.sessionId}`, {
          method: 'DELETE',
          headers: this.getApiHeaders(),
        });

        if (response.ok || response.status === 404) {
          this.resetSync();
        } else {
          throw new Error(`Ошибка при удалении сессии: ${response.status}`);
        }
      } catch (error) {
        console.error("Ошибка при удалении сессии:", error);
        this.error = "Ошибка при удалении сессии";
      }
    },

    resetSync(): void {
      this.disableSync();
      this.sessionId = uuidv4();
      localStorage.setItem("clean-day-session-id", this.sessionId);
      this.lastSync = 0;
      this.qrCodeDataUrl = "";
      this.error = null;
    },
  },
});