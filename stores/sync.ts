import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useAchievementsStore } from "./achievements";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

interface SyncData {
  user: any;
  achievements: any;
  lastUpdated: number;
}

export const useSyncStore = defineStore("sync", {
  state: () => ({
    sessionId: "",
    isInitialized: false,
    lastSync: 0,
    isSyncing: false,
    qrCodeDataUrl: "",
    syncEnabled: false,
    autoSyncInterval: null as NodeJS.Timeout | null,
    error: null as string | null,
    configValid: false,
    diagnostics: null as string | null,
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
    async diagnoseConnection() {
      try {
        this.diagnostics = `Проверка подключения к Supabase...
URL: ${SUPABASE_URL ? SUPABASE_URL.substring(0, 15) + "..." : "не задан"}
KEY: ${
          SUPABASE_KEY
            ? "задан (длина: " + SUPABASE_KEY.length + ")"
            : "не задан"
        }`;

        if (!SUPABASE_URL || !SUPABASE_KEY) {
          this.configValid = false;
          this.error =
            "Не заданы переменные окружения VITE_SUPABASE_URL или VITE_SUPABASE_KEY";
          return false;
        }

        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/sessions?limit=1`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          this.configValid = false;
          this.error = `Ошибка подключения к Supabase: ${response.status} ${response.statusText}`;
          this.diagnostics += `\nОтвет API: ${errorText}`;
          return false;
        }

        this.configValid = true;
        this.error = null;
        this.diagnostics = "Подключение к Supabase успешно установлено";
        return true;
      } catch (error) {
        this.configValid = false;
        this.error = `Ошибка при проверке подключения: ${
          (error as Error).message
        }`;
        if (error instanceof Error) {
          this.diagnostics += `\nИсключение: ${error.message}`;
        }
        return false;
      }
    },

    async initialize() {
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
          this.syncEnabled =
            localStorage.getItem("clean-day-sync-enabled") === "true";

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

    async generateQRCode() {
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

    async enableSync() {
      if (!this.configValid) {
        await this.diagnoseConnection();
        if (!this.configValid) {
          this.error =
            "Невозможно включить синхронизацию: проблема с подключением к базе данных";
          return;
        }
      }

      this.syncEnabled = true;
      localStorage.setItem("clean-day-sync-enabled", "true");
      await this.generateQRCode();
      await this.pushData();
      this.startAutoSync();
    },

    disableSync() {
      this.syncEnabled = false;
      localStorage.setItem("clean-day-sync-enabled", "false");

      if (this.autoSyncInterval) {
        clearInterval(this.autoSyncInterval);
        this.autoSyncInterval = null;
      }
    },

    startAutoSync() {
      if (this.autoSyncInterval) clearInterval(this.autoSyncInterval);

      this.autoSyncInterval = setInterval(() => {
        this.syncData();
      }, 5 * 60 * 1000);
    },

    async joinSession(sessionId: string) {
      if (!this.configValid) {
        await this.diagnoseConnection();
        if (!this.configValid) {
          this.error =
            "Невозможно подключиться к сессии: проблема с подключением к базе данных";
          return false;
        }
      }

      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/sessions?id=eq.${sessionId}`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const data = await response.json();
        if (!data || data.length === 0) {
          this.error = "Сессия не найдена";
          return false;
        }

        this.sessionId = sessionId;
        localStorage.setItem("clean-day-session-id", sessionId);

        this.syncEnabled = true;
        localStorage.setItem("clean-day-sync-enabled", "true");

        await this.fetchData();

        this.startAutoSync();

        return true;
      } catch (error) {
        console.error("Ошибка при подключении к сессии:", error);
        this.error = "Ошибка при подключении к сессии";
        return false;
      }
    },

    async processUrlParams() {
      if (typeof window === "undefined") return;

      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get("session");

      if (sessionParam) {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
        await this.joinSession(sessionParam);
      }
    },

    async syncData() {
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

    async fetchData() {
      if (!this.syncEnabled || !this.sessionId) return;

      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/sessions?id=eq.${this.sessionId}`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const data = await response.json();
        if (!data || data.length === 0) return;

        const syncData = data[0].data as SyncData;
        const userStore = useUserStore();
        const achievementsStore = useAchievementsStore();

        if (syncData.lastUpdated > this.lastSync) {
          if (syncData.user) {
            userStore.$patch(syncData.user);
            userStore.saveState();
          }

          if (syncData.achievements) {
            achievementsStore.unlockedAchievements = syncData.achievements;
            achievementsStore.saveAchievements();
          }

          this.lastSync = syncData.lastUpdated;
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        throw error;
      }
    },

    async pushData() {
      if (!this.syncEnabled || !this.sessionId) return;

      try {
        const userStore = useUserStore();
        const achievementsStore = useAchievementsStore();

        const syncData: SyncData = {
          user: {
            quitDate: userStore.quitDate,
            cigarettesPerDay: userStore.cigarettesPerDay,
            cigarettePrice: userStore.cigarettePrice,
            cigarettesInPack: userStore.cigarettesInPack,
            notifications: userStore.notifications,
            achievementNotifications: userStore.achievementNotifications,
            darkMode: userStore.darkMode,
          },
          achievements: achievementsStore.unlockedAchievements,
          lastUpdated: Date.now(),
        };

        const checkResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/sessions?id=eq.${this.sessionId}`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const existingData = await checkResponse.json();

        if (existingData && existingData.length > 0) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/sessions?id=eq.${this.sessionId}`,
            {
              method: "PATCH",
              headers: {
                apikey: SUPABASE_KEY,
                Authorization: `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
              body: JSON.stringify({
                data: syncData,
              }),
            }
          );
        } else {
          await fetch(`${SUPABASE_URL}/rest/v1/sessions`, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              id: this.sessionId,
              data: syncData,
            }),
          });
        }

        this.lastSync = syncData.lastUpdated;
      } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        throw error;
      }
    },

    resetSync() {
      this.disableSync();
      this.sessionId = uuidv4();
      localStorage.setItem("clean-day-session-id", this.sessionId);
      this.lastSync = 0;
      this.qrCodeDataUrl = "";
      this.error = null;
    },
  },
});
