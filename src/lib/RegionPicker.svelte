<script lang="ts">
  import Select from "svelte-select"
  import {onMount} from "svelte";
  import Papa from "papaparse";

  let items;
  export let value;
  export let regionDefaultValue;

  onMount(async () => {
    //console.log("RegionPicker onMount")
    const res = await fetch("./electrical_foot_print.csv");
    const text = await res.text();
    items = toSelectItems(text)
    //console.log(items)
    value = regionDefaultValue
  });


  function toSelectItems(csv) {
    const csvParsed = Papa.parse(csv, {header: true, dynamicTyping: true})
    const rowData = csvParsed.data;
    const selectItems = []
    selectItems.push(regionDefaultValue)
    return selectItems.concat(rowData.map((row) => {
      return {
        label: row['country'],
        value: row['gwp_emission_factor']
      }
    }))
  }
</script>

<Select {items} bind:value={value} containerClasses="border border-1 rounded-r px-2 py-2 w-full"></Select>

