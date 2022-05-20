<script lang="ts">
  import Select from "svelte-select"
  import {onMount} from "svelte";
  import Papa from "papaparse";

  let items;
  export let regionDefaultValue;
  export let value = regionDefaultValue;
  export let isDisabled;

  onMount(async () => {
    const res = await fetch("./electrical_foot_print.csv");
    const text = await res.text();
    items = toSelectItems(text)
    /* retrieve region from query param */ 
    const region = new URLSearchParams(window.location.search).get('region');
    value = items && items.find(o => o.id === region) || regionDefaultValue;
  });


  function toSelectItems(csv) {
    const csvParsed = Papa.parse(csv, {header: true, dynamicTyping: true})
    const rowData = csvParsed.data;
    const selectItems = []
    selectItems.push(regionDefaultValue)
    return selectItems.concat(rowData.map((row) => {
      return {
        id : row['country'].toLowerCase(),
        label: row['country'] + " - " + row['year']+ " - " + row['gwp_emission_factor'] + "kgCO2e/kWh",
        value: row['gwp_emission_factor']
      }
    }))
  }


</script>

<Select {items} bind:value={value} containerClasses="border border-1 rounded-r px-2 py-2 w-full" isDisabled="{isDisabled}" />

