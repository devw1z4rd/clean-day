<template>
    <div class="min-h-screen bg-[#0d1117] flex flex-col">
        <UNotifications />

        <nav
            class="backdrop-blur-2xl text-gray-200 sticky top-0 z-50 border-b shadow-xl transition-all duration-500 ease-in-out"
            :class="[
                scrolled
                    ? 'bg-[#0d1117]/80 border-[#30363d] py-2 px-4 shadow-2xl'
                    : 'bg-[#0d1117]/60 border-[#30363d]/60 py-3 px-4 shadow-xl'
            ]"
        >
            <div class="container mx-auto flex justify-between items-center transition-all duration-300">
                <NuxtLink to="/" class="flex items-center">
                    <span class="font-bold text-lg text-gray-100 drop-shadow-sm">Clean Day</span>
                </NuxtLink>

                <div class="hidden md:flex space-x-4">
                    <NuxtLink to="/" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200 text-gray-200 backdrop-blur-sm">Главная</NuxtLink>
                    <NuxtLink to="/achievements" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200 text-gray-200 backdrop-blur-sm">Достижения</NuxtLink>
                    <NuxtLink to="/settings" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200 text-gray-200 backdrop-blur-sm">Настройки</NuxtLink>
                </div>

                <button class="md:hidden px-3 py-2 rounded-lg bg-white/[0.06] backdrop-blur-sm transition-all duration-200 hover:bg-white/10 text-gray-200 border border-[#30363d]" @click="toggleMobileMenu">
                    <span v-if="!mobileMenuOpen">Меню</span>
                    <span v-else>Закрыть</span>
                </button>
            </div>
        </nav>

        <Transition name="mobile-slide">
            <div v-if="mobileMenuOpen" class="md:hidden bg-[#161b22] text-gray-200 fixed left-0 right-0 z-40 border-b border-[#30363d]/60 shadow-lg mobile-menu"
                 :style="{ top: scrolled ? '56px' : '64px' }">
                <div class="container mx-auto py-3">
                    <div class="flex flex-col space-y-2 px-4 py-2">
                        <NuxtLink to="/" @click="closeMobileMenu" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200">Главная</NuxtLink>
                        <NuxtLink to="/achievements" @click="closeMobileMenu" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200">Достижения</NuxtLink>
                        <NuxtLink to="/settings" @click="closeMobileMenu" class="px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200">Настройки</NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>

        <main class="container mx-auto px-4 py-6 flex-grow flex flex-col">
            <div class="w-full max-w-5xl mx-auto flex-grow flex flex-col md:justify-center">
                <slot />
            </div>
        </main>

        <footer class="mt-auto bg-[#0d1117] py-4 border-t border-[#30363d]/60">
            <div class="container mx-auto px-4">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <div class="text-sm text-gray-600 mb-2 md:mb-0">
                        Clean Day — одна привычка минус, тысяча возможностей плюс
                    </div>
                    <div class="text-sm text-gray-400 flex items-center">
                        <span class="typing-text" ref="typingTextElement">
                            <span>made with ❤️ from </span>
                            <a href="https://github.com/devw1z4rd" target="_blank" rel="noopener noreferrer"
                                class="text-green-400 hover:underline transition-colors">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const mobileMenuOpen = ref(false);
const typingTextElement = ref(null);
const isTyping = ref(false);
const scrolled = ref(false);

const handleScroll = () => {
    scrolled.value = window.scrollY > 20;
};

const updateMobileMenuPosition = () => {
    if (mobileMenuOpen.value) {
        const navbar = document.querySelector('nav');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (navbar && mobileMenu) {
            const navbarHeight = navbar.offsetHeight;
            mobileMenu.style.top = `${navbarHeight}px`;
        }
    }
};

const applyTheme = () => {
  document.documentElement.classList.add('dark');
};

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
    
    if (mobileMenuOpen.value) {
        document.body.style.overflow = 'hidden';
        nextTick(() => {
            updateMobileMenuPosition();
        });
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
    
    applyTheme();
    
    setupTypingInterval();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    window.addEventListener('resize', updateMobileMenuPosition, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', updateMobileMenuPosition);
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

.mobile-slide-enter-active,
.mobile-slide-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, opacity;
}

.mobile-slide-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.mobile-slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

@media (max-width: 768px) {
    .mobile-menu {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        will-change: transform;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000px;
        perspective: 1000px;
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

nav {
    transform: translateZ(0);
    will-change: background-color, backdrop-filter, padding, box-shadow;
}
</style>