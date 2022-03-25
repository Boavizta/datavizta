<script lang="ts">
    import {_} from 'svelte-i18n';


    import DataGrid from "./DataGrid.svelte";
    import RegionPicker from "./RegionPicker.svelte";
    import PieChart from "./PieChart.svelte";
    import {onMount} from "svelte";

    type ScopeResult = {
        result: number,
        lines: number,
        median: number
    }

    /* Default value */
    const regionDefaultValue = {label: 'Utiliser la valeur par défaut', value: -1};
    const lifetimeDefaultValue = 3;
    const scopeDefaultvalue: ScopeResult = {result: 1, lines: 1, median: 1};

    /* Innert state */
    let selectedRows = [];
    let lifetime = lifetimeDefaultValue;
    let selectedRegion = regionDefaultValue;
    let disabledSearchButton;//not used
    let scope2: ScopeResult = scopeDefaultvalue;
    let scope3: ScopeResult = scopeDefaultvalue;
    let rows_selection;
    let ratioScope = {
        scope2: scope2,
        scope3: scope3
    };

    /* calculate scope 3 impacts */
    function impactScope3(rows_selection): ScopeResult {
        let scope3 = 0;
        let processedLines = 0;
        let unProcessedLines = 0//not used
        rows_selection.forEach(row => {
            if (row["gwp_total"] != undefined) {
                if (row["gwp_total"] != undefined && row["gwp_manufacturing_ratio"] != undefined) {
                    scope3 += row["gwp_total"] * row["gwp_manufacturing_ratio"];
                    processedLines++
                } else {
                    unProcessedLines++
                }
            }
        });
        const median = Math.round(scope3 / processedLines);
        return {result: scope3, lines: processedLines, median: median}
    }

    /* calculate scope 2 impacts */
    function impactScope2(rows_selection, lifetime, electricalImpactFactor): ScopeResult {
        let scope2 = 0;
        let processedLines = 0
        let unProcessedLines = 0//not used
        if (lifetime == undefined && electricalImpactFactor == -1) {
            rows_selection.forEach(row => {
                if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                    scope2 += row["gwp_total"] * row["gwp_use_ratio"];
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            })
        } else if (lifetime != undefined && electricalImpactFactor == -1) {
            rows_selection.forEach(row => {
                if (row["gwp_total"] != undefined
                    && row["gwp_use_ratio"] != undefined
                    && row["lifetime"] != undefined
                    && row["lifetime"] != 0) {
                    scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / row["lifetime"]) * lifetime
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            });
        } else if (lifetime == undefined && electricalImpactFactor !== -1) {
            rows_selection.forEach(row => {
                if (row["yearly_tec"] != undefined) {
                    scope2 += row["yearly_tec"] * row["lifetime"] * electricalImpactFactor
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            });
        } else if (lifetime != undefined && electricalImpactFactor !== -1) {
            rows_selection.forEach(row => {
                if (row["yearly_tec"] != undefined) {
                    scope2 += row["yearly_tec"] * lifetime * electricalImpactFactor;
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            })
        }
        const median = Math.round(scope2 / processedLines);
        return {result: scope2, lines: processedLines, median: median}
    }

    function calculateImpacts() {
        console.log("calculateImpacts")
        console.log("lifetime ", lifetime)
        console.log("selectedRowsNumber ", selectedRows.length)
        console.log("region ", selectedRegion)
        scope2 = impactScope2(selectedRows, lifetime, selectedRegion.value);
        scope3 = impactScope3(selectedRows);
        ratioScope = {scope2: scope2, scope3: scope3}
        console.log("scope2 ", scope2)
        console.log("scope3 ", scope3)
    }

    function onDataGridUpdate(e) {
        //console.log("DataExplorer:onDataGridUpdate")
        //console.log(e.detail)
        selectedRows = e.detail
        console.log("DataExplorer:onDataGridUpdate:", selectedRows.length)
        calculateImpacts()
    }

</script>
<div class="flex flex-col">
    <div>
        <DataGrid on:updateDataGrid={onDataGridUpdate}/>
    </div>
    
    <div class="flex flex-row flex-wrap mt-10 justify-around">
        <div id="form-container" class="flex flex-col rounded-lg max-w-l 
                px-10 py-5 mb-5 bg-teal-500 bg-opacity-20" >
            <div id="title" class="text-xl mb-5 font-medium">Customize value</div>
            
            <div class="mb-10">
                {$_('index.selected_rows', {values: {n: selectedRows.length}})}
            </div>

            <div class="mb-10">
                <RegionPicker bind:value={selectedRegion} {regionDefaultValue}/>
            </div>
            
            <div class="mb-10">
                <div class="flex">
                    <span class="text-sm border-2 rounded-l px-4 py-2 bg-gray-300 
                    whitespace-no-wrap">
                        {$_('index.lifetime')}
                    </span>
                    <input
                            id="lifetime"
                            bind:value={lifetime}
                            label=""
                            type="text"
                            class="border-2 px-4 py-2"
                    />
                    <span class="text-sm border-2 rounded-r px-4 py-2 bg-gray-300 whitespace-no-wrap">
                        years
                    </span>
                </div>
                <small id="lifetimeHelp" class="block mt-1 text-xs text-gray-600">appliquée pour les équipements selectionnés</small>
            </div>
        
            
            <div class="myt-2 mx-auto">
                <button disabled="{disabledSearchButton}" on:click={calculateImpacts} class="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 border border-teal-600 rounded">
                    <span>{$_('index.calculate')}</span>
                </button>
            </div>
        </div>
        <div id="result-container" class="flex flex-col rounded-lg content-center 
        py-5 px-10 border-2 max-w-l mb-5">
            <div id="result-title" class="text-xl mb-5 font-medium text-center">Ratio scope2/scope3</div>
            <div id="pie-container" class="">
                <PieChart  {ratioScope}/>
            </div>
            <div id="explanation-container" class="text-center mt-5">
                <div>

                
                {#if scope2.lines > 0}
                    <small>
                        scope 2 : {scope2.median} kgCO2 sur {scope2.lines} équipement(s)</small>
                {:else}
                    <small> scope 2 : valeurs d'entrée insuffisantes</small>
                {/if}
            </div>
            <div>
                {#if scope3.lines > 0}
                    <small>
                        scope 3 : {scope3.median} kgCO2 sur {scope3.lines} équipement(s)</small>
                {:else}
                    <small> scope 2 : valeurs d'entrée insuffisantes</small>
                {/if}
            </div>
            </div>

            <div>
                <!--                <EquivalentImpacts gwpImpactTotal="&#45;&#45;"/>-->
            </div>
        </div>
    </div>
</div>


<style>

</style>
