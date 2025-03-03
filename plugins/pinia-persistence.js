export default defineNuxtPlugin(nuxtApp => {
    if (process.client) {
      nuxtApp.hook('app:mounted', () => {
        try {
          import('~/stores/user').then(module => {
            const userStore = module.useUserStore();
            userStore.initialize();
          });
          
          import('~/stores/achievements').then(module => {
            const achievementsStore = module.useAchievementsStore();
            achievementsStore.initialize();
            achievementsStore.checkAchievements();
          });
        } catch (error) {
          console.error('Error initializing stores:', error);
        }
      });
    }
  });