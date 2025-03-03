<template>
  <UCard class="mb-8" :ui="{ 
    ring: '', 
    divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    body: { base: 'p-6' },
    header: { padding: 'px-6 py-5' }
  }" 
    :class="{
      'border-t-4 border-t-primary-500': type === 'money',
      'border-t-4 border-t-blue-500': type === 'cigarettes',
      'border-t-4 border-t-orange-500': type === 'health'
    }">
    <template #header>
      <h2 class="text-xl font-semibold text-center" 
        :class="{
          'text-primary-600': type === 'money',
          'text-blue-600': type === 'cigarettes',
          'text-orange-600': type === 'health'
        }">
        {{ title }}
      </h2>
    </template>

    <canvas ref="chartCanvas" class="w-full max-h-96"></canvas>
  </UCard>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useUserStore } from '~/stores/user';

const props = defineProps({
  title: {
    type: String,
    default: 'Прогресс'
  },
  type: {
    type: String,
    default: 'money',
    validator: (value) => ['money', 'cigarettes', 'health'].includes(value)
  },
  days: {
    type: Number,
    default: 30
  }
});

const userStore = useUserStore();
const chartCanvas = ref(null);
let chart = null;

const getChartColors = () => {
  const colors = {
    money: {
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      borderColor: 'rgba(76, 175, 80, 1)',
    },
    cigarettes: {
      backgroundColor: 'rgba(33, 150, 243, 0.15)',
      borderColor: 'rgba(33, 150, 243, 1)',
    },
    health: {
      backgroundColor: 'rgba(255, 152, 0, 0.15)',
      borderColor: 'rgba(255, 152, 0, 1)',
    },
  };

  return colors[props.type];
};

const updateChart = async () => {
  if (typeof window === 'undefined' || !userStore.hasQuit || !chartCanvas.value) return;

  try {
    const { default: Chart } = await import('chart.js/auto');
    
    const ctx = chartCanvas.value.getContext('2d');
    
    const labels = [];
    const data = [];
    
    const currentDate = new Date();
    
    const quitDate = new Date(userStore.quitDate);
    const startDate = new Date(Math.max(
      quitDate.getTime(),
      currentDate.getTime() - (props.days * 24 * 60 * 60 * 1000)
    ));
    
    for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
      const daysSinceQuit = Math.floor((d - quitDate) / (24 * 60 * 60 * 1000));
      
      if (daysSinceQuit < 0) continue;
      
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      labels.push(`${day}.${month}`);
      
      let value = 0;
      
      if (props.type === 'money') {
        value = Math.floor((userStore.cigarettesPerDay * daysSinceQuit / userStore.cigarettesInPack) * userStore.cigarettePrice);
      } else if (props.type === 'cigarettes') {
        value = Math.floor(userStore.cigarettesPerDay * daysSinceQuit);
      } else if (props.type === 'health') {
        const maxDays = 365;
        value = Math.min(100, Math.floor((daysSinceQuit / maxDays) * 100));
      }
      
      data.push(value);
    }
    
    const chartSettings = {
      money: {
        label: 'Сэкономлено денег (EUR)',
        yAxisLabel: 'EUR'
      },
      cigarettes: {
        label: 'Непокуренные сигареты',
        yAxisLabel: 'Количество сигарет'
      },
      health: {
        label: 'Улучшение здоровья (%)',
        yAxisLabel: 'Процент (%)'
      }
    };
    
    const settings = chartSettings[props.type];
    const colors = getChartColors();
    
    if (chart) {
      chart.destroy();
    }
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: settings.label,
          data: data,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.borderColor,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                family: 'Inter, Roboto, system-ui, sans-serif',
                size: 12
              },
              padding: 20
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: colors.borderColor,
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            titleFont: {
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                family: 'Inter, Roboto, system-ui, sans-serif',
                size: 11
              },
              padding: 10
            },
            title: {
              display: true,
              text: settings.yAxisLabel,
              font: {
                size: 12,
                weight: '500'
              },
              padding: {
                bottom: 10
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                family: 'Inter, Roboto, system-ui, sans-serif',
                size: 11
              },
              padding: 10
            },
            title: {
              display: true,
              text: 'Дата',
              font: {
                size: 12,
                weight: '500'
              },
              padding: {
                top: 10
              }
            }
          }
        },
        elements: {
          line: {
            borderJoinStyle: 'round'
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
  } catch (error) {
    console.error('Ошибка при создании графика:', error);
  }
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    updateChart();
    
    const interval = setInterval(() => {
      updateChart();
    }, 24 * 60 * 60 * 1000);
    
    onUnmounted(() => {
      clearInterval(interval);
      if (chart) {
        chart.destroy();
      }
    });
  }
});

watch(() => [
  userStore.quitDate,
  userStore.cigarettesPerDay,
  userStore.cigarettePrice,
  userStore.cigarettesInPack
], () => {
  updateChart();
}, { deep: true });

watch(() => [props.type, props.days], () => {
  updateChart();
}, { deep: true });
</script>