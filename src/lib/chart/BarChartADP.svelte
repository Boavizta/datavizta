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
        ADP: {
          type: 'logarithmic',
          position: 'left',
          stacked: true
        },
        
    }
    }
  };
  function getDataFormat() {
  return {
    labels: ["ADP (kgSbeq)"],
    datasets: [{
      label: 'ADP Manuf',
      yAxisID: 'ADP',
      data: [result.manufacture],
      backgroundColor: ['rgb(124, 193, 172)'],
      borderColor: ['rgb(124, 193, 172)'],
      stack: 'stack 0'
    }, {
      label: 'ADP Use',
      yAxisID: 'ADP',
      data: [result.use],
      backgroundColor: ['rgb(185, 207, 199)'],
      borderColor: ['rgb(185, 207, 199)'],
      stack: 'stack 0'
    }]
  };
}
  onMount(() => {
    const ctx = portfolio.getContext('2d');
    myChart = new Chart(ctx, config);

  })
</script>

<canvas bind:this={portfolio} height="{200}" width="100%"/>

