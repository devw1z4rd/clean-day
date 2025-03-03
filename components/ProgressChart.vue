<template>
  <div class="chart-container card">
    <h2 class="chart-title">{{ title }}</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
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

const updateChart = async () => {
  if (!process.client || !userStore.hasQuit || !chartCanvas.value) return;

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
        backgroundColor: 'rgba(91, 140, 90, 0.15)',
        borderColor: 'rgba(91, 140, 90, 1)',
        yAxisLabel: 'EUR'
      },
      cigarettes: {
        label: 'Непокуренные сигареты',
        backgroundColor: 'rgba(74, 111, 165, 0.15)',
        borderColor: 'rgba(74, 111, 165, 1)',
        yAxisLabel: 'Количество сигарет'
      },
      health: {
        label: 'Улучшение здоровья (%)',
        backgroundColor: 'rgba(249, 136, 102, 0.15)',
        borderColor: 'rgba(249, 136, 102, 1)',
        yAxisLabel: 'Процент (%)'
      }
    };
    
    const settings = chartSettings[props.type];
    
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
          backgroundColor: settings.backgroundColor,
          borderColor: settings.borderColor,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: settings.borderColor,
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
                family: 'Inter, Roboto, sans-serif',
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
            borderColor: settings.borderColor,
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            titleFont: {
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              title: function(tooltipItems) {
                return tooltipItems[0].label;
              }
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
                family: 'Inter, Roboto, sans-serif',
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
                family: 'Inter, Roboto, sans-serif',
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
  if (process.client) {
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

<style scoped>
.chart-container {
  padding: 1.75rem;
  margin-bottom: 2.5rem;
  border-radius: var(--border-radius);
  background-color: var(--card-bg);
  border-top: 4px solid var(--primary-color);
}

.chart-container:nth-of-type(2) {
  border-top-color: var(--secondary-color);
}

.chart-container:nth-of-type(3) {
  border-top-color: var(--accent-color);
}

.chart-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.chart-container:nth-of-type(2) .chart-title {
  color: var(--secondary-color);
}

.chart-container:nth-of-type(3) .chart-title {
  color: var(--accent-color);
}

canvas {
  width: 100% !important;
  height: auto !important;
  max-height: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 1.25rem;
  }
  
  .chart-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .chart-title {
    margin-bottom: 1rem;
  }
}
</style>