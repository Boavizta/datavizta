<script lang="ts">
  import { _ , locale} from "svelte-i18n";
  import Select from "svelte-select"

  import type { UsageServer } from "$lib/types/hardware";

  export let usage:UsageServer;

  let methods = [
      {value: 'electricity', label: 'elec'},
      {value: 'model', label: 'model'},
  ];

  let localisation = [
      {value: 'FR', label: 'France'},
      {value: 'US', label: 'USA'},
  ];

</script>

<div>
    <h3>Usage</h3>
    <p>localisation</p>
    <Select items={localisation} bind:value={usage.usage_location}/>

    <p>method</p>
    <Select items={methods}/>

    <p>conso</p>
    <input
        bind:value={usage.hours_electrical_consumption}
        type="number"
        min="1"
        max="10"
    />

    <p>load</p>
    <input
        bind:value={usage.time_workload}
        type="number"
        min="1"
        max="10"
    />
</div>
