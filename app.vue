<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.initialize();
});
</script>