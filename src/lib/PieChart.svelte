<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto/auto.js';
  export let data = []

  let portfolio;

  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Pie Chart'
        }
      }
    },
  };

  onMount(()=> {
    const ctx = portfolio.getContext('2d');
    var myChart = new Chart(ctx, config);
  })
</script>

<canvas bind:this={portfolio} width={400} height={400} />
