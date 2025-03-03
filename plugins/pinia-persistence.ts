export default defineNuxtPlugin(async (nuxtApp) => {
  if (typeof window !== 'undefined') {
    nuxtApp.hook('app:mounted', async () => {
      try {
        const userModule = await import('~/stores/user');
        const userStore = userModule.useUserStore();
        userStore.initialize();

        const achievementsModule = await import('~/stores/achievements');
        const achievementsStore = achievementsModule.useAchievementsStore();
        achievementsStore.initialize();
        achievementsStore.checkAchievements();
      } catch (error) {
        console.error('Error initializing stores:', error);
      }
    });
  }
});