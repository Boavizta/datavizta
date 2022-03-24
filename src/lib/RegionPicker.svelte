<script lang="ts">
    import Select from "svelte-select"
    import { _ } from 'svelte-i18n';
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

        const csvParsed = Papa.parse(csv,{header:true, dynamicTyping: true})
        const rowData = csvParsed.data;
        //console.log(rowData)
        const selectItems = []
        selectItems.push(regionDefaultValue)
        return selectItems.concat(rowData.map((row) => {
            return {
                label: row['country'],
                value: row['gwp_emission_factor']
            }}))
    }

</script>

<div >
    {$_('index.select_country_elec_impact')}
    <Select  {items} bind:value={value} ></Select>
</div>


