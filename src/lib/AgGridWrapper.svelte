<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-community/dist/styles/ag-grid.css";
  import "ag-grid-community/dist/styles/ag-theme-alpine.css";

  const dispatch = createEventDispatcher();

  export let columnDefs;
  export let data;
  export let theme = "alpine";
  export let options = {
    defaultColDef: {
      flex: 1,
      minWidth: 150,
      filter: true,
    },
    suppressFieldDotNotation: true,
    rowSelection: "multiple",
  };
  
  export let selectedSubCategories;
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

  export let selectedCategories;
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

  export let selectedManufacturers;
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

  let themeUrl = `https://unpkg.com/ag-grid-community/dist/styles/ag-theme-${theme}.css`;
  let ref;
  let grid;
  let api;

  const onSelectionChanged = () => {
    const selectedRows = api.getSelectedRows();
    dispatch("select", selectedRows);
  };

  const onGridReady = () => {
    console.log("onGridReady", grid);
    api = grid.gridOptions.api;
    if (loading) api.showLoadingOverlay();
  };

  const updateData = (data) => {
    console.log("updateData", grid, api);
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
    let dataInit;
    if (!!data && typeof data.then === "function") {
      dataInit = await data();
    } else {
      dataInit = data;
    }
    console.log("onMount AgGridWrapper", dataInit);
    grid = new Grid(ref, {
      ...options,
      columnDefs,
      rowData: dataInit,
      onGridReady,
      //onCellValueChanged,
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
    console.log("Aggrid headers :",columnDefs)
  }
  $: updateData(data);
</script>

<svelte:head>
  {#if theme !== "alpine" && !Object.values(document.styleSheets).some((styleSheet) => styleSheet.href === themeUrl)}
    <link rel="stylesheet" href={themeUrl} />
  {/if}
</svelte:head>

<div class="ag_container">
  <div
    bind:this={ref}
    style="height: 100%; width:100%"
    class="ag-theme-{theme}"
  />
</div>

<style>
  .ag_container {
    width: 100%;
    height: var(--grid-height, 300px);
  }
</style>
