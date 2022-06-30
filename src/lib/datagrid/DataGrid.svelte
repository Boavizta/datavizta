<script lang="ts">
    import { _ } from "svelte-i18n";
    import AgGridWrapper from "./_AgGridWrapper.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import FilterButton from "./_FilterButton.svelte";
    import * as Utils from "../utils";
    import type { Row,FlatFilterModel, FilterModel } from "../customType";
    import * as ParamParser from "../paramParser";

    /*internal state*/
    let allRows:Row[];//initial state of the grid
    let filteredRows:Row[];//filtered state of the grid

    /*pointer to internal datagrid api*/
    let _filterApi;

    /* filter buttons*/
    const filterCategoriesDefinition = new Set(["Workplace", "Datacenter"]);
    const filterSubCategoriesDefinition = new Set(["Laptop", "Monitor", "Smartphone", "Desktop", "Server", "Tablet", "Printer"]);
    const filterManufacturersDefinition = new Set(["Apple", "Dell", "Lenovo", "HP", "Lexmark", "Samsung", "Seagate"]);

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

    //todo : should be in child components?
    function onFilterChanged(e) {
        filteredRows = getFilterRows(e.api);
        const filterModels:FilterModel = e.api.getFilterModel(); 
        updateDataGrid(filteredRows, ParamParser.flatten(filterModels));
    }

    onMount(async () => {
        allRows = await Utils.loadDataGridAsync();
        filteredRows=allRows;
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

    function resetCurrentFilterModel(){
        //should empty current filter models
        for(const filter in currentFilterModel){
            currentFilterModel[filter] = [];
        }
    }

    function resetDataGrid(e) {
        
        resetCurrentFilterModel()
        updateDataGrid(getFilterRows(e.api), currentFilterModel);
    }

    function onSelect(e) {
        if (e.detail.length > 0) {
            updateDataGrid(e.detail, currentFilterModel);
        }
    }
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
                <FilterButton
                    filterText={categoryFilter}
                    active={currentFilterModel["category"] && currentFilterModel["category"].includes(categoryFilter)}
                    onButtonClick={() => {
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

<AgGridWrapper
    {options}
    data={allRows}
    on:select={onSelect}
    flatFilterModels={currentFilterModel}
/>