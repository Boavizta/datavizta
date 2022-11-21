<script lang="ts">
  import {onMount} from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  import {_} from 'svelte-i18n';
  import type { Impact } from "$lib/customType";
  //import ChartDataLabels from 'chartjs-plugin-datalabels';

  let myChart;
  let portfolio;
  //Chart.register(ChartDataLabels);
  export let result:Impact;

  const config = {
    type: 'bar',
    data: getDataFormat(),
    //plugins: [ChartDataLabels],
    options: {
      plugins: {
        datalabels: {
          anchor: 'start',
          align: 'start',
          offset: 10
      }
      },
      scales: {
        GWP: {
          type: 'linear',
          position: 'left',
          stacked: true
        },
        
    }
    }
  };
  function getDataFormat() {
    return {
      labels: ["GWP (kgCO2eq)"],
    datasets: [{
      label: 'GWP Manuf',
      yAxisID: 'GWP',
      data: [result.manufacture],
      backgroundColor: ['#008a8c'],
      borderColor: ['#008a8c'],
      stack: 'stack 0',
      skipNull: true
    }, {
      label: 'GWP Use',
      yAxisID: 'GWP',
      data: [result.use],
      backgroundColor: ['rgb(150, 182, 183)'],
      borderColor: ['rgb(150, 182, 183)'],
      stack: 'stack 0'
    }]
    }
  }
  onMount(() => {
    const ctx = portfolio.getContext('2d');
    myChart = new Chart(ctx, config);

  })
  export function updateBarChart() {
    updateChart(myChart,result)
  }
  function updateChart(chart,result) {
    if (chart != undefined) {
      chart.data = getDataFormat()
      chart.update();
    }
  }

  $: {
    updateChart(myChart,result)//reactive on ratioScope object
  }
</script>

<canvas bind:this={portfolio} height="{200}" width="100%"/>

