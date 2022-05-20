<script lang="ts">
    import { _ } from "svelte-i18n";
    import AgGridWrapper from "./AgGridWrapper.svelte";
    import Papa from "papaparse";
    import { createEventDispatcher, onMount } from "svelte";
    import FilterButton from "./FilterButton.svelte";

    /*internal state*/
    let rows;

    /*pointer to internal datagrid api*/
    let _filterApi;
    //const filterCategories = ["Workplace", "Datacenter"];
    const filterSubcategories = new Set(["Laptop", "Monitor", "Smartphone", "Desktop", "Server", "Thin Client", "Tablet", "Hard drive", "SAN/NAS", "Printer", "Workstation"]);

    //let selectedCategories = new Set();
    let selectedSubcategories = new Set();

    const dispatcher = createEventDispatcher();

    function updateDataGrid(rows) {
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
        let filterRows = getFilterRows(e.api);
        updateDataGrid(filterRows);
    }

    /* const updateCategoryFilter = (category) => {
        selectedCategories.has(category)
            ? selectedCategories.delete(category)
            : selectedCategories.add(category);
        //trigger reactivity
        selectedCategories = selectedCategories;
    }; */

    onMount(async () => {
        rows = await loadDataGridAsync();
        /* retrieve subcategory from query param*/
        const subcategory = new URLSearchParams(window.location.search).get('subcategory');
        updateSubcategoryFilter(subcategory);
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

    function onSelect(e) {
        //console.log(e)
        if (e.detail.length == 0) {
            //selection is empty, return full data
            updateDataGrid(getFilterRows(e.api));
        } else {
            //return selection
            updateDataGrid(e.detail);
        }
    }

</script>

<!-- <div class="flex-row">
    {#each filterCategories as filterCategory}
        <FilterButton
            filterText={filterCategory}
            active={selectedCategories.has(filterCategory)}
            onButtonClick={() => {
                updateCategoryFilter(filterCategory);
            }}
        />
    {/each}
</div> -->

<div class="flex justify-between">
    <div class="flex grow  my-2 space-x-0.5 > * + *	">
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
        <a href="/boavizta-data-us.csv" class="link my-4">{$_('datagrid.export_all')}</a>
    </div>
</div>

<AgGridWrapper
    {options}
    data={rows}
    {columnDefs}
    on:select={onSelect}
    {selectedSubcategories}
/>
