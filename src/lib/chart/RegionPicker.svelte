<script lang="ts">
  import { _ } from "svelte-i18n";
  import Select from "svelte-select"
  import { onMount} from "svelte";
  import Papa from "papaparse";
  import type { RegionPickerItem } from '../customType';
  import * as ParamParser from "../paramParser";

  let items:RegionPickerItem[];
  
  export let isDisabled:boolean;
  export let isDefaultRegion:boolean;
  const defaultRegionItem = {label: $_('region-picker.default'), value: -1, id:"-1"};

  export let value:RegionPickerItem;

  onMount(async () => {
    const res = await fetch("./electrical_foot_print.csv");
    const text = await res.text();
    items = toSelectItems(text);
    /* retrieve region from query param */ 
    const regionParam = ParamParser.parseRegion(new URLSearchParams(window.location.search), items);
    if(regionParam){
      value = regionParam;
      isDefaultRegion = false;
      //window.scrollTo(0,document.body.scrollHeight);
    }else{
      value = defaultRegionItem
    }
  });

  function toSelectItems(csv) {
    if(csv == undefined){
      return
    }
    const csvParsed = Papa.parse(csv, {header: true, dynamicTyping: true})
    const rowData = csvParsed.data;
    const selectItems = []
    selectItems.push(defaultRegionItem)
    return selectItems.concat(rowData.map((row) => {
      return {
        id : row['country'].toLowerCase(),
        label: row['country'] + " - " + row['year']+ " - " + row['gwp_emission_factor'] + "kgCO2e/kWh",
        value: row['gwp_emission_factor']
      }
    }))
  };


</script>

<Select {items} bind:value={value} containerClasses="border border-1 rounded-r px-2 py-2 w-full" isDisabled="{isDisabled}" />

