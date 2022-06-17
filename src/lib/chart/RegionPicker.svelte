<script lang="ts">
  import {_} from 'svelte-i18n';
  import Select from "svelte-select"
  import {createEventDispatcher, onMount} from "svelte";
  import Papa from "papaparse";
  import type { RegionPickerItem } from '../customType';

  let items:RegionPickerItem[];
  
  export let isDisabled:boolean;

  function setRegionDefaultValue():RegionPickerItem {
        let regionDefaultValue = {label: $_('region-picker.default'), value: -1, id:"-1"};
        return regionDefaultValue
    } 
  export let regionDefaultValue:RegionPickerItem=setRegionDefaultValue();
  export let selectedRegion:RegionPickerItem = regionDefaultValue;
  export let value:RegionPickerItem = regionDefaultValue;
  
  export function updateRegionPicker():void {
    regionDefaultValue=setRegionDefaultValue();
    selectedRegion = regionDefaultValue;
    value = regionDefaultValue;
  };
  
  onMount(async () => {
    const res = await fetch("./electrical_foot_print.csv");
    const text = await res.text();
    items = toSelectItems(text);
    /* retrieve region from query param */ 
    const region = new URLSearchParams(window.location.search).get('region');
    value = items && items.find(o => o.id === region) || regionDefaultValue;
  });

  const dispatcher = createEventDispatcher();

  function updateImpacts() {
    dispatcher("updateImpacts");
  };

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
  };


</script>

<Select {items} bind:value={value} on:select={updateImpacts} containerClasses="border border-1 rounded-r px-2 py-2 w-full" isDisabled="{isDisabled}" />

