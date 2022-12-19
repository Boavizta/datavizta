<script lang="ts">
    import type ConfigurationCloud from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import type { ServerImpact } from "$lib/types/impact";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";

    export let serverImpact: ServerImpact;
    $: serverImpact;
</script>



{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
    <div class="ml-4 px-1 w-full">
        <p><a class="text-xs">{$_('detailed-config.usage-conso')}{loadedImpact['verbose']["USAGE"]["hours_electrical_consumption"]["value"]}{loadedImpact['verbose']["USAGE"]["hours_electrical_consumption"]["unit"]}</a></p>
        <p><a class="text-xs">{$_('detailed-config.usage-title')}</a></p>
        <p><span class="ml-5 text-xs">ADP:{loadedImpact['verbose']["USAGE"]["adp_factor"]["value"]}{loadedImpact['verbose']["USAGE"]["adp_factor"]["unit"]}</span></p>
        <p><span class="ml-5 text-xs">GWP:{loadedImpact['verbose']["USAGE"]["gwp_factor"]["value"]}{loadedImpact['verbose']["USAGE"]["gwp_factor"]["unit"]}</span></p>
        <p><span class="ml-5 text-xs">PE:{loadedImpact['verbose']["USAGE"]["pe_factor"]["value"]}{loadedImpact['verbose']["USAGE"]["pe_factor"]["unit"]}</span></p>
    </div>
        {/if}
    {:catch error}
        <p style="color: red">{error.message}</p>
{/await}
