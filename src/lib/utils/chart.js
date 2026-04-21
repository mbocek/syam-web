import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Shared line-chart options used by all calculator charts.
 * `getCurrency` is a thunk so the tooltip reacts to language switches.
 */
export function lineChartOptions(getCurrency, { beginAtZero = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} ${getCurrency()}`
        }
      }
    },
    scales: {
      y: { beginAtZero, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
      x: { grid: { display: false } }
    }
  };
}

/**
 * Render or update a Chart.js line chart on the given canvas.
 * Returns the chart instance (pass it in on subsequent calls to update in place).
 */
export function renderLineChart({ canvas, chart, datasets, labels, options }) {
  const data = { labels, datasets };
  if (chart) {
    chart.data = data;
    chart.update();
    return chart;
  }
  return new Chart(canvas.getContext('2d'), { type: 'line', data, options });
}
