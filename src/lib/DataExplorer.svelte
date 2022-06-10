<script lang="ts">
    import {_} from 'svelte-i18n';
    import {onMount} from "svelte";
    import html2canvas from 'html2canvas';

    import DataGrid from "./DataGrid.svelte";
    import RegionPicker from "./RegionPicker.svelte";
    import PieChart from "./PieChart.svelte";
    import * as Scope from "./impacts"
    import { query_selector_all } from 'svelte/internal';
    import type { RegionPickerItem, ScopeResult, Row, ChartResult } from './customType';
    
    //upper state of the grid
    let datagrid:Row[];

    /* Default value */
    const lifetimeDefaultValue:number = undefined;
    let regionDefaultValue: RegionPickerItem = {label: $_('region-picker.default'), value: -1, id:-1};
    const scopeDefaultvalue: ScopeResult = {result: 1, lines: 1, median: 1};

    /* input values */
    let lifetime:number = lifetimeDefaultValue;//custom lifetime (opt)
    let selectedRegion:RegionPickerItem = regionDefaultValue;
    let disabledCustomValue:boolean = false;
    let hasCustomValues:boolean = false;
    let shareLink:string ;
    let yearly:boolean = false;

    /* Inner state */
    let state = {
        selectedRows : [],
        selectedSubCategories : new Set(),
        selectedManufacturers : new Set(),
        selectedCategories : new Set(),
    }

    let ratioScope:ChartResult = {
        scope2: scopeDefaultvalue,
        scope3: scopeDefaultvalue,
        total:0
    };

    let medianlifetime:number = 0;
    let hascustomlifetime:boolean = false;
    let impactTotal:number = 0;

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

    function onUpdateImpacts(){
        ratioScope = Scope.calculateImpacts(state.selectedRows, yearly, lifetime, selectedRegion.value)
        medianlifetime = Scope.medianlifetime(state.selectedRows)
        impactTotal = Scope.impactTotal(state.selectedRows);
        imageUrlData = null;
        hasCustomValues = selectedRegion !== regionDefaultValue || lifetime !== lifetimeDefaultValue;
        if (hascustomlifetime == false){
            lifetime = medianlifetime;
        }

    }

    export function onDataGridUpdate(e) {
        state.selectedRows = e.detail

        //re-init categories and manfufacturers
        state.selectedSubCategories = new Set();
        state.selectedRows.forEach((r)=>{state.selectedSubCategories.add(r.subcategory)});
        state.selectedCategories = new Set();
        state.selectedRows.forEach((r)=>{state.selectedCategories.add(r.category)});
        state.selectedManufacturers = new Set();
        state.selectedRows.forEach((r)=>{state.selectedManufacturers.add(r.manufacturer)});
       
        disabledCustomValue = disableCustomValues(state.selectedRows);
        if(disabledCustomValue){
            resetRegionPicker();
            resetLifetimeValue();
        }
        onUpdateImpacts();
        imageUrlData = null;
    }

    function disableCustomValues(selectedRows):boolean{
        return selectedRows.length == 1 &&
            (selectedRows[0]["yearly_tec"] == undefined || selectedRows[0]["gwp_use_ratio"] == undefined)
    }

    function resetRegionPicker(){
        selectedRegion = regionDefaultValue;
    }

    function resetLifetimeValue(){
        lifetime = medianlifetime;
    }

    let imageUrlData = null;

    onMount(async () => {
        /* retrieve lifetime from queryparam */
        lifetime = Number(new URLSearchParams(window.location.search).get('lifetime'));
    });

    async function downloadImage() {
        const canvas = await html2canvas(document.getElementById('viz-container'));
        imageUrlData = canvas.toDataURL("image/png");
    }

    function buildLink(){
        let link = window.location.origin;
        let query = ""
        if(lifetime){
            query += "lifetime=" + lifetime + "&"
        }
        if(state.selectedSubCategories.size>0){
            query += "subcategory=" + state.selectedSubCategories.values().next().value + "&"
        }
        if(state.selectedCategories.size>0){
            query += "category=" + state.selectedCategories.values().next().value + "&"
        }
        if(state.selectedManufacturers.size>0){
            query += "manufacturer=" + state.selectedManufacturers.values().next().value + "&"
        }
        if(selectedRegion && selectedRegion.value != -1){
            query += "region=" + selectedRegion.id + "&"
        }
        query = query.slice(0, -1)
        shareLink = link + "?" + query;
    }

    function selectShareLinkInput(){
        //does not work
        let input = document.getElementById('shareLinkInput');
        input.focus();
        input.select();
    }

    function switchYearly() {
        var checkBox = document.getElementById("yearlycheck");
        yearly = checkBox.checked;
        onUpdateImpacts();
    }

    function changeLifetime() {
        hascustomlifetime = true;
        onUpdateImpacts();
        if (lifetime == 0){
            lifetime = medianlifetime;
        }
    }
</script>


<div class="flex flex-col">

        <DataGrid on:updateDataGrid={onDataGridUpdate} bind:datagridUpdateHeaders={datagridUpdateHeadersChild} bind:this={datagrid} bind:lifetime={lifetime} bind:selectedRegion={selectedRegion}/>

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
                    {#if yearly == true}
                        / {$_('pie.year')}
                    {/if}
                    </div>
                <div id="result-subtitle" class="text-sm font-light text-center text-gray-800 pl-2">
                    {#if state.selectedRows.length === 1}
                        {$_('pie.subtitle_unique_equipment',{values: {total:ratioScope.total, name:(state.selectedRows[0].manufacturer +' ' + state.selectedRows[0].name)}})}
                    {:else}
                        {#if state.selectedSubCategories.size < 3}
                            {$_('pie.subtitle_multiple_equipment_categories_details', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines), categories:new Array(...state.selectedSubCategories).join(', ')}})}
                        {:else if state.selectedCategories.size < 3}
                            {$_('pie.subtitle_multiple_equipment_types_details', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines), types:new Array(...state.selectedCategories).join(', ')}})}
                        {:else}
                            {$_('pie.subtitle_multiple_equipment_categories', {values:{number:Math.min(ratioScope.scope3.lines,ratioScope.scope2.lines)}})}
                        {/if}
                    {/if}
                </div>

            
                    <div id="result-subtitle" class="text-sm font-light text-center text-gray-600 pl-2">
                        {#if selectedRegion !== regionDefaultValue}
                            {selectedRegion.label}
                        {/if}
                        {#if lifetime}
                            {(selectedRegion !== regionDefaultValue) ? ' / ' : ''}
                            {$_('pie.lifetime')}: {lifetime} {$_('pie.year(s)')}
                        {:else if !isNaN(medianlifetime)}
                            {(selectedRegion !== regionDefaultValue) ? ' / ' : ''}
                            {$_('pie.medianlifetime')}: {medianlifetime} {$_('pie.year(s)')}
                        {/if}
                    </div>
                
                <div class="mt-2">
                    <PieChart  {ratioScope} bind:updatePieChart={pieChartUpdateChild}/>
                </div>
            {/if}
        </div>

        <div id="form-container" class="flex flex-col md:rounded-r px-5 py-5 bg-opacity-20 max-w-sm bg-teal-500" >
            <div id="title" class="text-xl mb-5 font-medium text-center">{$_('index.custom_values')}</div>
            <!-- button toggle yearly/total -->
            <div class="flex mx-auto mt-1 mb-5">
                <div class="mw-1/3 py-1 px-2">{$_('pie.total')}</div>
                <label class="mw-1/3 switch">
                    <input type="checkbox" id="yearlycheck" on:click={switchYearly}>
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
                    <RegionPicker on:updateImpacts={onUpdateImpacts} bind:value={selectedRegion} bind:updateRegionPicker={regionPickerUpdateChild} {regionDefaultValue} isDisabled="{disabledCustomValue}"/>
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
                    {#if imageUrlData}
                        <a id="viz-download" download="boavizta-gwp-by-equipment.png" href={imageUrlData} class="my-2 inline-block bg-teal-600 hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">
                            {$_('pie.download')}
                        </a>
                    {:else}
                        <button on:click={downloadImage} class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">
                            {$_('pie.exportPNG')}
                        </button>
                    {/if}
                    <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded" on:click={() => {datagrid.exportCurrentView(hascustomlifetime)}}>{$_('datagrid.export_filtered')}</button>
   
                <!--<button on:click={buildLink} class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">
                    {$_('pie.share')}
                </button>
                {#if shareLink}
                    <input id="shareLinkInput" class="" value={shareLink} on:change={selectShareLinkInput}/>
                {/if}-->
            </div>
        </div>

    </div>
</div>
</div>
