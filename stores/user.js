import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    quitDate: null, 
    cigarettesPerDay: 20, 
    cigarettePrice: 5.50, 
    cigarettesInPack: 20, 
    
    notifications: true, 
    achievementNotifications: true, 
    darkMode: false, 
    
    initialized: false,
  }),
  
  getters: {
    timeElapsed: (state) => {
      if (!state.quitDate) return 0;
      return Date.now() - new Date(state.quitDate).getTime();
    },
    
    timeSinceQuit: (state) => {
      if (!state.quitDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      
      const totalSeconds = Math.floor(state.timeElapsed / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return { days, hours, minutes, seconds };
    },
    
    cigarettesNotSmoked: (state) => {
      if (!state.quitDate) return 0;
      const days = state.timeElapsed / (1000 * 60 * 60 * 24);
      return Math.floor(days * state.cigarettesPerDay);
    },
    
    moneySaved: (state) => {
      const cigarettesNotSmoked = state.cigarettesNotSmoked;
      const packsNotBought = cigarettesNotSmoked / state.cigarettesInPack;
      return Math.floor(packsNotBought * state.cigarettePrice);
    },
    
    hasQuit: (state) => {
      return !!state.quitDate;
    },
  },
  
  actions: {
    initialize() {
      if (process.client) {
        const savedState = localStorage.getItem('clean-day-user');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          this.$patch(parsedState);
        }
        this.initialized = true;
      }
    },
    
    saveState() {
      if (process.client) {
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
    
    setQuitDate(date) {
      this.quitDate = date;
      this.saveState();
    },
    
    resetProgress() {
      this.quitDate = null;
      this.saveState();
    },
    
    updateSmokingSettings(settings) {
      this.cigarettesPerDay = settings.cigarettesPerDay;
      this.cigarettePrice = settings.cigarettePrice;
      this.cigarettesInPack = settings.cigarettesInPack;
      this.saveState();
    },
    
    updateAppSettings(settings) {
      this.notifications = settings.notifications;
      this.achievementNotifications = settings.achievementNotifications;
      this.darkMode = settings.darkMode;
      this.saveState();
    },
  },
});