<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"

  import type { UsageServer } from "$lib/types/hardware";
  import {get} from "$lib/api";
  import {onMount} from "svelte";

  export let usage:UsageServer;

  let methods = [
      {value: 'Electricity', label: 'Electricity'},
      {value: 'Load', label: 'Load'},
  ];

  function getitems(route, default_value) {
      return get(route).then((response) => response.json())
          .then((data) => {
              let elements = [];
              elements.push({value: default_value, label: 'Default'});
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
      locaitems = await getitems(localisation_route, 'Default');
  })


  function change_method(event){
      if(event.detail.label == "Load"){
          usage.hours_electrical_consumption = null
          usage.time_workload = 50
          document.getElementById('model').style.display = 'block';
          document.getElementById('conso').style.display = 'none';

      }else {
          usage.time_workload = null
          usage.hours_electrical_consumption = 150
          document.getElementById('model').style.display = 'none';
          document.getElementById('conso').style.display = 'block';
      }
  }

  function region_select(event){
      usage.usage_location = event.detail.value
  }
</script>

<div class="flex flex-row my-1">
    <div class="basis-1/4 my-1 mx-2">
        <label class="block mb-2 text-sm font-medium text-gray-900">Localisation</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={locaitems} on:select={region_select} value="Default"/>
        </div>
    </div>
    <div class="basis-1/4 my-1 mx-2">
        <label class="block mb-2 text-sm font-medium text-gray-900">Lifespan (year)</label>
        <input bind:value={usage.years_use_time} type="number" min="1" max="64" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
    </div>
    <div class="basis-1/4 my-1 mx-2">
        <label class="block mb-2 text-sm font-medium text-gray-900">Method</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={methods} on:select={change_method} value="Electricity"/>
        </div>
    </div>
    <div class="basis-1/4 my-1 mx-2" id="conso">
        <label class="block mb-2 text-sm font-medium text-gray-900">Avrg electrical consumption (Watt/hour)</label>
        <input bind:value={usage.hours_electrical_consumption} type="number" min="1" max="10" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
    </div>
    <div class="basis-1/4 my-1 mx-2" id="model" style="display: none">
        <label class="block mb-2 text-sm font-medium text-gray-900">Server load (%)</label>
        <input bind:value={usage.time_workload} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
    </div>
</div>

