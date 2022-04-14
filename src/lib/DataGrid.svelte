<script lang="ts">
    import { _ } from 'svelte-i18n';
    import AgGridWrapper from "./AgGridWrapper.svelte";
    import Papa from "papaparse";
    import {createEventDispatcher, onMount} from "svelte";
    let dataInit;
    let _filterApi;
    const dispatcher = createEventDispatcher();

    function updateDataGrid(rows){
        dispatcher('updateDataGrid',rows)
    }

    const loadDataGridAsync = async () => {
        try {

            const res = await fetch("/boavizta-data-us.csv");
            console.log(`loadDataGrid, res ${JSON.stringify(res).slice(0,10)}`)
            const text = await res.text();
            console.log(`loadDataGrid, text ${JSON.stringify(text).slice(0,10)}`)
            const csvParsed = Papa.parse(text,{header:true, dynamicTyping: true})
            const rowData = csvParsed.data;
            rowData.shift();
            return rowData;
        } catch (error) {
            console.error(error)
            return [];
        }
    }

    const columnDefs = [{
            headerName: $_('datagrid.manufacturer'),
            field: "manufacturer",
            width: 100
        },
        {
            headerName: $_('datagrid.name'),
            field: "name",
            width: 300
        },
        {
            headerName: $_('datagrid.category'),
            field: "category",
            width: 100
        },
        {
            headerName: $_('datagrid.subcategory'),
            field: "subcategory",
            width: 100
        },
        {
            headerName: $_('datagrid.report_date'),
            field: "report_date",
            hide: false,
            width: 120
        },
        {
            headerName: $_('datagrid.total'),
            field: "gwp_total",
            filter: false,
            width: 100
        },
        {
            headerName: $_('datagrid.use'),
            field: "gwp_use_ratio",
            filter: false,
            width: 100
        },
        {
            headerName: $_('datagrid.manufacturing'),
            field: "gwp_manufacturing_ratio",
            filter: false,
            width: 100
        },
        {
            headerName: $_('datagrid.yearlyTec'),
            field: "yearly_tec",
            hide: false,
            filter: false,
            width: 100
        },
        {
            headerName: $_('datagrid.use_location'),
            field: "use_location",
            hide: false,
            width: 100
        },
        {
            headerName: $_('datagrid.lifetime'),
            field: "lifetime",
            //hide: true,
            filter: false,
            width: 120,
        },
        {
            field: "added_date",
            hide: true,
            width: 100
        },
        {
            field: "sources",
            //hide: true,
            width: 100,
            cellRenderer: function(params){
                return '<a target="_blank" href="'+params.value+'">'+params.value+'</a>';
            }
        },
        {
            field: "gwp_error_ratio",
            hide: true,
            filter: 'agNumberColumnFilter',
            width: 100
        },
        {
            field: "weight",
            hide: true,
            filter: 'agNumberColumnFilter',
            width: 100
        },
        {
            field: "assembly_location",
            hide: true,
            width: 100
        },
        {
            field: "screen_size",
            hide: true,
            filter: 'agNumberColumnFilter',
            width: 100
        },
        {
            field: "server_type",
            hide: true,
            width: 100
        },
        {
            field: "hard_drive",
            hide: true,
            width: 100
        },
        {
            field: "memory",
            hide: true,
            filter: 'agNumberColumnFilter',
            width: 100
        },
        {
            field: "number_cpu",
            hide: true,
            filter: 'agNumberColumnFilter',
            width: 100
        }
    ];

    let options = {
        defaultColDef: {
            sortable: true,
            filter: true,
            resizable: true,
        },
        // Label columns
        headerHeight: 25,
        //columnDefs: columnDefs,
        rowSelection: 'single',
        rowHeight: 25,
        //onSelectionChanged: onSelect,
        rowMultiSelectWithClick: true,
        pagination: false,
        paginationPageSize:20,
        //rowData: data,
        onFilterChanged: onFilterChanged
    };

    function getFilterRows(filterApi){
        if(filterApi != undefined){
            _filterApi = filterApi
        }

        if(_filterApi != undefined){
            let rowData = [];
            //get selected row
            _filterApi.forEachNodeAfterFilter(node => {
                rowData.push(node.data);
            });
            //console.log(rowData)
            return rowData;
        }else{
            //no filter has been applied return all set
            return dataInit
        }
    }

    function onFilterChanged(e){
        //console.log(e)
        let filterRows = getFilterRows(e.api)
        updateDataGrid(filterRows);
    }



    onMount(async () => {
        dataInit = await loadDataGridAsync()
        console.log(`onMount, dataInit ${JSON.stringify(dataInit).slice(0,10)}`)
        updateDataGrid(dataInit)
    });

    function onSelect(e){
        //console.log(e)
        if(e.detail.length == 0){
            //selection is empty, return full data
            updateDataGrid(getFilterRows(e.api))
        }else{
            //return selection
            updateDataGrid(e.detail)
        }
    }

</script>


<!--<AgGrid {options} data="{dataInit}" {columnDefs} on:select={onSelect} theme="material" /> does not work, bug?-->
<AgGridWrapper {options} data="{dataInit}" columnDefs="{columnDefs}" on:select={onSelect}/>


