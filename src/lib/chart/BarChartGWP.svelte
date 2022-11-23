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
      label: 'GWP - USAGE',
      yAxisID: 'GWP',
      data: [result.use],
      backgroundColor: ['#008a8c'],
      borderColor: ['#008a8c'],
      stack: 'stack 0',
      skipNull: true
    },
    {
      label: 'GWP - RAM - MANUF',
      yAxisID: 'GWP',
      data: [result.ram],
      backgroundColor: ['rgb(151, 182, 184)'],
      borderColor: ['rgb(151, 182, 184)'],
      stack: 'stack 0'
    },
    {
      label: 'GWP - CPU - MANUF',
      yAxisID: 'GWP',
      data: [result.cpu],
      backgroundColor: ['rgb(130, 246, 250)'],
      borderColor: ['rgb(130, 246, 250)'],
      stack: 'stack 0'
     },
     {
         label: 'GWP - SSD - MANUF',
         yAxisID: 'GWP',
         data: [result.ssd],
         backgroundColor: ['rgb(203, 246, 247)'],
         borderColor: ['rgb(203, 246, 247)'],
         stack: 'stack 0'
     },
     {
         label: 'GWP - HDD - MANUF',
         yAxisID: 'GWP',
         data: [result.hdd],
         backgroundColor: ['rgb(62, 118, 120)'],
         borderColor: ['rgb(62, 118, 120)'],
         stack: 'stack 0'
     },
     {
         label: 'GWP - OTHER - MANUF',
         yAxisID: 'GWP',
         data: [(result.motherboard + result.power_supply + result.assembly)],
         backgroundColor: ['rgb(161, 182, 183)'],
         borderColor: ['rgb(161, 118, 120)'],
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

<canvas bind:this={portfolio} height="{300}" width="100%"/>

