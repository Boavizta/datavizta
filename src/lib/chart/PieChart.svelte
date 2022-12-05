<script lang="ts">
  import {onMount} from 'svelte';
  import Chart from 'chart.js/dist/chart.js';
  import {_} from 'svelte-i18n';
  import type { ChartResult } from '../customType';

  export let ratioScope:ChartResult;
  let myChart;

  function getDataFormat() {
    return {
      labels: [$_('pie.legend_scope2', {values:{median:ratioScope.scope2.median}}),
            $_('pie.legend_scope3', {values:{median:ratioScope.scope3.median}})],
      datasets: [
        {
          label: 'Dataset',
          data: [ratioScope.scope2.median, ratioScope.scope3.median],
          backgroundColor: ['#008a8c', '#003964'],
        }
      ]
    }
  }

  let portfolio;
  const config = {
    type: 'pie',
    data: getDataFormat(),
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start',
          fullSize : 'false'
        },
        title: {
          display: false,
          text: ''
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let total = context.dataset.data.reduce((a, b) => a + b);
              let percentage = Math.round(context.raw * 100 / total);
              return `${context.label}: ${percentage}% (${context.raw})`
            }
          }
        }
      },
    }
  };

  onMount(() => {
    const ctx = portfolio.getContext('2d');
    myChart = new Chart(ctx, config);

  })
  export function updatePieChart() {
    updateChart(myChart,ratioScope)
  }
  function updateChart(chart,ratioScope) {
    if (chart != undefined) {
      chart.data = getDataFormat()
      chart.update();
    }
  }

  $: {
    updateChart(myChart,ratioScope)//reactive on ratioScope object
  }
</script>

<canvas bind:this={portfolio} height="{400}" width="95%"/>

