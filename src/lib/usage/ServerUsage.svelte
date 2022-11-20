<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"

  import type { UsageServer } from "$lib/types/hardware";
  import {get} from "$lib/api";
  import {onMount} from "svelte";

  export let usage:UsageServer;

  let methods = [
      {value: 'electricity', label: 'elec'},
      {value: 'model', label: 'model'},
  ];

  function getitems(route) {
      return get(route).then((response) => response.json())
          .then((data) => {
              let elements = [];
              let items = Object.keys(data)
              for (let i = 0; i < items.length; i++) {
                  elements.push({value: data[items[i]], label: items[i]});
              }
              return elements
          });
  }

  let localisation_route = "utils/country_code/";
  let locaitems = []

  onMount(async () => {
      locaitems = await getitems(localisation_route);
  })


  function change_method(event){
      if(event.detail.label == "model"){
          usage.hours_electrical_consumption = null
          usage.time_workload = 50
          document.getElementById('model').style.display = 'block';
          document.getElementById('conso').style.display = 'none';

      }else {
          usage.time_workload = null
          usage.hours_electrical_consumption = 250
          document.getElementById('model').style.display = 'none';
          document.getElementById('conso').style.display = 'block';
      }
  }

  function region_select(event){
      usage.usage_location = event.detail.value
  }
</script>

<div class="flex flex-row my-2">
    <div class="basis-1/2 my-2">
        <p>Localisation</p>
        <Select items={locaitems} on:select={region_select}/>
    </div>
    <div class="basis-1/2 my-2">
        <p>Lifespan (year)</p>
        <input bind:value={usage.years_use_time} type="number" min="1" max="64"/>
    </div>
</div>
<div class="flex flex-row my-2">
    <div class="basis-1/2 my-2">
        <p>method</p>
        <Select items={methods} on:select={change_method} value="elec"/>
    </div>
    <div class="basis-1/2 my-2" id="conso">
        <p>Average electrical consumption (Watt/hour)</p>
        <input bind:value={usage.hours_electrical_consumption} type="number" min="1" max="10"/>
    </div>
    <div class="basis-1/2 my-2" id="model" style="display: none">
        <p>Server load (%)</p>
        <input bind:value={usage.time_workload} type="number" min="1" max="10"/>
    </div>
</div>

