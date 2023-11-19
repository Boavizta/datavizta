<script lang="ts">
  import type { CriteriaIotImpact } from "$lib/types/impact";
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let result: CriteriaIotImpact;
  export let criteria;
  export let description;

  let result_fab;
  let result_total;
  let use_pct;
  let fab_pct;
  let component_pcts = {};

  function formatComponentName(component) {
    return component.charAt(0).toUpperCase() + component.slice(1).split('-')[0];
  }

  function updateChart(result) {
    result_fab = Object.values(result.embedded).reduce((sum, value) => sum + value, 0);
    result_total = result.use.total + result_fab;
    use_pct = (result.use.total * 100) / result_total;
    fab_pct = (result_fab * 100) / result_total;
    component_pcts = {};
    let componentIndex = 3;

    for (const [component, value] of Object.entries(result.embedded)) {
      const readableName = formatComponentName(component);
      component_pcts[readableName] = {pct: (value * 100) / result_total, index: componentIndex++}
    }
  }

  let nb_rounded = 2;

  function setRounded(unit) {
    switch (unit) {
      case 'kgCO2eq':
        nb_rounded = 1;
        break;
      case 'MJ':
        nb_rounded = 0;
        break;
      case 'kgSbeq':
        nb_rounded = 6;
        break;
      default:
        nb_rounded = 2;
    }
  }

  onMount(() => {
    setRounded(result.unit);
    updateChart(result);
  });

  $: if (result) {
    setRounded(result.unit);
    updateChart(result);
  }
</script>

<h3 class="mx-1 text-l font-bold">{criteria} ({result.unit}) - Total : {result_total.toFixed(nb_rounded)}</h3>
<h2 class="mx-1 text-sm italic">{description}</h2>

<div class="stacked-bar-graph rounded-top">
  <span style="width:{use_pct}%" class="bar-2"></span>
  <span style="width:{fab_pct}%" class="bar-1"></span>
</div>  
<div class="stacked-bar-graph rounded-bottom">
  <span style="width:{use_pct}%" class="bar-2"></span>
  {#each Object.entries(component_pcts) as [component, { pct, index }]}
    <span style="width:{pct}%" class={`bar-${index}`}></span>
  {/each}
</div>
<div class="px-1 text-xs w-full">
  <span class="bar-2 bar-legend"></span> {$_('impacts.Usage')} : {result.use.total.toFixed(nb_rounded)}
  <span class="bar-1 bar-legend ml-2"></span> {$_('impacts.Manufacture')} : {result_fab.toFixed(nb_rounded)}
</div>
<div class="px-1 pb-4 text-xs w-full">
  {#each Object.entries(component_pcts) as [component, { pct, index }]}
    <span class={`bar-${index} bar-legend`}></span> {$_('impacts.Manufacture')} {component} : {pct.toFixed(nb_rounded)}
  {/each}
</div>
