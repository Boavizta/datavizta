<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"
  import { onMount} from "svelte";
  import RegionPicker from "../chart/RegionPicker.svelte";
    import type { RegionPickerItem } from "$lib/customType";

  let isDefaultRegion = true;

  export let selectedRegion:RegionPickerItem= {label:undefined, value:undefined, id:undefined};

  function resetRegionPicker(){
        isDefaultRegion = true;
    }

    function singleItemSelected(selectedRows) {
        if (selectedRows.length == 1) {
            return selectedRows[0].name;
        } else {
            return "false"
        }
    }

    export let consumption_idle = 0;
    export let consumption_10 = 0;
    export let consumption_50 = 100;
    export let consumption_100 = 0;


    export let usage = {
        usage_location: selectedRegion.id,
        years_use_time : 3
    }

</script>

<div>
    <p>utilisé pendant <input type="number" class="w-10 text-right border-solid border" min="0" value={usage.years_use_time}/> ans avec un taux d'occupation CPU de :</p>
    <ul >
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">Idle</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100" step="10" value="{consumption_idle}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">10%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100"  value="{consumption_10}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">50%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100"  value="{consumption_50}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">100%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100" value="{consumption_100}" />% du temps</li>
    </ul>
   <p>dans un data center en {#key $locale}
    <RegionPicker bind:value={selectedRegion} bind:isDefaultRegion={isDefaultRegion} />
  {/key
    }</p> 
</div>