<script lang="ts">
    import BarChart from "$lib/impact/iot/HorizBarChart.svelte";
    import type { VerboseIotImpacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";

    export let verboseImpacts: VerboseIotImpacts;
</script>

{#await verboseImpacts}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.gwp} criteria="{$_('impacts.GWP')}" description="{$_('impacts.GWP desc')}"/>
            </div>
            <div class="px-1 w-full">
                <BarChart result={loadedImpact.adpe} criteria="{$_('impacts.ADPE')}" description="{$_('impacts.ADPE desc')}"/>
            </div>
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
