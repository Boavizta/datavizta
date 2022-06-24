<script lang="ts">
    import { _ } from "svelte-i18n";
    import AgGridWrapper from "./_AgGridWrapper.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import FilterButton from "./_FilterButton.svelte";
    import * as Utils from "../utils";
    import type { Row,FlatFilterModel, FilterModel } from "../customType";
    import * as ParamParser from "../paramParser";

    //export let lifetime:number; moved to upper component
    //export let medianlifetime:number; moved to upper component
    //export let selectedRegion:RegionPickerItem; moved to upper component

    /*internal state*/
    let allRows:Row[];//initial state of the grid
    let filteredRows:Row[];//filtered state of the grid

    /*pointer to internal datagrid api*/
    let _filterApi;

    /* filter buttons*/
    const filterCategoriesDefinition = new Set(["Workplace", "Datacenter"]);
    const filterSubCategoriesDefinition = new Set(["Laptop", "Monitor", "Smartphone", "Desktop", "Server", "Tablet", "Printer"]);
    const filterManufacturersDefinition = new Set(["Apple", "Dell", "Lenovo", "HP", "Lexmark", "Seagate"]);

    /* selected filter buttons */
    //let filterCategoriesSelected = new Set();
    //let filterSubCategoriesSelected = new Set();
    //let filterManufacturersSelected = new Set();
    let currentFilterModel:FlatFilterModel = {}; //{category=[cat1], subcategory=[sub1, sub2]}

    const dispatcher = createEventDispatcher();

    function updateDataGrid(updatedRows:Row[], filterModels:FlatFilterModel) {
        filteredRows=updatedRows;
        dispatcher("updateDataGrid", {"updatedRows":updatedRows, "filterModels":filterModels});
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


    //todo : should be in child components?
    function onFilterChanged(e) {
        filteredRows = getFilterRows(e.api);
        const filterModels:FilterModel = e.api.getFilterModel(); 
        updateDataGrid(filteredRows, ParamParser.flatten(filterModels));
    }

    onMount(async () => {
        allRows = await Utils.loadDataGridAsync();
        filteredRows=allRows;
        /* retrieve subcategory from query param*/
        //const subcategory = new URLSearchParams(window.location.search).get('subcategory');
        //updateSubcategoryFilter(subcategory);
        /* retrieve category from query param*/
        //const category = new URLSearchParams(window.location.search).get('category');
        //updateCategoryFilter(category);
        /* retrieve manufacturer from query param*/
        //onst manufacturer = new URLSearchParams(window.location.search).get('manufacturer');
        //updateManufacturerFilter(manufacturer);

        //const filterModels = ParamParser.parseFilter(new URLSearchParams(window.location.search));
        currentFilterModel = ParamParser.parseFlatFilter(new URLSearchParams(window.location.search)) || {};
        updateDataGrid(allRows, currentFilterModel)
    });

    const updateCurrentFilter = (filterName, filterValue, fitlerDefinition)=>{
        //if filterValue is not part of the filterDefinition
        if(!fitlerDefinition.has(filterValue)){
            console.log("unknow filter value : ", filterValue)
            return;
        }
        
        //if filterName does not exists yet in filterModel
        if(!(filterName in currentFilterModel)){
            currentFilterModel[filterName] = [filterValue];
        }else{
            const currentFilterValue:Set<String> = new Set(currentFilterModel[filterName]);
            
            //if exists, remove it
            currentFilterValue.has(filterValue)
                ? currentFilterValue.delete(filterValue)
                : currentFilterValue.add(filterValue);
            
            //remove first element to keep only two elements
            if (currentFilterValue.size > 2) {
                //remove first element
                const values = currentFilterValue[Symbol.iterator]();
                const pop = values.next().value;
                currentFilterValue.delete(pop);
        }

            currentFilterModel[filterName] = Array.from(currentFilterValue);
        }
        //trigger reactivity
        currentFilterModel = currentFilterModel;

        //update buttons
    }

    /* const updateSubcategoryFilter = (subcategory) => {
        //if subcategory is not part of the defined filter
         if(!filterSubCategories.has(subcategory)){
            console.log("unknow subcategory : ", subcategory)
            return;
        }
        
        filterSubCategoriesSelected.has(subcategory)
            ? filterSubCategoriesSelected.delete(subcategory)
            : filterSubCategoriesSelected.add(subcategory);

        const values = filterSubCategoriesSelected[Symbol.iterator]();

        //remove first element to keep only two elements
        if (filterSubCategoriesSelected.size > 2) {
            //remove first element
            const pop = values.next().value;
            filterSubCategoriesSelected.delete(pop);
        }
        //trigger reactivity
        filterSubCategoriesSelected = filterSubCategoriesSelected;
    };
    const updateCategoryFilter = (category) => {
        //if category is not part of the defined filter
         if(!filterCategories.has(category)){
            console.log("unknow category : ", category)
            return;
        }

        filterCategoriesSelected.has(category)
            ? filterCategoriesSelected.delete(category)
            : filterCategoriesSelected.add(category);

        const values = filterCategoriesSelected[Symbol.iterator]();

        //remove first element to keep only two elements
        if (filterCategoriesSelected.size > 2) {
            //remove first element
            const pop = values.next().value;
            filterCategoriesSelected.delete(pop);
        }
        //trigger reactivity
        filterCategoriesSelected = filterCategoriesSelected;
    };

    const updateManufacturerFilter = (manufacturer) => {
        //if subcategory is not part of the defined filter
         if(!filterManufacturers.has(manufacturer)){
            console.log("unknow manufacturer : ", manufacturer)
            return;
        }

        filterManufacturersSelected.has(manufacturer)
            ? filterManufacturersSelected.delete(manufacturer)
            : filterManufacturersSelected.add(manufacturer);

        const values = filterManufacturersSelected[Symbol.iterator]();

        //remove first element to keep only two elements
        if (filterManufacturersSelected.size > 2) {
            //remove first element
            const pop = values.next().value;
            filterManufacturersSelected.delete(pop);
        }
        //trigger reactivity
        filterManufacturersSelected = filterManufacturersSelected;
    }; */

    function resetCurrentFilterModel(){
        //should empty current filter models
        for(const filter in currentFilterModel){
            currentFilterModel[filter] = [];
        }
    }

    function resetDataGrid(e) {
        
        resetCurrentFilterModel()
        updateDataGrid(getFilterRows(e.api), currentFilterModel);

       /*  filterSubCategoriesSelected.clear();
        filterSubCategoriesSelected = filterSubCategoriesSelected;
        filterCategoriesSelected.clear();
        filterCategoriesSelected = filterCategoriesSelected;
        filterManufacturersSelected.clear();
        filterManufacturersSelected = filterManufacturersSelected; */
    }

    function onSelect(e) {
        if (e.detail.length > 0) {

/*             if (filterSubCategoriesSelected.size > 0) {
                filterSubCategoriesSelected.clear();
            }
            if (filterCategoriesSelected.size > 0) {
                filterCategoriesSelected.clear();
            }
            if (filterManufacturersSelected.size > 0) {
                filterManufacturersSelected.clear();
            } */
            //resetCurrentFilterModel()
            updateDataGrid(e.detail, currentFilterModel);

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
                {#each Array.from(filterManufacturersDefinition) as ManufacturerFilter}
                <FilterButton
                    filterText={ManufacturerFilter}
                    active={currentFilterModel["manufacturer"] && currentFilterModel["manufacturer"].includes(ManufacturerFilter)}
                    onButtonClick={() => {
                        //updateManufacturerFilter(ManufacturerFilter);
                        updateCurrentFilter("manufacturer", ManufacturerFilter, filterManufacturersDefinition)

                    }}
                />
                {/each}
                <div class="inline-block space"></div>
            </div>
        </div>
        <div class="inline-block flex-wrap">
            <div class="w-full text-xs pl-2 ">{$_('datagrid.category')}</div>
            <div class="inline-flex flex-wrap">
                {#each Array.from(filterCategoriesDefinition) as categoryFilter}
                <!-- <FilterButton
                    filterText={categoryFilter}
                    active={filterCategoriesSelected.has(categoryFilter)}
                    onButtonClick={() => {
                        //updateCategoryFilter(categoryFilter);
                        updateCurrentFilter("category", categoryFilter, filterCategories)
                    }}
                /> -->
                <FilterButton
                    filterText={categoryFilter}
                    active={currentFilterModel["category"] && currentFilterModel["category"].includes(categoryFilter)}
                    onButtonClick={() => {
                        //updateCategoryFilter(categoryFilter);
                        updateCurrentFilter("category", categoryFilter, filterCategoriesDefinition)
                    }}
                />
                {/each}
                <div class="inline-block space"></div>
            </div>
        </div>
        <div class="inline-block flex-wrap">
            <div class="w-full text-xs pl-2 ">{$_('datagrid.subcategory')}</div>
            <div class="inline-flex flex-wrap">
                {#each Array.from(filterSubCategoriesDefinition) as subcategoryFilter}
                <FilterButton
                    filterText={subcategoryFilter}
                    active={currentFilterModel["subcategory"] && currentFilterModel["subcategory"].includes(subcategoryFilter)}
                    onButtonClick={() => {
                        //updateSubcategoryFilter(subcategoryFilter);
                        updateCurrentFilter("subcategory", subcategoryFilter, filterSubCategoriesDefinition)

                    }}
                />
                {/each}
            </div>
        </div>
    </div>
</div>

<!-- <AgGridWrapper
    {options}
    data={allRows}
    on:select={onSelect}
    selectedSubCategories={filterSubCategoriesSelected}
    selectedManufacturers={filterManufacturersSelected}
    selectedCategories={filterCategoriesSelected}
/> -->
<AgGridWrapper
    {options}
    data={allRows}
    on:select={onSelect}
    flatFilterModels={currentFilterModel}
/>