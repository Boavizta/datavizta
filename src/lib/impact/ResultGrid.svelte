<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
    import type { ServerImpact } from "$lib/types/impact";
    import ResultBox from "./_ResultBox.svelte";
    import { _ } from "svelte-i18n";
    import BarChartGWP from "$lib/chart/BarChartGWP.svelte"
    import BarChartPE from "$lib/chart/BarChartPE.svelte"
    import BarChartADP from "$lib/chart/BarChartADP.svelte"

    export let serverImpact: Promise<ServerImpact>;
</script>

{#await serverImpact}
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
        <div class="px-4 md:w-full">
            <div class="mt-6 text-sm">
                <ResultBox
                    result={loadedImpact.gwp}
                    title="{$_('server-impact.Global Warming Potential')}"
                    description="{$_('server-impact.Global Warming Potential desc')}"
                />
            </div>
            <div class="mt-6 text-sm">
                <ResultBox
                    result={loadedImpact.pe}
                    title="{$_('server-impact.Primary energy')}"
                    description="{$_('server-impact.Primary energy desc')}"
                />
            </div>
            <div class="mt-6 text-sm">
                <ResultBox
                    result={loadedImpact.adp}
                    title="{$_('server-impact.Abiotic Depletion Potential')}"
                    description="{$_('server-impact.Abiotic Depletion Potential desc')}"
                />
            </div>
        </div>
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
