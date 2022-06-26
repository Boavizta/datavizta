<script lang="ts">
  import { _,locale} from "svelte-i18n";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-community/dist/styles/ag-grid.css";
  import "ag-grid-community/dist/styles/ag-theme-alpine.css";
  import type { Row,FlatFilterModel,FilterModel } from "../customType";
  import * as ParamParser from "../paramParser";

  const dispatch = createEventDispatcher();

  let columnDefs = buildColumnDefs();
  
  export let data:Row[];
  export let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    suppressFieldDotNotation: true,
    rowSelection: "multiple",
  };

  export let flatFilterModels:FlatFilterModel = {};

  $ :{
    
    const filterModel:FilterModel = ParamParser.buildFilterModels(flatFilterModels);
    for(const filterkey in filterModel){
      if(grid){
        // get filter instance
        api.getFilterInstance(filterkey).setModel(filterModel[filterkey]);
    
        // refresh rows based on the filter (not automatic to allow for batching multiple filters)
        api.onFilterChanged();
      }
    }
  }

  export let loading = false;

  let ref;
  let grid;
  let api;

  const onSelectionChanged = () => {
    const selectedRows = api.getSelectedRows();
    dispatch("select", selectedRows);
  };

  const onGridReady = () => {
    api = grid.gridOptions.api;
    if (loading) api.showLoadingOverlay();
  };

  function buildColumnDefs(){
    return[
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
  }

  const updateData = (data) => {
    if (grid) {
      grid.gridOptions.api.setRowData(data);
      grid.gridOptions.api.setColumnDefs(columnDefs);
    }
  };

  onMount(async () => {
    let dataInit:Row[];
    dataInit = data;
    grid = new Grid(ref, {
      ...options,
      columnDefs,
      rowData: dataInit,
      onGridReady,
      onSelectionChanged,
    });
  });

  onDestroy(() => {
    if (grid) {
      grid.destroy();
    }
  });

  $:{
        //reactivity, executed on locale updates
        console.log($locale); // do not remove. Workaround to ensure locale is loaded when grid headers are translated
        if (grid) {
          columnDefs = buildColumnDefs()
          grid.gridOptions.api.setColumnDefs(columnDefs);
        }
    }
  $: updateData(data);
</script>

<div class="ag_container" id="aggridwrapper-root">
  <div
    bind:this={ref}
    style="height: 100%; width:100%"
    class="ag-theme-alpine"
  />
</div>
