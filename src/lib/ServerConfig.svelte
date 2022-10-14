<script lang="ts">
    import type { ConfigurationServer } from "$lib/types/hardware";

    /*Bound var*/
    export let serverConfig: ConfigurationServer;
</script>

<form>
    <p class="my-1">1 serveur possédant:</p>
    <p class="my-1"><input
        bind:value={serverConfig.cpu.units}
        class="form-control w-12 text-right border-solid border"
        type="number"
        min="1"
        max="10"
    />
    CPU(s) de
    <input
        bind:value={serverConfig.cpu.core_units}
        class="form-control w-12 text-right border-solid border"
        type="number"
        min="1"
        max="100"
    />
    coeurs, et
    </p>
    <p class="my-1"> 
    <input
        bind:value={serverConfig.ram[0].units}
        class="form-control w-12 text-right border-solid border"
        type="number"
        min="1"
        max="100"
    />
    barrettes de
    <input
        bind:value={serverConfig.ram[0].units}
        class="form-control w-12 text-right border-solid border"
        type="number"
        min="1"
        max="100"
    />
    Go de RAM.
</p>
<p class="my-1">
    <input
        bind:value={serverConfig.disk[0].units}
        class="form-control w-12 text-right border-solid border"
        type="number"
        min="1"
        max="100"
    />
    disques
    <select bind:value={serverConfig.disk[0].type}  class="w-24 text-left border-solid border">
        <option selected value="ssd"> SSD </option>
        <option value="hdd"> HDD </option>
        <option value="" class="form-check-input">Unknown</option>
    </select>
    de
    <input
        bind:value={serverConfig.disk[0].capacity}
        class="form-control w-16 text-right border-solid border"
        type="number"
        min="1"
        max="10000"
    /> Go</p>
</form>
