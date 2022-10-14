<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
    import ResultBox from "./_ResultBox.svelte";

    export let result: GlobalImpact = {
        "gwp":{
            "manufacture":970.0,
            "use":1170.0,
            "unit":"kgCO2eq"
        },
        "pe":{
            "manufacture":13000.0,
            "use":39700.0,
            "unit":"MJ"
        },
        "adp":{
            "manufacture":0.15,
            "use":0.000198,
            "unit":"kgSbeq"
        }
    }

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