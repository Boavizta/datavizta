<script lang="ts">
  import {onMount} from 'svelte';
  import {_} from 'svelte-i18n';
  import type { Impact } from "$lib/customType";

  let result_fab;
  let result_total;
  let result_others;
  let use_pct;
  let fab_pct;
  let cpu_pct;
  let ram_pct;
  let ssd_pct;
  let hdd_pct;
  let others_pct;

  let nb_rounded;

  export let result:Impact;
  export let criteria;
  export let description;


  function updateChart(result) {
    result_fab=result.assembly + result.cpu + result.hdd + result.motherboard + result.power_supply + result.ram + result.ssd;
    result_total=result.use + result_fab;
    result_others=result.assembly + result.motherboard + result.power_supply;
    use_pct=result.use * 100 / result_total;
    fab_pct=result_fab * 100 / result_total;
    cpu_pct=result.cpu * 100 / result_total;
    ram_pct=result.ram * 100 / result_total;
    ssd_pct=result.ssd * 100 / result_total;
    hdd_pct=result.hdd * 100 / result_total;
    others_pct=result_others * 100 / result_total;
  }

  function setRounded(unit: number) {
      switch (unit) {
          case 'kgCO2eq':
              nb_rounded = 1
              break;
          case 'MJ':
              nb_rounded = 0
              break;
          case 'kgSbeq':
              nb_rounded = 6
              break;
          default:
              nb_rounded = 6
      }

  }
  onMount(() => {
    setRounded(result.unit)
    updateChart(result)
  })

  $: {
      setRounded(result.unit)
      updateChart(result)
  }
  
</script>
  <h3 class="mx-1 text-l font-bold">{criteria} ({result.unit}) - Total : {(result_total).toFixed(nb_rounded)}</h3>
  <h2 class="mx-1 text-sm italic">{description}</h2>

<div class="stacked-bar-graph rounded-top">
  <span style="width:{use_pct}%" class="bar-2"></span>
  <span style="width:{fab_pct}%" class="bar-1"></span>
</div>
<div class="stacked-bar-graph rounded-bottom">
  <span style="width:{use_pct}%" class="bar-2"></span>
  <span style="width:{ram_pct}%" class="bar-3"></span>
  <span style="width:{cpu_pct}%" class="bar-4"></span>
  <span style="width:{ssd_pct}%" class="bar-5"></span>
  <span style="width:{hdd_pct}%" class="bar-6"></span>
  <span style="width:{others_pct}%" class="bar-7"></span>
</div>
<div class="px-1 text-xs w-full">
  <span class="bar-2 bar-legend"></span>{$_('server-impact.Usage')} : {(result.use).toFixed(nb_rounded)}
  <span class="bar-1 bar-legend ml-2"></span> {$_('server-impact.Manufacture')} : {(result_fab).toFixed(nb_rounded)}
</div>
<div class="px-1 pb-4 text-xs w-full">
  <span class="bar-3 bar-legend"></span> {$_('server-impact.Manufacture')} RAM : {(result.ram).toFixed(nb_rounded)}
  <span class="bar-4 bar-legend ml-2"></span> {$_('server-impact.Manufacture')} CPU : {(result.cpu).toFixed(nb_rounded)}
  <span class="bar-5 bar-legend ml-2"></span> {$_('server-impact.Manufacture')} SSD : {(result.ssd).toFixed(nb_rounded)}
  <span class="bar-6 bar-legend ml-2"></span> {$_('server-impact.Manufacture')} HDD : {(result.hdd).toFixed(nb_rounded)}
  <span class="bar-7 bar-legend ml-2"></span> {$_('server-impact.Manufacture')} {$_('server-impact.Others')} : {(result_others).toFixed(nb_rounded)}
</div>

