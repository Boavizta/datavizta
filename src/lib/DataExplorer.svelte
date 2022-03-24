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
    const regionDefaultValue = {label: 'Aucun', value: -1};
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
        return {result: scope3, lines: processedLines, median: scope3 / processedLines}
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
        return {result: scope2, lines: processedLines, median: scope2 / processedLines}
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
<div class="data-explorer-container">
    <div>
        <DataGrid on:updateDataGrid={onDataGridUpdate}/>
    </div>
    <div class="calculator-container">
        <div class="calculator">
            <RegionPicker bind:value={selectedRegion} {regionDefaultValue}/>
            <div>
                {$_('index.lifetime')}
                <input
                        bind:value={lifetime}
                        label=""
                        suffix="years"
                        type="text"
                />
            </div>
            <div>
                {$_('index.selected_rows', {values: {n: selectedRows.length}})}
            </div>
            <div>
                <button disabled="{disabledSearchButton}" on:click={calculateImpacts} variant="raised">
                    <span>{$_('index.calculate')}</span>
                </button>
            </div>
        </div>
        <div class="result-container">
            <PieChart {ratioScope}/>
            <div class="explanation-container">
                {#if scope2.lines > 0}
                    <p>
                        moyenne du scope 2 : {scope2.median} sur {scope2.lines} ligne(s)</p>
                {:else}
                    <p> valeurs d'entrée insuffisantes</p>
                {/if}

                {#if scope3.lines > 0}
                    <p>
                        moyenne du scope 3 : {scope3.median} sur {scope3.lines} ligne(s)</p>
                {:else}
                    <p> valeurs d'entrée insuffisantes</p>
                {/if}

            </div>

            <div>
                <!--                <EquivalentImpacts gwpImpactTotal="&#45;&#45;"/>-->
            </div>
        </div>
    </div>
</div>


<style>
    .data-explorer-container {
        display: flex;
        flex-direction: column;
    }

    .calculator-container {
        display: flex;
        flex-direction: row;

    }
</style>
