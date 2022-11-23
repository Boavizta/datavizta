<script lang="ts">
    import type { ConfigurationServer, Disk } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get, getServerImpact, post} from "$lib/api";
    import type { UsageServer } from "$lib/types/hardware";

    /*Bound var*/
    export let serverConfig: ConfigurationServer;
    export let usage:UsageServer;


    let families_route = "utils/cpu_family/";
    let ssd_manuf_route = "utils/ssd_manufacturer/";
    let ram_manuf_route = "utils/ram_manufacturer/";
    let localisation_route = "utils/country_code/";

    let architems = [];
    let rammanufitems = [];
    let ssdmanufitems = [];
    let locaitems = []

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
        locaitems = await getlocalisation(localisation_route, 'Default');
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


    let methods = [
        {value: 'Electricity', label: 'Electricity'},
        {value: 'Load', label: 'Load'},
    ];

    function getlocalisation(route, default_value) {
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

    function change_method(event){
        if(event.detail.label == "Load"){
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

<form>
    <p class="text-xl  my-1 mx-2">CPU</p>
    <div class="flex flex-row my-1 mx-2">
        <div class="basis-1/5 my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
            <input bind:value={serverConfig.cpu.units} type="number" min="1" max="64" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-1/5  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Core unit</label>
            <input bind:value={serverConfig.cpu.core_units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-1/5  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">TDP (Watt)</label>
            <input bind:value={serverConfig.cpu.tdp} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-2/5  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Architecture</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={architems} on:select={archi_select} value="Default"/>
            </div>
        </div>
    </div>


    <p class="text-xl  my-1 mx-2">RAM</p>

    <div class="flex flex-row  my-1 mx-2">
        <div class="basis-1/4 h-full  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
            <input bind:value={serverConfig.ram[0].units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-1/4 h-full  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Capacity (GB)</label>
            <input bind:value={serverConfig.ram[0].capacity} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-2/4 h-full  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Manufacturer</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={rammanufitems} on:select={ram_manuf_select} value="Default"/>
            </div>
        </div>
    </div>

    <p class="text-xl  my-1 mx-2">SSD</p>
    <div class="flex flex-row  my-1 mx-2">
        <div class="basis-1/4  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
            <input bind:value={serverConfig.disk[0].units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-1/4  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Capacity (GB)</label>
            <input bind:value={serverConfig.disk[0].capacity} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-2/4  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Manufacturer</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={ssdmanufitems} on:select={ssd_manuf_select} value="Default"/>
            </div>
        </div>
    </div>

    <p class="text-xl  my-1 mx-2">HDD</p>
    <div class="flex flex-row  my-1 mx-2">
        <div class="basis-2/4  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Quantity</label>
            <input bind:value={serverConfig.disk[1].units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-2/4  my-1 mx-2">
            <label class="block mb-2 text-sm font-medium text-gray-900">Capacity (GB)</label>
            <input bind:value={serverConfig.disk[1].capacity} type="number" min="1" max="5000" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
    </div>
    <p class="text-xl  my-1 mx-2">USAGE</p>
    <div class="flex flex-row my-1 mx-2">
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
            <label class="block mb-2 text-sm font-medium text-gray-900">Avrg Watt/hour</label>
            <input bind:value={usage.hours_electrical_consumption} type="number" min="1" max="10" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="basis-1/4 my-1 mx-2" id="model" style="display: none">
            <label class="block mb-2 text-sm font-medium text-gray-900">Server load (%)</label>
            <input bind:value={usage.time_workload} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
    </div>
</form>
