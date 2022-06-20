<script lang="ts">
    import { _, locale } from "svelte-i18n";
    import AgGridWrapper from "./_AgGridWrapper.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import FilterButton from "./_FilterButton.svelte";
    import * as Utils from "../utils";
    import type { Row } from "../customType";
    
    //export let lifetime:number; moved to upper component
    //export let medianlifetime:number; moved to upper component
    //export let selectedRegion:RegionPickerItem; moved to upper component

    /*internal state*/
    let allRows:Row[];//initial state of the grid
    let filteredRows:Row[];//filtered state of the grid

    /*pointer to internal datagrid api*/
    let _filterApi;
    const filterCategories = new Set(["Workplace", "Datacenter"]);
    const filterSubCategories = new Set(["Laptop", "Monitor", "Smartphone", "Desktop", "Server", "Tablet", "Printer"]);
    const filterManufacturers = new Set(["Apple", "Dell", "Lenovo", "HP", "Lexmark", "Seagate"]);

    let selectedCategories = new Set();
    let selectedSubCategories = new Set();
    let selectedManufacturers = new Set();

    const dispatcher = createEventDispatcher();

    function updateDataGrid(updatedRows:Row[]) {
        filteredRows=updatedRows;
        dispatcher("updateDataGrid", updatedRows);
    }

    let options = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        },
        // Label columns
        headerHeight: 25,
        enableCellTextSelection: true,
        rowSelection: "single",
        rowHeight: 25,
        //onSelectionChanged: onSelect,
        rowMultiSelectWithClick: true,
        pagination: false,
        paginationPageSize: 20,
        onFilterChanged: onFilterChanged,
    };

    function getFilterRows(filterApi) {
        //workaround because filterAPI can be unset
        if (filterApi != undefined) {
            _filterApi = filterApi;
        }

        if (_filterApi != undefined) {
            let rowData = [];
            //get selected row
            _filterApi.forEachNodeAfterFilter((node) => {
                rowData.push(node.data);
            });
            return rowData;
        } else {
            //no filter has been applied return all set
            return allRows;
        }
    }
    /* let aggridUpdateHeadersChild;
    
    function aggridUpdateHeaders(columnDefs) {
        aggridUpdateHeadersChild(columnDefs);
    }

    export function datagridUpdateHeaders() {
        columnDefs=setColDefs();
        aggridUpdateHeaders(columnDefs);
    } */


    function onFilterChanged(e) {
        filteredRows = getFilterRows(e.api);
        updateDataGrid(filteredRows);
    }

    onMount(async () => {
        allRows = await Utils.loadDataGridAsync();
        filteredRows=allRows;
        /* retrieve subcategory from query param*/
        const subcategory = new URLSearchParams(window.location.search).get('subcategory');
        updateSubcategoryFilter(subcategory);
        /* retrieve category from query param*/
        const category = new URLSearchParams(window.location.search).get('category');
        updateCategoryFilter(category);
        /* retrieve manufacturer from query param*/
        const manufacturer = new URLSearchParams(window.location.search).get('manufacturer');
        updateManufacturerFilter(manufacturer);
        updateDataGrid(allRows)
    });

    const updateSubcategoryFilter = (subcategory) => {
        //if subcategory is not part of the defined filter
         if(!filterSubCategories.has(subcategory)){
            console.log("unknow subcategory : ", subcategory)
            return;
        }

        selectedSubCategories.has(subcategory)
            ? selectedSubCategories.delete(subcategory)
            : selectedSubCategories.add(subcategory);

        const values = selectedSubCategories[Symbol.iterator]();

        //remove first element to keep only two elements
        if (selectedSubCategories.size > 2) {
            //remove first element
            const pop = values.next().value;
            selectedSubCategories.delete(pop);
        }
        //trigger reactivity
        selectedSubCategories = selectedSubCategories;
    };
    const updateCategoryFilter = (category) => {
        //if category is not part of the defined filter
         if(!filterCategories.has(category)){
            console.log("unknow category : ", category)
            return;
        }

        selectedCategories.has(category)
            ? selectedCategories.delete(category)
            : selectedCategories.add(category);

        const values = selectedCategories[Symbol.iterator]();

        //remove first element to keep only two elements
        if (selectedCategories.size > 2) {
            //remove first element
            const pop = values.next().value;
            selectedCategories.delete(pop);
        }
        //trigger reactivity
        selectedCategories = selectedCategories;
    };

    const updateManufacturerFilter = (manufacturer) => {
        //if subcategory is not part of the defined filter
         if(!filterManufacturers.has(manufacturer)){
            console.log("unknow manufacturer : ", manufacturer)
            return;
        }

        selectedManufacturers.has(manufacturer)
            ? selectedManufacturers.delete(manufacturer)
            : selectedManufacturers.add(manufacturer);

        const values = selectedManufacturers[Symbol.iterator]();

        //remove first element to keep only two elements
        if (selectedManufacturers.size > 2) {
            //remove first element
            const pop = values.next().value;
            selectedManufacturers.delete(pop);
        }
        //trigger reactivity
        selectedManufacturers = selectedManufacturers;
    };

    function resetDataGrid(e) {
        updateDataGrid(getFilterRows(e.api));
        selectedSubCategories.clear();
        selectedSubCategories = selectedSubCategories;
        selectedCategories.clear();
        selectedCategories = selectedCategories;
        selectedManufacturers.clear();
        selectedManufacturers = selectedManufacturers;
    }

    function onSelect(e) {
        if (e.detail.length > 0) {
            if (selectedSubCategories.size > 0) {
                selectedSubCategories.clear();
            }
            if (selectedCategories.size > 0) {
                selectedCategories.clear();
            }
            if (selectedManufacturers.size > 0) {
                selectedManufacturers.clear();
            }
            console.log(e.detail);
            updateDataGrid(e.detail);
        }
    }
/*
moved to upper component
export function exportCurrentView(hascustomlifetime) {
    
    const csvContent:String =  Scope.buildCsvFromFilterRows(filteredRows, lifetime, hascustomlifetime, selectedRegion);
    Utils.exportCSVToDownload(csvContent,"boavizta_exported_view_"+(new Date()).toLocaleString().replaceAll(', ','T').replaceAll('/','-').replaceAll(':','')+".csv")
}
*/



</script>

<div id="datagrid-root" class="flex flex-wrap justify-between">
    <div class="flex grow  flex-wrap my-2 space-x-0.5 > * + *	">
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-1 px-4 border rounded" on:click={resetDataGrid}>{$_('datagrid.filter_reset')}
        </button>
        <div class="inline-block flex-wrap">
            <div class="w-full text-xs pl-2 ">{$_('datagrid.manufacturer')}</div>
            <div class="inline-flex flex-wrap">
                {#each Array.from(filterManufacturers) as ManufacturerFilter}
                <FilterButton
                    filterText={ManufacturerFilter}
                    active={selectedManufacturers.has(ManufacturerFilter)}
                    onButtonClick={() => {
                        updateManufacturerFilter(ManufacturerFilter);
                    }}
                />
                {/each}
                <div class="inline-block space"></div>
            </div>
        </div>
        <div class="inline-block flex-wrap">
            <div class="w-full text-xs pl-2 ">{$_('datagrid.category')}</div>
            <div class="inline-flex flex-wrap">
                {#each Array.from(filterCategories) as categoryFilter}
                <FilterButton
                    filterText={categoryFilter}
                    active={selectedCategories.has(categoryFilter)}
                    onButtonClick={() => {
                        updateCategoryFilter(categoryFilter);
                    }}
                />
                {/each}
                <div class="inline-block space"></div>
            </div>
        </div>
        <div class="inline-block flex-wrap">
            <div class="w-full text-xs pl-2 ">{$_('datagrid.subcategory')}</div>
            <div class="inline-flex flex-wrap">
                {#each Array.from(filterSubCategories) as subcategoryFilter}
                <FilterButton
                    filterText={subcategoryFilter}
                    active={selectedSubCategories.has(subcategoryFilter)}
                    onButtonClick={() => {
                        updateSubcategoryFilter(subcategoryFilter);
                    }}
                />
                {/each}
            </div>
        </div>
    </div>
</div>

<AgGridWrapper
    {options}
    data={allRows}
    on:select={onSelect}
    {selectedSubCategories}
    {selectedManufacturers}
    {selectedCategories}
/>
