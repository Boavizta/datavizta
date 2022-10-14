<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"
  import { onMount} from "svelte";
  import RegionPicker from "../chart/RegionPicker.svelte";

  let isDefaultRegion = true;

  let selectedRegion:RegionPickerItem= {label:undefined, value:undefined, id:undefined};

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

</script>

<div>
    <p>utilisé pendant <input type="number" class="w-10 text-right border-solid border" min="0" value=2/> ans avec un taux d'occupation CPU de :</p>
    <ul >
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">Idle</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border-2" min="0" max="100" step="10" value="0"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">10%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border-2" min="0" max="100"  value="0"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">50%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border-2" min="0" max="100"  value="100"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">100%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border-2" min="0" max="100" value="0" />% du temps</li>
    </ul>
   <p>dans un data center en {#key $locale}
    <RegionPicker bind:value={selectedRegion} bind:isDefaultRegion={isDefaultRegion} />
  {/key
    }</p> 
</div>