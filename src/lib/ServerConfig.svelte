<script lang="ts">
    import type { ConfigurationServer } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";

    /*Bound var*/
    export let serverConfig: ConfigurationServer;
</script>

<form>
    <p class="my-1">{$_('server-impact.1 server with')}:</p>
    <p class="my-1">
        <input
            bind:value={serverConfig.cpu.units}
            class="form-control w-12 text-right border-solid border"
            type="number"
            min="1"
            max="10"
        />
        {$_('server-impact.cpu with')}
        <input
            bind:value={serverConfig.cpu.core_units}
            class="form-control w-12 text-right border-solid border"
            type="number"
            min="1"
            max="100"
        />
        {$_('server-impact.core')}
    </p>
    <p class="my-1">
        <input
            bind:value={serverConfig.ram[0].units}
            class="form-control w-12 text-right border-solid border"
            type="number"
            min="1"
            max="100"
        />
         {$_('server-impact.RAM sticks of')}
        <input
            bind:value={serverConfig.ram[0].capacity}
            class="form-control w-12 text-right border-solid border"
            type="number"
            min="1"
            max="100"
        />
        {$_('server-impact.GB')}
    </p>
    <p class="my-1">
        <input
            bind:value={serverConfig.disk[0].units}
            class="form-control w-12 text-right border-solid border"
            type="number"
            min="1"
            max="100"
        />
        {$_('server-impact.storage volume')}
        
        <!-- <select
            bind:value={serverConfig.disk[0].type}
            class="w-24 text-left border-solid border"
        >
            <option selected value="ssd"> SSD </option>
            <option value="hdd"> HDD </option>
            <option value="" class="form-check-input">Unknown</option>
        </select>
        {$_('server-impact.with size of')} 
        <input
            bind:value={serverConfig.disk[0].capacity}
            class="form-control w-16 text-right border-solid border"
            type="number"
            min="1"
            max="10000"
        />{$_('server-impact.GB')}  -->
    </p>
</form>
