<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';

onMounted(async () => {
  if (process.client && typeof window !== 'undefined') {
    await nextTick();
    try {
      const userStore = useUserStore();
      userStore.initialize();
    } catch (error) {
      console.error('Error initializing user store in app.vue:', error);
    }
  }
});
</script>