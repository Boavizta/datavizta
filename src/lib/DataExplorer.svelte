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
    import type { RegionPickerItem, ScopeResult, ChartResult, FlatFilterModel,Row } from './customType';
    import * as ParamParser from "./paramParser";

    /* Default value */
    let isDefaultRegion = true;
    const scopeDefaultvalue: ScopeResult = {result: 1, lines: 1, median: 1};

    /* input values from the url */
    let lifetime:number;
    let selectedRegion:RegionPickerItem= {label:undefined, value:undefined, id:undefined};
    let yearly:boolean;
    let filterModels:FlatFilterModel;//filters defined in the datagrid component
    let windowOrigin;
    
    /* Inner state */
    let selectedRows:Row[] = [];
    let selectedSubCategories = new Set();//todo : duplicated from filterModels
    let selectedManufacturers = new Set();//todo : duplicated from filterModels
    let selectedCategories = new Set();//todo : duplicated from filterModels
    
    let ratioScope:ChartResult = {
        scope2: scopeDefaultvalue,
        scope3: scopeDefaultvalue,
        total:0
    };
    let disabledCustomValue:boolean = false;
    
    let medianlifetime:number = 0;
    let hascustomlifetime:boolean = false;
    let impactTotal:number = 0;

    //reactivity, on value change, update impacts
    $ : onUpdateImpacts(selectedRows, yearly, lifetime, selectedRegion);

    function onUpdateImpacts(selectedRows:Row[], yearly, lifetime, selectedRegion){
        if(selectedRegion==undefined) return;
        if(selectedRows==undefined || selectedRows.length === 0) return;

        ratioScope = Scope.calculateImpacts(selectedRows, yearly, lifetime, selectedRegion.value)
        impactTotal = Scope.impactTotal(selectedRows);
        //hasCustomValues = selectedRegion !== regionDefaultValue || lifetime !== lifetimeDefaultValue;
    }

    function onDataGridUpdate(e) {
        selectedRows = e.detail.updatedRows
        filterModels = e.detail.filterModels
        //update median lifetime
       
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
            hascustomlifetime = false;
        }
        medianlifetime = Scope.medianlifetime(selectedRows)
        if (hascustomlifetime == false){
            lifetime = medianlifetime;
        }
    }

    function disableCustomValues(selectedRows):boolean{
        return selectedRows.length == 1 &&
            (selectedRows[0]["yearly_tec"] == undefined || selectedRows[0]["gwp_use_ratio"] == undefined)
    }

    function resetRegionPicker(){
        isDefaultRegion = true;
    }


    onMount(async () => {
        /* retrieve lifetime from queryparam */
        windowOrigin = window.location.origin;
        lifetime = ParamParser.parseLifetime(new URLSearchParams(window.location.search));
        if(lifetime){
            hascustomlifetime = true;
        }
        yearly = ParamParser.parseYearly(new URLSearchParams(window.location.search)) || yearly;

    });

    function changeLifetime() {
        hascustomlifetime = true;
    }
    function singleItemSelected(selectedRows) {
        if (selectedRows.length == 1) {
            return selectedRows[0].name;
        } else {
            return "false"
        }
    }

</script>


<div class="flex flex-col">
    <DataGrid on:updateDataGrid={onDataGridUpdate}/>
<div class="flex flex-row flex-wrap md:mt-2 justify-around">

    <!-- pie + form container-->
    <div class="flex flex-row flex-wrap-reverse justify-center">
        <div id="viz-container" class="flex flex-col md:rounded-l content-center py-5 px-10 border-solid border-2 border-teal-500/20">
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
                {@html $_('explanation.8')}
            </p>
            <p class="text-xs mb-2 font-light">
                {@html $_('explanation.9',  {values: {urlFrance:windowOrigin +"?region=france", 
                urlPoland:windowOrigin +"?region=poland"}})}
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
   
                </div> 
                <div class="flex-row mx-auto">
                    <!-- share permalink, does not work (yet) with one equipment selection-->
                    <ShareLinkButton {lifetime} {selectedRegion} {yearly} {filterModels} singleItemSelected={singleItemSelected(selectedRows)}/>
                </div>
        </div>

    </div>
</div>
</div>
