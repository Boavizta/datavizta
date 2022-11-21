<script lang="ts">
  import {onMount} from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  import {_} from 'svelte-i18n';
  import type { Impact } from "$lib/customType";
  //import ChartDataLabels from 'chartjs-plugin-datalabels';

  let myChart;
  let portfolio;
  //Chart.register(ChartDataLabels);
  export let result:Impact={
            "manufacture":13000.0,
            "use":39700.0,
            "unit":"MJ"
        }

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
        PE: {
          type: 'linear',
          position: 'left',
          stacked: true
        },
        
    }
    }
  };
  function getDataFormat() {
    return {
    labels: ["PE (MJ)"],
    datasets: [{
      label: 'PE Manuf',
      yAxisID: 'PE',
      data: [result.manufacture],
      backgroundColor: ['#003964'],
      borderColor: ['#003964'],
      stack: 'stack 0',
      skipNull: true
    }, {
      label: 'PE Use',
      yAxisID: 'PE',
      data: [result.use],
      backgroundColor: ['rgb(135, 151, 158)'],
      borderColor: ['rgb(135, 151, 158)'],
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

