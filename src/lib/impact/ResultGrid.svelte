<script lang="ts">
    import type {GlobalImpact, VerboseImpacts} from "$lib/customType";
    import type { ServerImpact } from "$lib/types/impact";
    import ResultBox from "./_ResultBox.svelte";
    import { _ } from "svelte-i18n";
    import BarChartGWP from "$lib/chart/BarChartGWP.svelte"
    import BarChartPE from "$lib/chart/BarChartPE.svelte"
    import BarChartADP from "$lib/chart/BarChartADP.svelte"

    export let verboseImpacts: VerboseImpacts;
</script>

{#await verboseImpacts}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
        <div class="px-4 flex w-full">
            <div class="px-4 md:w-1/3">
                <BarChartGWP result={loadedImpact.gwp} />
            </div>
            <div class="px-4 md:w-1/3">
                <BarChartPE result={loadedImpact.pe} />
            </div>
            <div class="px-4 md:w-1/3">
                <BarChartADP result={loadedImpact.adp} />
            </div>
        </div>

    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
