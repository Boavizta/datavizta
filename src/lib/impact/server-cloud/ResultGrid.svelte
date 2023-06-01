<script lang="ts">
    import { _ } from "svelte-i18n";
    import BarChart from "$lib/impact/server-cloud/HorizBarChart.svelte"
    import type { VerboseServerImpacts } from "$lib/types/impact";

    export let verboseImpacts: VerboseServerImpacts;
</script>

{#await verboseImpacts}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.gwp} criteria="{$_('impacts.GWP')}" description="{$_('impacts.GWP desc')}"/>
            </div>
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.pe} criteria="{$_('impacts.PE')}" description="{$_('impacts.PE desc')}"/>
            </div>
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.adpe} criteria="{$_('impacts.ADPE')}" description="{$_('impacts.ADPE desc')}"/>
            </div>
            
       

    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
