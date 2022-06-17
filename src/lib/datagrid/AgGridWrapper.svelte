<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-community/dist/styles/ag-grid.css";
  import "ag-grid-community/dist/styles/ag-theme-alpine.css";
  import type { Row } from "./customType";

  const dispatch = createEventDispatcher();

  export let columnDefs;
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
  
  export let selectedSubCategories:string[];
  export let selectedCategories:string[];
  export let selectedManufacturers:string[];

  $: filterBySubcategories(selectedSubCategories);
  function filterBySubcategories(subcategories) {
    if(api == undefined){
      return;
    }
    const values = subcategories[Symbol.iterator]();
    const text1 = values.next().value;

    const containsOr = {
      filterType: "text",
      operator: "OR",
      condition1: {
        filterType: "text",
        type: "contains",
        filter: text1,
      },
      condition2: {}
    };
    if (subcategories.size > 1) {
      const text2 = values.next().value;

      containsOr.condition2 = {
        filterType: "text",
        type: "contains",
        filter: text2,
      };
    }
    // get filter instance
    api.getFilterInstance("subcategory").setModel(containsOr);

    // refresh rows based on the filter (not automatic to allow for batching multiple filters)
    api.onFilterChanged();
  }

  $: filterBycategories(selectedCategories);
  function filterBycategories(categories) {
    if(api == undefined){
      return;
    }
    const values = categories[Symbol.iterator]();
    const text1 = values.next().value;

    const containsOr = {
      filterType: "text",
      operator: "OR",
      condition1: {
        filterType: "text",
        type: "contains",
        filter: text1,
      },
      condition2: {}
    };
    if (categories.size > 1) {
      const text2 = values.next().value;

      containsOr.condition2 = {
        filterType: "text",
        type: "contains",
        filter: text2,
      };
    }
    // get filter instance
    api.getFilterInstance("category").setModel(containsOr);

    // refresh rows based on the filter (not automatic to allow for batching multiple filters)
    api.onFilterChanged();
  }

  $: filterByManufacturers(selectedManufacturers);
  function filterByManufacturers(manufacturers) {
    if(api == undefined){
      return;
    }
    const values = manufacturers[Symbol.iterator]();
    const text1 = values.next().value;

    const containsOr = {
      filterType: "text",
      operator: "OR",
      condition1: {
        filterType: "text",
        type: "contains",
        filter: text1,
      },
      condition2: {}
    };
    if (manufacturers.size > 1) {
      const text2 = values.next().value;

      containsOr.condition2 = {
        filterType: "text",
        type: "contains",
        filter: text2,
      };
    }
    // get filter instance
    api.getFilterInstance("manufacturer").setModel(containsOr);

    // refresh rows based on the filter (not automatic to allow for batching multiple filters)
    api.onFilterChanged();
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

  const updateData = (data) => {
    /* 
    does not work on safari, onGridReady is launched after first update
    if (grid && api) {
      api.setRowData(data);
      api.setColumnDefs(columnDefs);
    } */
    if (grid) {
      grid.gridOptions.api.setRowData(data);
      grid.gridOptions.api.setColumnDefs(columnDefs);
    }
  };

  onMount(async () => {
    let dataInit:Row[];
    /* if (!!data && typeof data.then === "function") {
      dataInit = await data();
    } else {
      dataInit = data;
    } */
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
  export function aggridUpdateHeaders(columnDefs) {
    if (grid) {
      grid.gridOptions.api.setColumnDefs(columnDefs);
    }
  }
  $: updateData(data);
</script>

<div class="ag_container">
  <div
    bind:this={ref}
    style="height: 100%; width:100%"
    class="ag-theme-alpine"
  />
</div>
