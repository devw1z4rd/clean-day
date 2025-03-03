<template>
  <div class="achievement-modal">
    <div class="achievement-modal-content" :class="{ 'show': show }">
      <div class="achievement-header">
        <h2>🏆 Новое достижение! 🏆</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>
      
      <div class="achievement-body">
        <div class="achievement-icon">
          <span class="icon">{{ getEmojiForIcon(achievement?.icon) }}</span>
        </div>
        <div class="achievement-info">
          <h3 class="achievement-title">{{ achievement?.title }}</h3>
          <p class="achievement-description">{{ achievement?.description }}</p>
        </div>
      </div>
      
      <div class="achievement-footer">
        <button @click="closeModal" class="btn btn-primary">Замечательно!</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  achievement: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close']);

const show = ref(false);

const getEmojiForIcon = (iconName) => {
  const iconMap = {
    'mdi-star-circle': '🌟',
    'mdi-star-circle-outline': '⭐',
    'mdi-calendar-week': '📅',
    'mdi-calendar-weekend': '📆',
    'mdi-calendar-month': '📆',
    'mdi-calendar-text': '📅',
    'mdi-calendar-check': '✅',
    'mdi-calendar-star': '🌟',
    'mdi-currency-rub': '💰',
    'mdi-piggy-bank': '🐖',
    'mdi-cash-multiple': '💵',
    'mdi-smoking-off': '🚭',
    'mdi-lungs': '🫁',
    'mdi-heart-pulse': '💓',
  };
  
  return iconMap[iconName] || '🏆';
};

const closeModal = () => {
  show.value = false;
  
  setTimeout(() => {
    emit('close');
  }, 300);
};

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 100);
  
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  
  window.addEventListener('keydown', handleEscape);
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style scoped>
.achievement-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.achievement-modal-content {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  width: 90%;
  max-width: 550px;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.achievement-modal-content.show {
  opacity: 1;
  transform: scale(1);
}

.achievement-header {
  background-image: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: white;
  padding: 1.5rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  border-radius: 50%;
}

.close-button:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.15);
}

.achievement-body {
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.achievement-icon {
  flex-shrink: 0;
  width: 75px;
  height: 75px;
  background-color: rgba(91, 140, 90, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.4rem;
  color: var(--primary-color);
  font-weight: 600;
}

.achievement-description {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  line-height: 1.5;
}

.achievement-footer {
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.achievement-footer .btn {
  min-width: 200px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 50px;
  font-size: 1rem;
}

@media (max-width: 480px) {
  .achievement-body {
    flex-direction: column;
    text-align: center;
  }
  
  .achievement-icon {
    margin-bottom: 1rem;
  }
  
  .achievement-modal-content {
    width: 95%;
  }
  
  .achievement-header {
    padding: 1.25rem;
  }
  
  .achievement-body {
    padding: 1.5rem;
  }
  
  .achievement-footer .btn {
    width: 100%;
  }
}
</style>