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
            width: 80,
        },
        {
            field: "added_date",
            hide: true,
            width: 100,
        },
        {
            field: "sources",
            //hide: true,
            filter: false,
            width: 80,
            cellRenderer: function (params) {
                return (
                  `<a target="_blank" href="${params.value}">
                      <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="16" height="16px"><path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"/>
                        </svg>
                  </a>`
                    
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
