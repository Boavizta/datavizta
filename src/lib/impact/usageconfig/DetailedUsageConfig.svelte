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
        {#if loadedImpact['impacts']["adpe"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">ADPE:{loadedImpact['impacts']["adpe"]["use"]["value"]}{loadedImpact['impacts']["adpe"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "adp" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["adp"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">ADP:{loadedImpact['impacts']["adp"]["use"]["value"]}{loadedImpact['impacts']["adp"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "gwp" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["gwp"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">GWP:{loadedImpact['impacts']["gwp"]["use"]["value"]}{loadedImpact['impacts']["gwp"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "pe" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["pe"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">PE:{loadedImpact['impacts']["pe"]["use"]["value"]}{loadedImpact['impacts']["pe"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "ir" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["ir"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">IR:{loadedImpact['impacts']["ir"]["use"]["value"]}{loadedImpact['impacts']["ir"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "odp" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["odp"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">ODP:{loadedImpact['impacts']["odp"]["use"]["value"]}{loadedImpact['impacts']["odp"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "ap" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["ap"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">AP:{loadedImpact['impacts']["ap"]["use"]["value"]}{loadedImpact['impacts']["ap"]["unit"]}</span></p>
        {/if}
        {/if}
        {#if "ept" in loadedImpact['impacts']}
        {#if loadedImpact['impacts']["ept"]["use"]["value"]!= undefined}
        <p><span class="ml-5 text-xs">IR:{loadedImpact['impacts']["ept"]["use"]["value"]}{loadedImpact['impacts']["ept"]["unit"]}</span></p>
        {/if}
        {/if}
    </div>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
{/await}
