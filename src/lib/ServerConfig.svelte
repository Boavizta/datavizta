<script lang="ts">
    import type { ConfigurationServer } from "$lib/types/hardware";

    /*Bound var*/
    export let serverConfig: ConfigurationServer;
</script>

<form>
    1 serveur possédant:

    <input
        bind:value={serverConfig.cpu.units}
        class="form-control"
        type="number"
        min="1"
        max="10"
    />
    CPU(s) de
    <input
        bind:value={serverConfig.cpu.core_units}
        class="form-control"
        type="number"
        min="1"
        max="100"
    />
    coeurs, et
    <input
        bind:value={serverConfig.ram[0].units}
        class="form-control"
        type="number"
        min="1"
        max="100"
    />
    barrettes de
    <input
        bind:value={serverConfig.ram[0].units}
        class="form-control"
        type="number"
        min="1"
        max="100"
    />
    Go de RAM.
    <br />
    <input
        bind:value={serverConfig.disk[0].units}
        class="form-control"
        type="number"
        min="1"
        max="100"
    />
    disques
    <select bind:value={serverConfig.disk[0].type}>
        <option selected value="ssd"> SSD </option>
        <option value="hdd"> HDD </option>
        <option value="" class="form-check-input">Unknown</option>
    </select>
    de
    <input
        bind:value={serverConfig.disk[0].capacity}
        class="form-control"
        type="number"
        min="1"
        max="10000"
    /> Go
</form>
