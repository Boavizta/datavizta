<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';

  export let ratioScope;
  let myChart;

  $: {
      updateChart(myChart, ratioScope)//reactive on ratioScope object
  }

  function updateChart(chart, ratioScope) {
      if(chart != undefined){
          chart.data= getDataFormat(ratioScope)
          chart.update();
      }
  }

  function getDataFormat(ratioScope){
      return {
          labels: ['Scope 2', 'Scope 3'],
              datasets: [
                  {
                      label: 'Dataset',
                      data: [ratioScope.scope2.median,ratioScope.scope3.median],
                      backgroundColor: ['red', 'orange', 'yellow', 'green', 'blue'],
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
      maintainAspectRatio : true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Ratio scope2 / scope3'
        }
      }
    },
  };

  onMount(()=> {
    const ctx = portfolio.getContext('2d');
    myChart = new Chart(ctx, config);

  })
</script>

  <canvas bind:this={portfolio} height="{400}" width="{400}"/>  
  
