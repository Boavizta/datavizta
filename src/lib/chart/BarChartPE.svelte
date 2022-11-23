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
                label: 'PE - USAGE',
                yAxisID: 'PE',
                data: [result.use],
                backgroundColor: ['#003964'],
                borderColor: ['#003964'],
                stack: 'stack 0',
                skipNull: true
            },
                {
                    label: 'PE - RAM - MANUF',
                    yAxisID: 'PE',
                    data: [result.ram],
                    backgroundColor: ['#0A94C2'],
                    borderColor: ['#0A94C2'],
                    stack: 'stack 0'
                },
                {
                    label: 'PE - CPU - MANUF',
                    yAxisID: 'PE',
                    data: [result.cpu],
                    backgroundColor: ['#00ADF7'],
                    borderColor: ['#00ADF7'],
                    stack: 'stack 0'
                },
                {
                    label: 'PE - SSD - MANUF',
                    yAxisID: 'PE',
                    data: [result.ssd],
                    backgroundColor: ['#1175AB'],
                    borderColor: ['#1175AB'],
                    stack: 'stack 0'
                },
                {
                    label: 'PE - HDD - MANUF',
                    yAxisID: 'PE',
                    data: [result.hdd],
                    backgroundColor: ['#31B1F7'],
                    borderColor: ['#31B1F7'],
                    stack: 'stack 0'
                },
                {
                    label: 'PE - OTHER - MANUF',
                    yAxisID: 'PE',
                    data: [(result.motherboard + result.power_supply + result.assembly)],
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

<canvas bind:this={portfolio} height="{300}" width="100%"/>

