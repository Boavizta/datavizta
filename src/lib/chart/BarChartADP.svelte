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
                    type: 'linear',
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
                label: 'ADP - USAGE',
                yAxisID: 'ADP',
                data: [result.use],
                backgroundColor: ['#74C2BD'],
                borderColor: ['#74C2BD'],
                stack: 'stack 0',
                skipNull: true
            },
                {
                    label: 'ADP - RAM - MANUF',
                    yAxisID: 'ADP',
                    data: [result.ram],
                    backgroundColor: ['#74BAC2'],
                    borderColor: ['#ffffff'],
                    stack: 'stack 0'
                },
                {
                    label: 'ADP - CPU - MANUF',
                    yAxisID: 'ADP',
                    data: [result.cpu],
                    backgroundColor: ['#0AAFC2'],
                    borderColor: ['#ffffff'],
                    stack: 'stack 0'
                },
                {
                    label: 'ADP - SSD - MANUF',
                    yAxisID: 'ADP',
                    data: [result.ssd],
                    backgroundColor: ['#00ADF7'],
                    borderColor: ['#ffffff'],
                    stack: 'stack 0'
                },
                {
                    label: 'ADP - HDD - MANUF',
                    yAxisID: 'ADP',
                    data: [result.hdd],
                    backgroundColor: ['#2D6DAD'],
                    borderColor: ['#ffffff'],
                    stack: 'stack 0'
                },
                {
                    label: 'ADP - OTHER - MANUF',
                    yAxisID: 'ADP',
                    data: [(result.motherboard + result.power_supply + result.assembly)],
                    backgroundColor: ['#3194F7'],
                    borderColor: ['#ffffff'],
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

