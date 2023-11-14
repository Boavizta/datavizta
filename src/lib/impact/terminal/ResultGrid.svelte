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
                <BarChart result={loadedImpact.impacts.gwp} avoided={loadedImpact.avoided.gwp.value} criteria="{$_('impacts.GWP')}" description="{$_('impacts.GWP desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.pe.use.value != undefined) && (loadedImpact.impacts.pe.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.pe} avoided={loadedImpact.avoided.pe.value} criteria="{$_('impacts.PE')}" description="{$_('impacts.PE desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.adpe.use.value != undefined) && (loadedImpact.impacts.adpe.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.adpe} avoided={loadedImpact.avoided.adpe.value} criteria="{$_('impacts.ADPE')}" description="{$_('impacts.ADPE desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ir.use.value != undefined) && (loadedImpact.impacts.ir.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ir} avoided={loadedImpact.avoided.ir.value} criteria="{$_('impacts.IR')}" description="{$_('impacts.IR desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.odp.use.value != undefined) && (loadedImpact.impacts.odp.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.odp} avoided={loadedImpact.avoided.odp.value} criteria="{$_('impacts.ODP')}" description="{$_('impacts.ODP desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ap.use.value != undefined) && (loadedImpact.impacts.ap.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ap} avoided={loadedImpact.avoided.ap.value} criteria="{$_('impacts.AP')}" description="{$_('impacts.AP desc')}"/>
            </div>
        {/if}
        {#if (loadedImpact.impacts.ept.use.value != undefined) && (loadedImpact.impacts.ept.embedded.value != undefined)}
            <div class="px-1 w-full pb-4">
                <BarChart result={loadedImpact.impacts.ept} avoided={loadedImpact.avoided.ept.value} criteria="{$_('impacts.EPT')}" description="{$_('impacts.EPT desc')}"/>
            </div>
        {/if}

    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
