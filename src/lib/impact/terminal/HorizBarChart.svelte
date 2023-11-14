<script lang="ts">
  import {onMount} from 'svelte';
  import {_} from 'svelte-i18n';
  import type { CriteriaTerminalImpact } from "$lib/types/impact";

  let result_total;
  let use_pct;
  let fab_pct;
  let avoided_pct;
  let use_rest_pct;
  let fab_rest_pct

  let nb_rounded;

  export let result:CriteriaTerminalImpact;
  export let criteria;
  export let description;
  export let avoided;


  function updateChart(result,avoided) {
    result_total=result.use.value + result.embedded.value;
    use_pct=result.use.value * 100 / result_total;
    fab_pct=result.embedded.value * 100 / result_total;
    avoided_pct=Math.min(avoided * 100 / result_total,100);
    fab_rest_pct=Math.max(result.embedded.value-avoided,0) * 100 / result_total
    use_rest_pct=Math.max(0,result_total-Math.max(avoided,result.embedded.value)) * 100 / result_total
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
    updateChart(result,avoided)
  })

  $: {
      setRounded(result.unit)
      updateChart(result,avoided)
  }
  
</script>
  <h3 class="mx-1 text-l font-bold">{criteria} ({result.unit}) - Total : {(result_total).toFixed(nb_rounded)}</h3>
  <h2 class="mx-1 text-sm italic">{description}</h2>

  {#if (result.use.value != undefined) && (result.embedded.value != undefined)}
    <div class="stacked-bar-graph-small rounded-top">
      <span style="width:{use_pct}%" class="bar-2"></span>
      <span style="width:{fab_pct}%" class="bar-1"></span>
    </div>
    <div class="stacked-bar-graph-small rounded-bottom">
      <span style="width:{use_rest_pct}%" class="bar-2"></span>
      <span style="width:{fab_rest_pct}%" class="bar-1"></span>
      <span style="width:{avoided_pct}%" class="bar-3"></span>
    </div>
    <div class="px-1 text-xs w-full ">
      <span class="bar-2 bar-legend"></span> {$_('impacts.Usage')} : {(result.use.value).toFixed(nb_rounded)} {#if result.use.warnings != undefined}({result.use.warnings}){/if}
      <span class="bar-1 bar-legend ml-2"></span> {$_('impacts.Manufacture')} : {(result.embedded.value).toFixed(nb_rounded)} {#if result.embedded.warnings != undefined}({result.embedded.warnings}){/if}
      {#if (avoided > 0)}<span class="bar-3 bar-legend"></span> {$_('impacts.Avoided')} : {(avoided).toFixed(nb_rounded)} {$_('impacts.Avoideddisclaim')}{/if}
    </div>
    {/if}
