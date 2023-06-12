<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { Impacts } from "$lib/types/impact";
    export let serverImpact: Impacts;
    $: serverImpact;
</script>



{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
    <div class="ml-4 px-1 w-full">
        <p><a class="text-xs">{$_('detailed-config.usage-conso')}{loadedImpact['verbose']["avg_power"]["value"]}{loadedImpact['verbose']["avg_power"]["unit"]}</a></p>
        <p><a class="text-xs">{$_('detailed-config.usage-title')}</a></p>
        {#if "adpe" in loadedImpact['impacts']}
        <p><span class="ml-5 text-xs">ADPE:{loadedImpact['impacts']["adpe"]["use"]["value"]}{loadedImpact['impacts']["adpe"]["unit"]}</span></p>
        {/if}
        {#if "adp" in loadedImpact['impacts']}
        <p><span class="ml-5 text-xs">ADP:{loadedImpact['impacts']["adp"]["use"]["value"]}{loadedImpact['impacts']["adp"]["unit"]}</span></p>
        {/if}
        <p><span class="ml-5 text-xs">GWP:{loadedImpact['impacts']["gwp"]["use"]["value"]}{loadedImpact['impacts']["gwp"]["unit"]}</span></p>
        <p><span class="ml-5 text-xs">PE:{loadedImpact['impacts']["pe"]["use"]["value"]}{loadedImpact['impacts']["pe"]["unit"]}</span></p>
    </div>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
{/await}
