<script lang="ts">
  import {onMount} from 'svelte';
  import {_} from 'svelte-i18n';
  import type { Impact } from "$lib/customType";

  let result_fab;
  let result_total;
  let result_others;
  let use_pct;
  let fab_pct
  let cpu_pct
  let ram_pct
  let ssd_pct
  let hdd_pct
  let others_pct

  export let result:Impact;
  export let criteria;

  function updateChart(result) {
    result_fab=result.assembly + result.cpu + result.hdd + result.motherboard + result.power_supply + result.ram + result.ssd
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

  onMount(() => {
    updateChart(result)
  })

  $: {
    updateChart(result)
  }
  
</script>
  <h3 class="mb-2 mx-2 text-l font-bold">{criteria}</h3>

<div class="stacked-bar-graph">
  <span style="width:{use_pct}%; border-top-left-radius: 3px" class="bar-2"></span>
  <span style="width:{fab_pct}%; border-top-right-radius: 3px" class="bar-1"></span>
</div>
<div class="stacked-bar-graph">
  <span style="width:{use_pct}%; border-bottom-left-radius: 3px" class="bar-2"></span>
  <span style="width:{ram_pct}%" class="bar-3"></span>
  <span style="width:{cpu_pct}%" class="bar-4"></span>
  <span style="width:{ssd_pct}%" class="bar-5"></span>
  <span style="width:{hdd_pct}%" class="bar-6"></span>
  <span style="width:{others_pct}%; border-bottom-right-radius: 3px" class="bar-7"></span>
</div>
<div class="px-4 text-xs w-full">
  <span class="bar-2 bar-legend"></span> {$_('server-impact.Usage')} : {result.use}{result.unit}
  <span class="bar-1 bar-legend"></span> {$_('server-impact.Manufacture')} : {result.use}{result.unit}
</div>
<div class="px-4 pb-4 text-xs w-full">
  <span class="bar-3 bar-legend"></span> {$_('server-impact.Manufacture')} RAM : {result.ram}{result.unit}  
  <span class="bar-4 bar-legend"></span> {$_('server-impact.Manufacture')} CPU : {result.cpu}{result.unit}  
  <span class="bar-5 bar-legend"></span> {$_('server-impact.Manufacture')} SSD : {result.ssd}{result.unit}  
  <span class="bar-6 bar-legend"></span> {$_('server-impact.Manufacture')} HDD : {result.hdd}{result.unit}
  <span class="bar-7 bar-legend"></span> {$_('server-impact.Manufacture')} {$_('server-impact.Others')} : {result_others}{result.unit}
</div>

