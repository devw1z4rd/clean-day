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
  darkMode: boolean;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    quitDate: null as string | null,
    cigarettesPerDay: 20,
    cigarettePrice: 5.5,
    cigarettesInPack: 20,
    notifications: true,
    achievementNotifications: true,
    darkMode: true,
    initialized: false,
  }),

  getters: {
    timeElapsed: (state): number => {
      if (!state.quitDate) return 0;
      return Date.now() - new Date(state.quitDate).getTime();
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

    moneySaved(): number {
      const packsNotBought = this.cigarettesNotSmoked / this.cigarettesInPack;
      return Math.floor(packsNotBought * this.cigarettePrice);
    },

    hasQuit(): boolean {
      return !!this.quitDate;
    },
  },

  actions: {
    initialize() {
      if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('clean-day-user');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          this.$patch(parsedState);
        }
        this.initialized = true;
      }
    },

    saveState() {
      if (typeof window !== 'undefined') {
        const stateToSave = {
          quitDate: this.quitDate,
          cigarettesPerDay: this.cigarettesPerDay,
          cigarettePrice: this.cigarettePrice,
          cigarettesInPack: this.cigarettesInPack,
          notifications: this.notifications,
          achievementNotifications: this.achievementNotifications,
          darkMode: this.darkMode,
        };
        localStorage.setItem('clean-day-user', JSON.stringify(stateToSave));
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
      this.darkMode = settings.darkMode;
      this.saveState();
    },
  },
});
