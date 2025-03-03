<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.initialize();
});
</script>

<style>
:root {
  --primary-color: #4CAF50;
  --secondary-color: #2196F3;
  --warning-color: #FF9800;
  --danger-color: #F44336;
  --text-color: #333;
  --background-color: #f5f5f5;
  --card-bg: white;
  --success-color: #8BC34A;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', 'Arial', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.card {
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #3d8b40;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}
</style>