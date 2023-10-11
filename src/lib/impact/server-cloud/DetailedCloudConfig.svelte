<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { VerboseServerImpacts } from "$lib/types/impact";

    export let serverImpact: VerboseServerImpacts;
</script>

{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
    <div class="ml-4 px-1 w-full">
        <p><span class="text-xs"> {loadedImpact['verbose']["CPU-1"]["units"]["value"]} {loadedImpact['verbose']["CPU-1"]["model_range"]["value"]} CPU {$_('with')} TDP {loadedImpact['verbose']["CPU-1"]["tdp"]["value"]}{loadedImpact['verbose']["CPU-1"]["tdp"]["unit"]} {$_('and')} {loadedImpact['verbose']["CPU-1"]["core_units"]["value"]} {$_('cores')} (die size: {loadedImpact['verbose']["CPU-1"]["die_size"]["value"]}{loadedImpact['verbose']["CPU-1"]["die_size"]["unit"]})</span></p>
        <p><span class="text-xs"> {loadedImpact['verbose']["RAM-1"]["units"]["value"]} x {loadedImpact['verbose']["RAM-1"]["capacity"]["value"]}{loadedImpact['verbose']["RAM-1"]["capacity"]["unit"]} RAM {$_('with')} {$_('density')}: {loadedImpact['verbose']["RAM-1"]["density"]["value"]}{loadedImpact['verbose']["RAM-1"]["density"]["unit"]}</span></p>
        {#if (loadedImpact['verbose']["SSD-1"] != undefined)}
            {#if (loadedImpact['verbose']["SSD-1"]["units"]["value"] > 0)}
            <p><span class="text-xs"> {loadedImpact['verbose']["SSD-1"]["units"]["value"]} x {loadedImpact['verbose']["SSD-1"]["capacity"]["value"]}{loadedImpact['verbose']["SSD-1"]["capacity"]["unit"]} SSD {$_('with')} {$_('density')}: {loadedImpact['verbose']["SSD-1"]["density"]["value"]}{loadedImpact['verbose']["SSD-1"]["density"]["unit"]}</span></p>
            {:else}
            <p><span class="text-xs">{$_('without')} SSD</span></p>
            {/if}
        {:else}
            <p><span class="text-xs">{$_('without')} SSD</span></p>
        {/if}
        {#if (loadedImpact['verbose']["HDD-1"] != undefined)}
            {#if (loadedImpact['verbose']["HDD-1"]["units"]["value"] > 0)}
                <p><span class="text-xs"> {loadedImpact['verbose']["HDD-1"]["units"]["value"]} x HDD </span></p>
            {:else}
            <p><span class="text-xs">{$_('without')} HDD</span></p>
            {/if}
        {:else}
            <p><span class="text-xs">{$_('without')} HDD</span></p>
        {/if}
    </div>
    {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
{/await}
