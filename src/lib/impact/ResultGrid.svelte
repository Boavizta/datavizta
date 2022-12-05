<script lang="ts">
    import type {GlobalImpact, VerboseImpacts} from "$lib/customType";
    import type { ServerImpact } from "$lib/types/impact";
    import ResultBox from "./_ResultBox.svelte";
    import { _ } from "svelte-i18n";
    import BarChart from "$lib/chart/HorizBarChart.svelte"

    export let verboseImpacts: VerboseImpacts;
</script>

{#await verboseImpacts}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
       
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.gwp} criteria="{$_('server-impact.GWP')}" description="{$_('server-impact.Global Warming Potential desc')}"/>
            </div>
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.pe} criteria="{$_('server-impact.PE')}" description="{$_('server-impact.Primary energy desc')}"/>
            </div>
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.adp} criteria="{$_('server-impact.ADP')}" description="{$_('server-impact.Abiotic Depletion Potential desc')}"/>
            </div>
            
       

    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
