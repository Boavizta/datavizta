<script lang="ts">
  import {onMount} from 'svelte';
  import {_} from 'svelte-i18n';
  import type { CriteriaTerminalImpact } from "$lib/types/impact";

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

  export let result:CriteriaTerminalImpact;
  export let criteria;
  export let description;


  function updateChart(result) {
    result_total=result.use.value + result.embedded.value;
    use_pct=result.use.value * 100 / result_total;
    fab_pct=result.embedded.value * 100 / result_total;
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

  {#if (result.use.value != undefined) && (result.embedded.value != undefined)}
    <div class="stacked-bar-graph rounded-top rounded-bottom">
      <span style="width:{use_pct}%" class="bar-2"></span>
      <span style="width:{fab_pct}%" class="bar-1"></span>
    </div>
    <div class="px-1 text-xs w-full ">
      <span class="bar-2 bar-legend"></span> {$_('impacts.Usage')} : {(result.use.value).toFixed(nb_rounded)} {#if result.use.warnings != undefined}({result.use.warnings}){/if}
      <span class="bar-1 bar-legend ml-2"></span> {$_('impacts.Manufacture')} : {(result.embedded.value).toFixed(nb_rounded)} {#if result.embedded.warnings != undefined}({result.embedded.warnings}){/if}  
    </div>
    {/if}
