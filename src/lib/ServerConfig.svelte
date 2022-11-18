<script lang="ts">
    import type { ConfigurationServer, Disk } from "$lib/types/hardware";

    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get, getServerImpact, post} from "$lib/api";
    import * as ParamParser from "$lib/paramParser";

    /*Bound var*/
    export let serverConfig: ConfigurationServer;
    let families = [];
    let ssd_manuf = get("utils/ssd_manufacturer/");
    let ram_manuf = get("utils/ram_manufacturer/");
    let localisation = get("utils/country_code/");

    let items = [
        {value: 'A', label: 'A'},
        {value: 'B', label: 'B'},
        {value: 'C', label: 'C'},
        {value: 'D', label: 'D'}
    ];

    async function archi() {
        let elements = [];
        get("utils/cpu_family/").then((response) => response.json())
            .then((data) => {
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }
    onMount(async () => {
        items = archi();
    })

</script>

<form>
    <h2>Configuration</h2>

    <h3>CPU</h3>
    <p>number</p>
    <input
        bind:value={serverConfig.cpu.units}
        type="number"
        min="1"
        max="10"
    />
    <p>cors unit</p>
    <input
        bind:value={serverConfig.cpu.core_units}
        type="number"
        min="1"
        max="100"
    />
    <p>TDP</p>
    <input
        bind:value={serverConfig.cpu.tdp}
        type="number"
        min="1"
        max="100"
    />
    <p>Architecture</p>
    <Select loadOptions={archi} bind:value={serverConfig.cpu.family}/>

    <h3>RAM</h3>
    <p>number</p>
    <input
        bind:value={serverConfig.ram[0].units}
        type="number"
        min="1"
        max="100"
    />
    <p>capacity</p>
    <input
        bind:value={serverConfig.ram[0].capacity}
        type="number"
        min="1"
        max="100"
    />
    <p>manufacturer</p>
    <Select items=families bind:value={serverConfig.ram[0].manufacturer}/>

    <h3>SSD</h3>
    <p>number</p>
    <input
        bind:value={serverConfig.disk[0].units}
        type="number"
        min="1"
        max="100"
    />
    <p>capacity</p>
    <input
        bind:value={serverConfig.disk[0].capacity}
        type="number"
        min="1"
        max="100"
    />
    <p>manufacturer</p>
    <Select items={items} bind:value={serverConfig.disk[0].manufacturer}/>

    <h3>HDD</h3>
    <p>number</p>
    <input
        bind:value={serverConfig.disk[1].units}
        type="number"
        min="1"
        max="100"
    />
    <p>capacity</p>
    <input
        bind:value={serverConfig.disk[1].capacity}
        type="number"
        min="1"
        max="5000"
    />
</form>
