<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
        <UNotifications />

        <nav
            class="bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-xl text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
            <div class="container mx-auto flex justify-between items-center">
                <NuxtLink to="/" class="flex items-center">
                    <span class="text-xl mr-1">✨</span>
                    <span class="font-bold text-lg">Clean Day</span>
                </NuxtLink>

                <div class="hidden md:flex space-x-4">
                    <NuxtLink to="/" class="px-3 py-2 rounded hover:bg-gray-700">Главная</NuxtLink>
                    <NuxtLink to="/statistics" class="px-3 py-2 rounded hover:bg-gray-700">Статистика</NuxtLink>
                    <NuxtLink to="/achievements" class="px-3 py-2 rounded hover:bg-gray-700">Достижения</NuxtLink>
                    <NuxtLink to="/settings" class="px-3 py-2 rounded hover:bg-gray-700">Настройки</NuxtLink>
                </div>

                <button class="md:hidden px-2 py-1 rounded bg-gray-700" @click="mobileMenuOpen = !mobileMenuOpen">
                    Меню
                </button>
            </div>
        </nav>

        <div v-if="mobileMenuOpen" class="md:hidden bg-gray-900 text-white">
            <div class="container mx-auto py-2">
                <div class="flex flex-col space-y-2 px-4 py-2">
                    <NuxtLink to="/" @click="mobileMenuOpen = false" class="px-3 py-2 rounded hover:bg-gray-800">Главная
                    </NuxtLink>
                    <NuxtLink to="/statistics" @click="mobileMenuOpen = false"
                        class="px-3 py-2 rounded hover:bg-gray-800">Статистика</NuxtLink>
                    <NuxtLink to="/achievements" @click="mobileMenuOpen = false"
                        class="px-3 py-2 rounded hover:bg-gray-800">Достижения</NuxtLink>
                    <NuxtLink to="/settings" @click="mobileMenuOpen = false"
                        class="px-3 py-2 rounded hover:bg-gray-800">Настройки</NuxtLink>
                </div>
            </div>
        </div>

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
                                class="text-primary-600 dark:text-primary-400 hover:underline">
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
</style>