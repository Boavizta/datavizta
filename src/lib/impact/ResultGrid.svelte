<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
    import ResultBox from "./_ResultBox.svelte";

    export let result;

</script>


<div  class="mt-4">
<ResultBox result={result.gwp} title="Global Warming Potential" description="Évalue l’effet sur le réchauffement de la planète"> </ResultBox>
</div>
<div  class="mt-6">
    <ResultBox result={result.pe} title="Primary energy" description="Consommation de ressources énergétiques"> </ResultBox>
</div>
<div  class="mt-6">
    <ResultBox result={result.adp} title="Abiotic Depletion Potential" description="Évalue l’utilisation de minéraux et de matières premières fossiles."> </ResultBox>
</div>