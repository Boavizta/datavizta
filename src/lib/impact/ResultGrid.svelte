<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
    import type { ServerImpact } from "$lib/types/impact";
    import ResultBox from "./_ResultBox.svelte";

    export let serverImpact: Promise<ServerImpact>;
</script>

{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
        <div class="mt-4">
            <ResultBox
                result={loadedImpact.gwp}
                title="Global Warming Potential"
                description="Évalue l’effet sur le réchauffement de la planète"
            />
        </div>
        <div class="mt-6">
            <ResultBox
                result={loadedImpact.pe}
                title="Primary energy"
                description="Consommation de ressources énergétiques"
            />
        </div>
        <div class="mt-6">
            <ResultBox
                result={loadedImpact.adp}
                title="Abiotic Depletion Potential"
                description="Évalue l’utilisation de minéraux et de matières premières fossiles."
            />
        </div>
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
