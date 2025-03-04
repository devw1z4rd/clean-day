export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window === 'undefined' || !process.client) {
    return;
  }

  nuxtApp.hook("app:mounted", async () => {
    setTimeout(async () => {
      try {
        const userModule = await import("~/stores/user");
        const userStore = userModule.useUserStore();
        userStore.initialize();

        const achievementsModule = await import("~/stores/achievements");
        const achievementsStore = achievementsModule.useAchievementsStore();
        achievementsStore.initialize();
        achievementsStore.checkAchievements();
      } catch (error) {
        console.error("Error initializing stores:", error);
      }
    }, 10);
  });
});