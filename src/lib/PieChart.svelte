<script lang="ts">
  import {onMount} from 'svelte';
  import Chart from 'chart.js/auto/auto.js';

  export let ratioScope;
  let myChart;

  function getDataFormat(ratioScope) {
    return {
      labels: ['Scope 2 : Phase d\'utilisation', 'Scope 3 : Phases de fabrication, transport et fin de vie'],
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
    data: getDataFormat(ratioScope),
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'top',
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

  function updateChart(chart, ratioScope) {
    if (chart != undefined) {
      chart.data = getDataFormat(ratioScope)
      chart.update();
    }
  }

  $: {
    updateChart(myChart, ratioScope)//reactive on ratioScope object
  }
</script>

<canvas bind:this={portfolio} height="{400}" width="{400}"/>
  
