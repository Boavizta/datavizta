<script lang="ts">
    import { _ } from "svelte-i18n";
    import AgGridWrapper from "./AgGridWrapper.svelte";
    import Papa from "papaparse";
    import { createEventDispatcher, onMount } from "svelte";
    import FilterButton from "./FilterButton.svelte";
    import * as Utils from "./utils";
    import * as Scope from "./impacts";

    export let lifetime;
    export let selectedRegion;

    /*internal state*/
    let rows;
    let filteredRows;

    /*pointer to internal datagrid api*/
    let _filterApi;
    //const filterCategories = ["Workplace", "Datacenter"];
    const filterSubcategories = new Set(["Laptop", "Monitor", "Smartphone", "Desktop", "Server", "Thin Client", "Tablet", "Hard drive", "SAN/NAS", "Printer", "Workstation"]);

    //let selectedCategories = new Set();
    let selectedSubcategories = new Set();

    const dispatcher = createEventDispatcher();

    function updateDataGrid(rows) {
        filteredRows=rows;
        dispatcher("updateDataGrid", rows);
    }

    const loadDataGridAsync = async () => {
        try {
            const res = await fetch("/boavizta-data-us.csv");
            //console.log(`loadDataGrid, res ${JSON.stringify(res).slice(0,10)}`)
            const text = await res.text();
            //console.log(`loadDataGrid, text ${JSON.stringify(text).slice(0,10)}`)
            const csvParsed = Papa.parse(text, {
                header: true,
                dynamicTyping: true,
            });
            const rowData = csvParsed.data;
            rowData.shift();
            filteredRows=rowData;
            return rowData;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const columnDefs = [
        {
            headerName: $_("datagrid.manufacturer"),
            field: "manufacturer",
            width: 100,
        },
        {
            headerName: $_("datagrid.name"),
            field: "name",
            width: 300,
        },
        {
            headerName: $_("datagrid.category"),
            field: "category",
            width: 100,
        },
        {
            headerName: $_("datagrid.subcategory"),
            field: "subcategory",
            width: 100,
        },
        {
            headerName: $_("datagrid.report_date"),
            field: "report_date",
            hide: false,
            width: 120,
        },
        {
            headerName: $_("datagrid.total"),
            field: "gwp_total",
            filter: false,
            hide: true,
            width: 100,
        },
        {
            headerName: $_("datagrid.use"),
            field: "gwp_use_ratio",
            filter: false,
            hide: true,
            width: 100,
        },
        {
            headerName: $_("datagrid.manufacturing"),
            field: "gwp_manufacturing_ratio",
            filter: false,
            hide: true,
            width: 100,
        },
        {
            headerName: $_("datagrid.yearlyTec"),
            field: "yearly_tec",
            hide: true,
            filter: false,
            width: 100,
        },
        {
            headerName: $_("datagrid.use_location"),
            field: "use_location",
            hide: false,
            width: 100,
        },
        {
            headerName: $_("datagrid.lifetime"),
            field: "lifetime",
            //hide: true,
            filter: false,
            width: 120,
        },
        {
            field: "added_date",
            hide: true,
            width: 100,
        },
        {
            field: "sources",
            //hide: true,
            width: 400,
            cellRenderer: function (params) {
                return (
                    '<a target="_blank" href="' +
                    params.value +
                    '">' +
                    params.value +
                    "</a>"
                );
            },
        },
        {
            field: "gwp_error_ratio",
            hide: true,
            filter: "agNumberColumnFilter",
            width: 100,
        },
        {
            field: "weight",
            hide: true,
            filter: "agNumberColumnFilter",
            width: 100,
        },
        {
            field: "assembly_location",
            hide: true,
            width: 100,
        },
        {
            field: "screen_size",
            hide: true,
            filter: "agNumberColumnFilter",
            width: 100,
        },
        {
            field: "server_type",
            hide: true,
            width: 100,
        },
        {
            field: "hard_drive",
            hide: true,
            width: 100,
        },
        {
            field: "memory",
            hide: true,
            filter: "agNumberColumnFilter",
            width: 100,
        },
        {
            field: "number_cpu",
            hide: true,
            filter: "agNumberColumnFilter",
            width: 100,
        },
    ];

    let options = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        },
        // Label columns
        headerHeight: 25,
        enableCellTextSelection: true,
        //columnDefs: columnDefs,
        rowSelection: "single",
        rowHeight: 25,
        //onSelectionChanged: onSelect,
        rowMultiSelectWithClick: true,
        pagination: false,
        paginationPageSize: 20,
        //rowData: data,
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
            //console.log(rowData)
            return rowData;
        } else {
            //no filter has been applied return all set
            return rows;
        }
    }

    function onFilterChanged(e) {
        //console.log(e)
        filteredRows = getFilterRows(e.api);
        updateDataGrid(filteredRows);
    }

    /* const updateCategoryFilter = (category) => {
        selectedCategories.has(category)
            ? selectedCategories.delete(category)
            : selectedCategories.add(category);
        //trigger reactivity
        selectedCategories = selectedCategories;
    }; */

    onMount(async () => {
        console.log("onMount Datagrid");
        rows = await loadDataGridAsync();
        /* retrieve subcategory from query param*/
        const subcategory = new URLSearchParams(window.location.search).get('subcategory');
        updateSubcategoryFilter(subcategory);
        updateDataGrid(rows)
    });

    const updateSubcategoryFilter = (subcategory) => {
        //if subcategory is not part of the defined filter
         if(!filterSubcategories.has(subcategory)){
            console.log("unknow subcategory : ", subcategory)
            return;
        }

        selectedSubcategories.has(subcategory)
            ? selectedSubcategories.delete(subcategory)
            : selectedSubcategories.add(subcategory);

        const values = selectedSubcategories[Symbol.iterator]();

        //remove first element to keep only two elements
        if (selectedSubcategories.size > 1) {
            //remove first element
            const pop = values.next().value;
            selectedSubcategories.delete(pop);
        }
        //trigger reactivity
        selectedSubcategories = selectedSubcategories;
    };

    function resetDataGrid(e) {
        updateDataGrid(getFilterRows(e.api));
        selectedSubcategories.clear();
        selectedSubcategories = selectedSubcategories;
    }

    function onSelect(e) {
        if (e.detail.length > 0) {
            updateDataGrid(e.detail);
        }
    }

    function exportCurrentView() {
        let csvContent = "data:text/csv;charset=utf-8,";
        
        filteredRows.forEach(row => {
            let scope3 = Scope.impactScope3byRow(row).scope3;
            if (scope3 != 0) {
                row.scope3=scope3;
            } else {
                row.scope3='';
            }
            let scope2=Scope.impactScope2ByRow(row,lifetime,selectedRegion.value);
            if (scope2 != 0) {
                row.scope2=scope2;
            } else {
                row.scope2='';
            }
            if (lifetime != undefined) {
                row.lifetimeoverride=lifetime;
            } else {
                row.lifetimeoverride='';
            }
            if (selectedRegion.value !== -1) {
                row.regionlabel=selectedRegion.label;
                row.electricalImpactFactor=selectedRegion.value;
            } else {
                row.regionlabel='';
                row.electricalImpactFactor='';
            }
        });

        const headers = Object.keys(filteredRows[0]);
        csvContent += headers.join(',')+"\r\n";
        csvContent += Utils.convertToCSV(filteredRows);

        Utils.exportCSVToDownload(csvContent,"boavizta_exported_view_"+(new Date()).toLocaleString().replaceAll(', ','T').replaceAll('/','-').replaceAll(':','')+".csv")

    }



</script>

<div class="flex flex-wrap justify-between">
    <div class="flex grow  flex-wrap my-2 space-x-0.5 > * + *	">
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-1 px-4 border rounded" on:click={resetDataGrid}>{$_('datagrid.filter_reset')}
        </button>
        {#each Array.from(filterSubcategories) as subcategoryFilter}
        <FilterButton
            filterText={subcategoryFilter}
            active={selectedSubcategories.has(subcategoryFilter)}
            onButtonClick={() => {
                updateSubcategoryFilter(subcategoryFilter);
            }}
        />
    {/each}
    </div>
    <div class="flex shrink">
        <button class="link my-4 ml-2" on:click={() => {exportCurrentView()}}>{$_('datagrid.export_filtered')}</button>
    </div>
</div>

<AgGridWrapper
    {options}
    data={rows}
    {columnDefs}
    on:select={onSelect}
    {selectedSubcategories}
/>
