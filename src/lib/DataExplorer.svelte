<script lang="ts">
    import {_, locale} from 'svelte-i18n';
    import {onMount} from "svelte";

    import DataGrid from "./datagrid/DataGrid.svelte";
    import RegionPicker from "./chart/RegionPicker.svelte";
    import PieChart from "./chart/PieChart.svelte";
    import ExportChartImage from './chart/ExportChartImageButton.svelte';
    import ExportCsv from './chart/ExportCSVButton.svelte';
    import ShareLinkButton from './chart/ShareLinkButton.svelte';
    import * as Scope from "./impacts"
    import type { RegionPickerItem, ScopeResult, ChartResult } from './customType';
    import * as ParamParser from "./paramParser";
    //filter view of the grid
    //let datagrid:Row[]; not used?

    /* Default value */
    const lifetimeDefaultValue:number = undefined;
    let isDefaultRegion = true;
    const scopeDefaultvalue: ScopeResult = {result: 1, lines: 1, median: 1};

    /* input values for the chart */
    let lifetime:number = lifetimeDefaultValue;
    let selectedRegion:RegionPickerItem;
    //let hasCustomValues:boolean = false;
    let yearly:boolean = false;
    let filterModels = {};

    /* Inner state */
    let selectedRows = [];
    
    /* Inner state */
    let selectedSubCategories = new Set();
    let selectedManufacturers = new Set();
    let selectedCategories = new Set();
    
    let ratioScope:ChartResult = {
        scope2: scopeDefaultvalue,
        scope3: scopeDefaultvalue,
        total:0
    };
    let disabledCustomValue:boolean = false;
    
    let medianlifetime:number = 0;
    let hascustomlifetime:boolean = false;
    let impactTotal:number = 0;
/* 
    let datagridUpdateHeadersChild;
    function datagridUpdateHeaders() {
        datagridUpdateHeadersChild();
    }

    let regionPickerUpdateChild;
    function regionPickerUpdate() {
        regionPickerUpdateChild();
    }

    let pieChartUpdateChild;
    function pieChartUpdate() {
        pieChartUpdateChild();
    }

    export function dataExplorerUpdate() {
        datagridUpdateHeaders();
        regionPickerUpdate();
        pieChartUpdate();
    } 
    */
    //reactivity, on value change, update impacts
    $ : onUpdateImpacts(selectedRows, yearly, lifetime, selectedRegion);

    function onUpdateImpacts(selectedRows, yearly, lifetime, selectedRegion){
        if(selectedRegion==undefined) return;
        ratioScope = Scope.calculateImpacts(selectedRows, yearly, lifetime, selectedRegion.value)
        impactTotal = Scope.impactTotal(selectedRows);
        //hasCustomValues = selectedRegion !== regionDefaultValue || lifetime !== lifetimeDefaultValue;
    }

    export function onDataGridUpdate(e) {
        console.log(e.detail)
        selectedRows = e.detail.updatedRows
        filterModels = e.detail.filterModels
<<<<<<< HEAD
        //update median lifetime
        medianlifetime = Scope.medianlifetime(selectedRows)
        if (hascustomlifetime == false){
            lifetime = medianlifetime;
        }
=======

>>>>>>> be86d38e08efb7427099a14e05abe9739cd871cd
        //re-init categories and manfufacturers
        selectedSubCategories = new Set();
        selectedRows.forEach((r)=>{selectedSubCategories.add(r.subcategory)});
        selectedCategories = new Set();
        selectedRows.forEach((r)=>{selectedCategories.add(r.category)});
        selectedManufacturers = new Set();
        selectedRows.forEach((r)=>{selectedManufacturers.add(r.manufacturer)});
       
        disabledCustomValue = disableCustomValues(selectedRows);
        if(disabledCustomValue){
            resetRegionPicker();
            //resetLifetimeValue();
        }
        //onUpdateImpacts();
    }

    function disableCustomValues(selectedRows):boolean{
        return selectedRows.length == 1 &&
            (selectedRows[0]["yearly_tec"] == undefined || selectedRows[0]["gwp_use_ratio"] == undefined)
    }

    function resetRegionPicker(){
        isDefaultRegion = true;
    }

/*     function resetLifetimeValue(){
        lifetime = medianlifetime;
    } */


    onMount(async () => {
        /* retrieve lifetime from queryparam */
        lifetime = ParamParser.parseLifetime(new URLSearchParams(window.location.search));
        yearly = ParamParser.parseYearly(new URLSearchParams(window.location.search));
<<<<<<< HEAD
=======

    });

>>>>>>> be86d38e08efb7427099a14e05abe9739cd871cd

    });

    function changeLifetime() {
        hascustomlifetime = true;
        if (lifetime == 0){
            lifetime = medianlifetime;
        }
        //onUpdateImpacts();
    }



</script>


<div class="flex flex-col">

    <!--         <DataGrid on:updateDataGrid={onDataGridUpdate} bind:datagridUpdateHeaders={datagridUpdateHeadersChild}/>
    -->
        <DataGrid on:updateDataGrid={onDataGridUpdate}/>
<div class="flex flex-row flex-wrap md:mt-10 justify-around">
    <div class="flex flex-row flex-wrap-reverse justify-center">
        <div id="viz-container" class="flex flex-col md:rounded-l content-center py-5 px-10 border-2 border-teal-500/20">
            {#if isNaN(ratioScope.total)}
                <div id="result-title" class="text-xl font-normal text-center">{$_('pie.title')}</div>
                <div id="result-highlight" class="text-center text-4xl font-medium my-2 text-green">{impactTotal} kgCO2eq</div>
                <div id="result-impossible" class="max-w-sm text-m font-normal text-center">{$_('pie.impossible')}</div>
            {:else}
                <div id="result-title" class="text-xl font-normal text-center">{$_('pie.title')}</div>
                <div id="result-highlight" class="text-center text-4xl font-medium my-2 text-green">{ratioScope.total} kgCO2eq
                    {#if yearly}
                        / {$_('pie.year')}
                    {/if}
                    </div>
                <div id="result-subtitle" class="text-sm font-light text-center text-gray-800 pl-2">
                    {#if selectedRows.length === 1}
                        {$_('pie.subtitle_unique_equipment',{values: {total:ratioScope.total, name:(selectedRows[0].manufacturer +' ' + selectedRows[0].name)}})}
                    {:else}
                        {#if selectedSubCategories.size < 3}
                            {$_('pie.subtitle_multiple_equipment_categories_details', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines), categories:new Array(...selectedSubCategories).join(', ')}})}
                        {:else if selectedCategories.size < 3}
                            {$_('pie.subtitle_multiple_equipment_types_details', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines), types:new Array(...selectedCategories).join(', ')}})}
                        {:else}
                            {$_('pie.subtitle_multiple_equipment_categories', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines)}})}
                        {/if}
                    {/if}
                </div>

            
                    <div id="result-subtitle" class="text-sm font-light text-center text-gray-600 pl-2">
                        {#if !isDefaultRegion}
                            {selectedRegion.label}
                        {/if}
                        {#if lifetime}
                            {(!isDefaultRegion) ? ' / ' : ''}
                            {$_('pie.lifetime')}: {lifetime} {$_('pie.year(s)')}
                        {:else if !isNaN(medianlifetime)}
                            {(!isDefaultRegion) ? ' / ' : ''}
                            {$_('pie.medianlifetime')}: {medianlifetime} {$_('pie.year(s)')}
                        {/if}
                    </div>
                
                <div class="mt-2">
                    <!-- <PieChart  {ratioScope} bind:updatePieChart={pieChartUpdateChild}/> -->
                    <PieChart  {ratioScope}/>
                </div>
            {/if}
        </div>

        <div id="form-container" class="flex flex-col md:rounded-r px-5 py-5 bg-opacity-20 max-w-sm bg-teal-500" >
            <div id="title" class="text-xl mb-5 font-medium text-center">{$_('index.custom_values')}</div>
            <!-- button toggle yearly/total -->
            <div class="flex mx-auto mt-1 mb-5">
                <div class="mw-1/3 py-1 px-2">{$_('pie.total')}</div>
                <label class="mw-1/3 switch">
                    <input type="checkbox" id="yearlycheck" bind:checked={yearly}>
                    <span class="slider round"></span>
                </label>
                <div class="mw-1/3 py-1 px-2">{$_('pie.yearly')}</div>
            </div>
            <p>
                {$_('index.select_country_elec_impact')}
            </p>
            <!-- select region -->
            <div class="mt-2 mb-5">
                <div class="flex">
                    <!-- <RegionPicker on:updateImpacts={onUpdateImpacts} bind:value={selectedRegion} bind:updateRegionPicker={regionPickerUpdateChild} {regionDefaultValue} isDisabled="{disabledCustomValue}"/> -->
                    <!-- destroy/recreate component on locale update -->
                    {#key $locale}
                        <RegionPicker bind:value={selectedRegion} bind:isDefaultRegion={isDefaultRegion} isDisabled="{disabledCustomValue}"/>
                    {/key}
                </div>
                <small id="regionHelp" class="block mt-1 text-xs text-gray-600">{$_('index.select_country_elec_impact_tooltip')}</small>
            </div>

            <!-- input lifetime -->
            <div class="mb-3">
                <p class="block">{$_('index.lifetime')}</p>
                <div class="flex">

                    <input id="lifetime" bind:value={lifetime} on:input={changeLifetime} type="number" class="border-2 pl-2  w-auto" min="0.5" max="100" step="0.5" disabled="{disabledCustomValue}"/>
                    <span class="text-sm border-2 rounded-r px-4 py-1 bg-gray-300 whitespace-no-wrap">
                        {$_('index.years')}
                    </span>
                </div>
                <small id="lifetimeHelp" class="block mt-1 text-xs text-gray-600">{$_('index.years_tooltip')}</small>
            </div>

            {#if disabledCustomValue == false }
            <p class="text-xs mb-2 font-light">
                {$_('explanation.8')}
            </p>
            <p class="text-xs mb-2 font-light">
                {$_('explanation.9')}
            </p>
            {:else}
            <p class="text-xs mb-2 font-light">
                {$_('explanation.error')}
            </p>
            {/if}

            <div class="flex-row mx-auto">
                    <div id="title export" class="text-xl mt-3 font-medium text-center">{$_('pie.export')}</div>
                    
                    <!-- export chart image -->
                    <ExportChartImage />
                    <!-- export csv -->
                    <ExportCsv {selectedRows} {lifetime} {hascustomlifetime} {selectedRegion}/>
   
                    <!-- share permalink
                    -->
                    <ShareLinkButton {lifetime} {selectedRegion} {yearly} {filterModels} />
                </div> 
        </div>

    </div>
</div>
</div>
