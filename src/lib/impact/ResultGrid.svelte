<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
    import type { ServerImpact } from "$lib/types/impact";
    import ResultBox from "./_ResultBox.svelte";
    import { _ } from "svelte-i18n";

    export let serverImpact: Promise<ServerImpact>;
</script>

{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
        <div class="">
            <ResultBox
                result={loadedImpact.gwp}
                title="{$_('server-impact.Global Warming Potential')}"
                description="{$_('server-impact.Global Warming Potential desc')}"
            />
        </div>
        <div class="mt-6">
            <ResultBox
                result={loadedImpact.pe}
                title="{$_('server-impact.Primary energy')}"
                description="{$_('server-impact.Primary energy desc')}"
            />
        </div>
        <div class="mt-6">
            <ResultBox
                result={loadedImpact.adp}
                title="{$_('server-impact.Abiotic Depletion Potential')}"
                description="{$_('server-impact.Abiotic Depletion Potential desc')}"
            />
        </div>
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
