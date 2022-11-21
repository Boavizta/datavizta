<script lang="ts">
    import type { ConfigurationServer, Disk } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get, getServerImpact, post} from "$lib/api";
    import * as ParamParser from "$lib/paramParser";
    import { element } from "svelte/internal";


    /*Bound var*/
    export let serverConfig: ConfigurationServer;

    let families_route = "utils/cpu_family/";
    let ssd_manuf_route = "utils/ssd_manufacturer/";
    let ram_manuf_route = "utils/ram_manufacturer/";

    let architems = [];
    let rammanufitems = [];
    let ssdmanufitems = [];

    function getitems(route, default_value) {
        return get(route).then((response) => response.json())
            .then((data) => {
                let elements = [];
                elements.push({value: default_value, label: 'Default'});
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }

    onMount(async () => { 
        architems = await getitems(families_route, "skylake");
        rammanufitems = await getitems(ram_manuf_route, "Samsung");
        ssdmanufitems = await getitems(ssd_manuf_route, "Mirco");
    })

    function archi_select(event){
        serverConfig.cpu.family = event.detail.value
    }

    function ram_manuf_select(event){
        serverConfig.ram[0].manufacturer = event.detail.value
    }

    function ssd_manuf_select(event){
        serverConfig.disk[0].manufacturer = event.detail.value
    }


</script>

<form>
    <p class="text-xl my-2">CPU</p>
    <div class="flex flex-row my-2">
        <div class="basis-1/3 my-2">
            <p>Quantity</p>
            <input bind:value={serverConfig.cpu.units} type="number" min="1" max="64"/>
        </div>
        <div class="basis-1/3 my-2">
            <p>Core unit</p>
            <input bind:value={serverConfig.cpu.core_units} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 my-2">
            <p>TDP (Watt)</p>
            <input bind:value={serverConfig.cpu.tdp} type="number" min="1" max="100"/>
        </div>
    </div>
    <div class="my-2">
        <p>Architecture</p>
        <Select items={architems} on:select={archi_select} value="Default"/>
    </div>

    <p class="text-xl my-2">RAM</p>

    <div class="flex flex-row my-2">
        <div class="basis-1/3 h-full my-2">
            <p>Quantity</p>
            <input bind:value={serverConfig.ram[0].units} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 h-full my-2">
            <p>Capacity (GB)</p>
            <input bind:value={serverConfig.ram[0].capacity} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 h-full my-2">
            <p>Manufacturer</p>
            <Select items={rammanufitems} on:select={ram_manuf_select} value="Default"/>
        </div>
    </div>

    <p class="text-xl my-2">SSD</p>
    <div class="flex flex-row my-2">
        <div class="basis-1/3 my-2">
            <p>Quantity</p>
            <input bind:value={serverConfig.disk[0].units} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 my-2">
            <p>Capacity (GB)</p>
            <input bind:value={serverConfig.disk[0].capacity} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 my-2">
            <p>Manufacturer</p>
            <Select items={ssdmanufitems} on:select={ssd_manuf_select} value="Default"/>
        </div>
    </div>

    <p class="text-xl my-2">HDD</p>
    <div class="flex flex-row my-2">
        <div class="basis-1/3 my-2">
            <p>Quantity</p>
            <input bind:value={serverConfig.disk[1].units} type="number" min="1" max="100"/>
        </div>
        <div class="basis-1/3 my-2">
            <p>Capacity (GB)</p>
            <input bind:value={serverConfig.disk[1].capacity} type="number" min="1" max="5000"/>
        </div>
    </div>
</form>
