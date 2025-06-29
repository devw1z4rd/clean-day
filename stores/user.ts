import { defineStore } from 'pinia';

interface TimeSinceQuit {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface SmokingSettings {
  cigarettesPerDay: number;
  cigarettePrice: number;
  cigarettesInPack: number;
}

interface AppSettings {
  notifications: boolean;
  achievementNotifications: boolean;
  theme: string; // 'dark', 'light', or 'system'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    quitDate: null as string | null,
    userName: '' as string,
    cigarettesPerDay: 20,
    cigarettePrice: 5.5,
    cigarettesInPack: 20,
    notifications: true,
    achievementNotifications: true,
    theme: 'system' as string, 
    initialized: false,
  }),

  getters: {
    darkMode(): boolean {
      if (this.theme === 'dark') return true;
      if (this.theme === 'light') return false;
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    },

    timeElapsed: (state): number => {
      if (!state.quitDate) return 0;
      const now = typeof window !== 'undefined' ? Date.now() : new Date().getTime();
      return now - new Date(state.quitDate).getTime();
    },

    timeSinceQuit(): TimeSinceQuit {
      if (!this.quitDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const totalSeconds = Math.floor(this.timeElapsed / 1000);
      return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    },

    cigarettesNotSmoked(): number {
      if (!this.quitDate) return 0;
      return Math.floor((this.timeElapsed / (1000 * 60 * 60 * 24)) * this.cigarettesPerDay);
    },

    moneySaved(): string {
      const packsNotBought = this.cigarettesNotSmoked / this.cigarettesInPack;
      const exactAmount = packsNotBought * this.cigarettePrice;
      return exactAmount.toFixed(2);
    },

    hasQuit(): boolean {
      return !!this.quitDate;
    },

    hasUserName(): boolean {
      return !!this.userName && this.userName.trim() !== '';
    }
  },

  actions: {
    initialize() {
      if (typeof window === 'undefined' || !process.client) {
        this.initialized = true;
        return;
      }

      try {
        const savedState = localStorage.getItem('clean-day-user');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          
          if (parsedState.darkMode !== undefined && parsedState.theme === undefined) {
            parsedState.theme = parsedState.darkMode ? 'dark' : 'light';
            delete parsedState.darkMode;
          }
          
          this.$patch(parsedState);
        }
        this.initialized = true;
      } catch (error) {
        console.error('Error initializing user store:', error);
        this.initialized = true;
      }
    },

    saveState() {
      if (typeof window === 'undefined' || !process.client) {
        return;
      }

      try {
        const stateToSave = {
          quitDate: this.quitDate,
          userName: this.userName,
          cigarettesPerDay: this.cigarettesPerDay,
          cigarettePrice: this.cigarettePrice,
          cigarettesInPack: this.cigarettesInPack,
          notifications: this.notifications,
          achievementNotifications: this.achievementNotifications,
          theme: this.theme, 
        };
        localStorage.setItem('clean-day-user', JSON.stringify(stateToSave));
      } catch (error) {
        console.error('Error saving user state:', error);
      }
    },

    setQuitDate(date: string) {
      this.quitDate = date;
      this.saveState();
    },

    resetProgress() {
      this.quitDate = null;
      this.saveState();
    },

    updateSmokingSettings(settings: SmokingSettings) {
      this.cigarettesPerDay = settings.cigarettesPerDay;
      this.cigarettePrice = settings.cigarettePrice;
      this.cigarettesInPack = settings.cigarettesInPack;
      this.saveState();
    },

    updateAppSettings(settings: AppSettings) {
      this.notifications = settings.notifications;
      this.achievementNotifications = settings.achievementNotifications;
      this.theme = settings.theme; 
      this.saveState();
    },

    setUserName(name: string) {
      this.userName = name;
      this.saveState();
    }
  },
});