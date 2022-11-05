<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"
  import { onMount} from "svelte";
  import RegionPicker from "../chart/RegionPicker.svelte";
    import type { RegionPickerItem } from "$lib/customType";
    import type { UsageServer } from "$lib/types/hardware";

    let isDefaultRegion = true;

    let selectedRegion:RegionPickerItem= {label:undefined, value:undefined, id:undefined};


    export let consumption_idle = 0;//not bind yet
    export let consumption_10 = 0;//not bind
    export let consumption_50 = 100;//not bind
    export let consumption_100 = 0;//not bind

    $:selectedRegion, usage.usage_location = selectedRegion.code

    export let usage:UsageServer;

</script>

<div>
    <!-- <p>utilisé pendant <input type="number" class="w-10 text-right border-solid border" min="0" bind:value={usage.years_use_time}/> ans avec un taux d'occupation CPU de :</p> -->
    <p>{$_('server-impact.used during')}<input type="number" class="w-10 text-right border-solid border" min="0" bind:value={usage.years_use_time}/> {$_('server-impact.years')}</p>
<!--<ul >
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">Idle</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100" step="10" value="{consumption_idle}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">10%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100"  value="{consumption_10}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">50%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100"  value="{consumption_50}"/>% du temps</li>
        <li class="list-none"><span class="my-1 w-10 text-right inline-block">100%</span> pendant <input type="number" class="w-12 text-right ml-2 border-solid border" min="0" max="100" value="{consumption_100}" />% du temps</li>
    </ul>
  -->
   <p>{$_('server-impact.in a datacenter located in ')}
    {#key $locale}
    <RegionPicker bind:value={selectedRegion} bind:isDefaultRegion={isDefaultRegion} isDisabled={false}/>
    {/key}
  </p> 
</div>