<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col transition-colors duration-300">
        <UNotifications />

        <nav class="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-xl text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
            <div class="container mx-auto flex justify-between items-center">
                <NuxtLink to="/" class="flex items-center">
                    <span class="font-bold text-lg">Clean Day</span>
                </NuxtLink>

                <div class="hidden md:flex space-x-4">
                    <NuxtLink to="/" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors">Главная</NuxtLink>
                    <!-- <NuxtLink to="/statistics" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors">Статистика</NuxtLink> -->
                    <NuxtLink to="/achievements" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors">Достижения</NuxtLink>
                    <NuxtLink to="/settings" class="px-3 py-2 rounded hover:bg-gray-700 transition-colors">Настройки</NuxtLink>
                </div>

                <button class="md:hidden px-2 py-1 rounded bg-gray-700 transition-colors hover:bg-gray-600" @click="toggleMobileMenu">
                    <span v-if="!mobileMenuOpen">Меню</span>
                    <span v-else>Закрыть</span>
                </button>
            </div>
        </nav>

        <Transition name="slide-fade">
            <div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 text-white fixed top-14 left-0 right-0 z-40 shadow-lg">
                <div class="container mx-auto py-2">
                    <div class="flex flex-col space-y-2 px-4 py-2">
                        <NuxtLink to="/" @click="closeMobileMenu" class="px-3 py-2 rounded hover:bg-gray-800 transition-colors">Главная</NuxtLink>
                        <!-- <NuxtLink to="/statistics" @click="closeMobileMenu" class="px-3 py-2 rounded hover:bg-gray-800 transition-colors">Статистика</NuxtLink> -->
                        <NuxtLink to="/achievements" @click="closeMobileMenu" class="px-3 py-2 rounded hover:bg-gray-800 transition-colors">Достижения</NuxtLink>
                        <NuxtLink to="/settings" @click="closeMobileMenu" class="px-3 py-2 rounded hover:bg-gray-800 transition-colors">Настройки</NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>

        <main class="container mx-auto px-4 py-6 flex-grow">
            <div class="w-full max-w-5xl mx-auto">
                <slot />
            </div>
        </main>

        <footer class="mt-auto bg-gray-200 dark:bg-gray-900 py-4 border-t border-gray-300 dark:border-gray-800">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-0">
                        Clean Day — одна привычка минус, тысяча возможностей плюс
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                        <span class="typing-text" ref="typingTextElement">
                            <span>made with ❤️ from </span>
                            <a href="https://github.com/devw1z4rd" target="_blank" rel="noopener noreferrer"
                                class="text-primary-600 dark:text-primary-400 hover:underline transition-colors">
                                devw1z4rd
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const mobileMenuOpen = ref(false);
const typingTextElement = ref(null);
const isTyping = ref(false);

const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (theme === 'light') {
    document.documentElement.classList.remove('dark');
  } else if (theme === 'system') {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
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

const startTypingAnimation = async () => {
    if (isTyping.value || !typingTextElement.value) return;

    isTyping.value = true;
    const textElement = typingTextElement.value;
    const originalText = textElement.innerHTML;

    textElement.innerHTML = '';
    textElement.classList.add('typing');

    await new Promise(resolve => setTimeout(resolve, 500));

    textElement.innerHTML = originalText;

    const walker = document.createTreeWalker(
        textElement,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
        if (currentNode.textContent.trim()) {
            textNodes.push({
                node: currentNode,
                text: currentNode.textContent,
            });
            currentNode.textContent = '';
        }
    }

    for (const nodeInfo of textNodes) {
        const { node, text } = nodeInfo;
        for (let i = 0; i <= text.length; i++) {
            const delay = Math.random() * 50 + 30;
            await new Promise(resolve => setTimeout(resolve, delay));

            node.textContent = text.slice(0, i);
        }
    }

    isTyping.value = false;
    textElement.classList.remove('typing');
};

const setupTypingInterval = () => {
    setTimeout(() => {
        startTypingAnimation();

        setInterval(() => {
            startTypingAnimation();
        }, 20000);
    }, 3000);
};

onMounted(() => {
    userStore.initialize();
    
    applyTheme(userStore.theme || 'system');
    
    setupTypingInterval();
});
</script>

<style>
.typing {
    position: relative;
}

.typing::after {
    content: "|";
    position: absolute;
    right: -4px;
    animation: cursor-blink 1s infinite step-end;
}

@keyframes cursor-blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.3s ease;
}

.slide-fade-enter-from {
    transform: translateY(-20px);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}

.transition-colors {
    transition: background-color 0.2s ease, color 0.2s ease;
}
</style>