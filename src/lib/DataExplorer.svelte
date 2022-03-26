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
    const regionDefaultValue = {label: $_('region-picker.default'), value: -1};
    const scopeDefaultvalue: ScopeResult = {result: 1, lines: 1, median: 1};
    /* Innert state */
    let selectedRows = [];
    let lifetime;
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
                if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                    scope3 += row["gwp_total"] * (1 - row["gwp_use_ratio"]);
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
        lifetime = lifetime > 0 ? lifetime : undefined

        if (lifetime == undefined && electricalImpactFactor == -1) {
            rows_selection.forEach(row => {
                if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                    scope2 += row["gwp_total"] * row["gwp_use_ratio"];
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            })
        } else if (lifetime != undefined  && electricalImpactFactor == -1) {
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
        } else if (lifetime == undefined  && electricalImpactFactor !== -1) {
            rows_selection.forEach(row => {
                if (row["yearly_tec"] != undefined) {
                    scope2 += row["yearly_tec"] * row["lifetime"] * electricalImpactFactor
                    processedLines++;
                } else {
                    unProcessedLines++
                }
            });
        } else if (lifetime != undefined  && electricalImpactFactor !== -1) {
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

<!--    <h3 class="title-second title-left">{$_('index.search')}</h3>-->

    <div class="flex flex-row flex-wrap-reverse md:mt-10 justify-center">
        <div id="pie-container" class="flex flex-col md:rounded-l content-center py-5 px-10 border-2 border-teal-500/20 b mb-5">
            <div id="result-title" class="text-xl font-medium text-center">Ratio scope2 / scope3</div>
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
                        <small> scope 3 : valeurs d'entrée insuffisantes</small>
                    {/if}
                </div>
            </div>

            <div>
                <!--                <EquivalentImpacts gwpImpactTotal="&#45;&#45;"/>-->
            </div>
        </div>

        <div id="form-container" class="flex flex-col md:rounded-r px-5 py-5 mt-5 md:my-5 bg-opacity-20 max-w-sm bg-teal-500" >
            <div id="title" class="text-xl mb-5 font-medium text-center">{$_('index.custom_values')}</div>
            
            <div class="mb-5">
                {$_('index.selected_rows', {values: {n: selectedRows.length}})}
            </div>

            <p>
                {$_('index.select_country_elec_impact')}
            </p>
            <!-- select region -->
            <div class="mb-5">
                <div class="flex">
                    <RegionPicker bind:value={selectedRegion} {regionDefaultValue}/>
                </div>
                <small id="regionHelp" class="block mt-1 text-xs text-gray-600">{$_('index.select_country_elec_impact_tooltip')}</small>
            </div>
            
            <!-- input lifetime -->
            <div class="mb-5">
                <p class="block">{$_('index.lifetime')}</p>
                <div class="flex">
                    
                    <input id="lifetime" bind:value={lifetime} label="" type="number" class="border-2 pl-2  w-auto" min="0.1" max="100" step="0.1"/>
                    <span class="text-sm border-2 rounded-r px-4 py-1 bg-gray-300 whitespace-no-wrap">
                        years
                    </span>
                </div>
                <small id="lifetimeHelp" class="block mt-1 text-xs text-gray-600">{$_('index.years_tooltip')}</small>
            </div>
        
            <!-- button calculate -->
            <div class="myt-2 mx-auto">
                <button disabled="{disabledSearchButton}" on:click={calculateImpacts} class="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 border border-teal-600 rounded">
                    <span>{$_('index.calculate')}</span>
                </button>
            </div>
        </div>
    </div>
</div>


<style>

</style>
