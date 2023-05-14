<script lang="ts">
    import { _ } from "svelte-i18n";
    import BarChart from "$lib/impact/terminal/HorizBarChart.svelte"
    import type { Impacts } from "$lib/types/impact";

    export let impacts: Impacts;
</script>

{#await impacts}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
        {#if (loadedImpact.impacts.gwp.use != undefined) && (loadedImpact.impacts.gwp.embedded != undefined) && (loadedImpact.impacts.gwp.use.value != undefined) && (loadedImpact.impacts.gwp.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.gwp} criteria="{$_('server-impact.GWP')}" description="{$_('server-impact.Global Warming Potential desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.pe.use.value != undefined) && (loadedImpact.impacts.pe.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.pe} criteria="{$_('server-impact.PE')}" description="{$_('server-impact.Primary energy desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.adp.use.value != undefined) && (loadedImpact.impacts.adp.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.adp} criteria="{$_('server-impact.ADP')}" description="{$_('server-impact.Abiotic Depletion Potential desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ir.use.value != undefined) && (loadedImpact.impacts.ir.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ir} criteria="{$_('server-impact.IR')}" description="{$_('server-impact.IR desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.odp.use.value != undefined) && (loadedImpact.impacts.odp.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.odp} criteria="{$_('server-impact.ODP')}" description="{$_('server-impact.ODP desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ap.use.value != undefined) && (loadedImpact.impacts.ap.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ap} criteria="{$_('server-impact.AP')}" description="{$_('server-impact.AP desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ept.use.value != undefined) && (loadedImpact.impacts.ept.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ept} criteria="{$_('server-impact.EPT')}" description="{$_('server-impact.EPT desc')}"/>
            </div>
        {/if}

    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
