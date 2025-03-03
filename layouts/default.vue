<template>
  <div class="layout">
    <header class="header">
      <div class="container header-container">
        <h1 class="logo">
          <span class="logo-icon">✨</span>
          Clean Day
        </h1>
        
        <button class="menu-toggle" @click="toggleMobileMenu" aria-label="Toggle Menu">
          <span class="hamburger" :class="{ 'is-active': mobileMenuOpen }"></span>
        </button>
        
        <nav class="nav" :class="{ 'nav-mobile-open': mobileMenuOpen }">
          <NuxtLink to="/" class="nav-link" @click="closeMobileMenu">
            <span>Главная</span>
          </NuxtLink>
          <NuxtLink to="/statistics" class="nav-link" @click="closeMobileMenu">
            <span>Статистика</span>
          </NuxtLink>
          <NuxtLink to="/achievements" class="nav-link" @click="closeMobileMenu">
            <span>Достижения</span>
            <span v-if="achievementsStore.unreadAchievementsCount" class="badge">
              {{ achievementsStore.unreadAchievementsCount }}
            </span>
          </NuxtLink>
          <NuxtLink to="/settings" class="nav-link" @click="closeMobileMenu">
            <span>Настройки</span>
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main container">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
    
    <div 
      v-if="mobileMenuOpen" 
      class="mobile-menu-overlay"
      @click="closeMobileMenu"
    ></div>
    
    <ClientOnly>
      <Transition name="fade">
        <AchievementModal 
          v-if="showModal" 
          :achievement="currentAchievement" 
          @close="closeModal" 
        />
      </Transition>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAchievementsStore } from '~/stores/achievements';
import { useRoute } from 'vue-router';

const achievementsStore = useAchievementsStore();
const route = useRoute();
const mobileMenuOpen = ref(false);

const showModal = computed(() => achievementsStore.hasNewAchievement);
const currentAchievement = computed(() => achievementsStore.newAchievement);

watch(() => route.path, () => {
  closeMobileMenu();
});

const closeModal = () => {
  achievementsStore.acknowledgeNewAchievement();
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
  document.body.style.overflow = '';
};

const handleResize = () => {
  if (window.innerWidth > 768 && mobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && mobileMenuOpen.value) {
    closeMobileMenu();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
}

.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  transition: transform var(--transition);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  margin-right: 0.5rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  opacity: 0.9;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  position: relative;
}

.nav-link:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

.badge {
  position: absolute;
  top: -8px;
  right: -5px;
  background-color: var(--secondary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0 2px;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger {
  display: block;
  position: relative;
  width: 24px;
  height: 2px;
  background-color: white;
  transition: all var(--transition);
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: white;
  transition: all var(--transition);
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.is-active {
  background-color: transparent;
}

.hamburger.is-active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.content-wrapper {
  width: 100%;
}

.mobile-menu-overlay {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-container {
    position: relative;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 75%;
    max-width: 300px;
    background-color: var(--primary-color);
    flex-direction: column;
    padding: 5rem 1.5rem 2rem;
    transform: translateX(100%);
    transition: transform var(--transition);
    z-index: 100;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    gap: 1rem;
    overflow-y: auto;
  }
  
  .nav-mobile-open {
    transform: translateX(0);
  }
  
  .nav-link {
    padding: 0.75rem;
    width: 100%;
  }
  
  .nav-link.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .mobile-menu-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
  
  .main {
    padding: 1.5rem 0;
  }
}

@media (max-width: 576px) {
  .logo {
    font-size: 1.5rem;
  }
  
  .menu-toggle {
    padding: 0.4rem;
  }
  
  .nav {
    width: 85%;
    padding: 5rem 1rem 2rem;
  }
  
  .main {
    padding: 1rem 0;
  }
}

@media (prefers-color-scheme: dark) {
  .header {
    background-color: var(--primary-dark);
  }
}
</style>