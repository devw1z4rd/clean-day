export default defineNuxtPlugin((nuxtApp) => {
  // Server-side handling
  if (process.server) {
    // No initialization needed during SSR
    // This avoids the "Cannot read properties of undefined (reading '_s')" error
    return;
  }
  
  // Client-side initialization with persistence
  if (process.client) {
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