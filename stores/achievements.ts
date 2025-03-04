import { defineStore } from 'pinia';
import { useUserStore } from './user';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredDays?: number;
  requiredMoney?: number;
  requiredCigarettes?: number;
  unlocked: boolean;
}

export const useAchievementsStore = defineStore('achievements', {
  state: () => ({
    allAchievements: [
      { id: 'day-1', title: 'Первый день', description: 'Вы продержались без сигарет целый день!', icon: 'mdi-star-circle', requiredDays: 1, unlocked: false },
      { id: 'day-3', title: 'Трехдневный вызов', description: 'Три дня без сигарет - это серьезное достижение!', icon: 'mdi-star-circle-outline', requiredDays: 3, unlocked: false },
      { id: 'week-1', title: 'Неделя чистоты', description: 'Целая неделя без сигарет! Ваше тело уже начинает восстанавливаться.', icon: 'mdi-calendar-week', requiredDays: 7, unlocked: false },
      { id: 'week-2', title: 'Две недели свободы', description: 'Две недели без сигарет. Вы на правильном пути!', icon: 'mdi-calendar-weekend', requiredDays: 14, unlocked: false },
      { id: 'month-1', title: 'Месяц новой жизни', description: 'Целый месяц без сигарет! Ваши легкие благодарят вас.', icon: 'mdi-calendar-month', requiredDays: 30, unlocked: false },
      { id: 'month-3', title: 'Квартал чистого воздуха', description: 'Три месяца без сигарет! Это огромное достижение.', icon: 'mdi-calendar-text', requiredDays: 90, unlocked: false },
      { id: 'half-year', title: 'Полгода свободы', description: '180 дней без сигарет! Вы победили зависимость.', icon: 'mdi-calendar-check', requiredDays: 180, unlocked: false },
      { id: 'year-1', title: 'Годовщина новой жизни', description: 'Целый год без сигарет! Вы вдохновляете всех вокруг!', icon: 'mdi-calendar-star', requiredDays: 365, unlocked: false },
      { id: 'money-100', title: 'Первая сотня', description: 'Вы сэкономили 100 EUR, отказавшись от сигарет!', icon: 'mdi-currency-rub', requiredMoney: 100, unlocked: false },
      { id: 'money-500', title: 'Копилка растет', description: 'Вы сэкономили 500 EUR! Можно себя побаловать чем-то приятным.', icon: 'mdi-piggy-bank', requiredMoney: 500, unlocked: false },
      { id: 'money-1000', title: 'Бюджет здоровья', description: 'Сэкономлено 1000 EUR! Ваш кошелек и здоровье в выигрыше.', icon: 'mdi-cash-multiple', requiredMoney: 1000, unlocked: false },
      { id: 'cigarettes-100', title: '100 непрокуренных сигарет', description: 'Вы не выкурили 100 сигарет! Ваши легкие благодарны.', icon: 'mdi-smoking-off', requiredCigarettes: 100, unlocked: false },
      { id: 'cigarettes-500', title: '500 сигарет в прошлом', description: 'Вы не выкурили 500 сигарет! Это серьезное достижение.', icon: 'mdi-lungs', requiredCigarettes: 500, unlocked: false },
      { id: 'cigarettes-1000', title: 'Тысяча спасенных вдохов', description: 'Вы избежали 1000 сигарет! Представьте, как это отразилось на вашем здоровье.', icon: 'mdi-heart-pulse', requiredCigarettes: 1000, unlocked: false },
    ] as Achievement[],

    newAchievement: null as Achievement | null,
    unlockedAchievements: [] as string[],
  }),

  getters: {
    achievements(state): Achievement[] {
      return state.allAchievements.map(achievement => ({
        ...achievement,
        unlocked: state.unlockedAchievements.includes(achievement.id),
      }));
    },

    unlockedCount(state): number {
      return state.unlockedAchievements.length;
    },

    achievementProgress(state): number {
      return Math.round((state.unlockedAchievements.length / state.allAchievements.length) * 100);
    },

    hasNewAchievement(state): boolean {
      return state.newAchievement !== null;
    },
  },

  actions: {
    initialize() {
      if (typeof window === 'undefined' || !process.client) {
        return;
      }

      try {
        const savedAchievements = localStorage.getItem('clean-day-achievements');
        if (savedAchievements) {
          this.unlockedAchievements = JSON.parse(savedAchievements);
        }
      } catch (error) {
        console.error('Error initializing achievements store:', error);
      }
    },

    saveAchievements() {
      if (typeof window === 'undefined' || !process.client) {
        return;
      }

      try {
        localStorage.setItem('clean-day-achievements', JSON.stringify(this.unlockedAchievements));
      } catch (error) {
        console.error('Error saving achievements:', error);
      }
    },

    checkAchievements() {
      if (typeof window === 'undefined' || !process.client) return;

      const userStore = useUserStore();
      if (!userStore.quitDate) return;
      
      const days = userStore.timeSinceQuit.days;
      const money = userStore.moneySaved;
      const cigarettes = userStore.cigarettesNotSmoked;
      let newlyUnlocked = false;

      this.allAchievements.forEach(achievement => {
        if (this.unlockedAchievements.includes(achievement.id)) return;

        if ((achievement.requiredDays && days >= achievement.requiredDays) ||
            (achievement.requiredMoney && money >= achievement.requiredMoney) ||
            (achievement.requiredCigarettes && cigarettes >= achievement.requiredCigarettes)) {
          this.unlockAchievement(achievement.id);
          newlyUnlocked = true;
        }
      });

      if (newlyUnlocked) {
        this.saveAchievements();
      }
    },

    unlockAchievement(id: string) {
      if (!this.unlockedAchievements.includes(id)) {
        this.unlockedAchievements.push(id);
        const achievement = this.allAchievements.find(a => a.id === id);
        if (achievement) {
          this.newAchievement = { ...achievement, unlocked: true };
        }
      }
    },

    acknowledgeNewAchievement() {
      this.newAchievement = null;
    },
  },
});