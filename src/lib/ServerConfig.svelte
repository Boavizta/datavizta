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

    function getitems(route) {
        return get(route).then((response) => response.json())
            .then((data) => {
                let elements = [];
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }

    onMount(async () => { 
        architems = await getitems(families_route);
        rammanufitems = await getitems(ram_manuf_route);
        ssdmanufitems = await getitems(ssd_manuf_route);
        locaitems = await getlocalisation(localisation_route);
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

    function getlocalisation(route) {
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

<form>
    <p class="text-xl  my-1">CPU</p>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 md:gap-1">
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.quantity')}</label>
            <input bind:value={serverConfig.cpu.units} type="number" min="1" max="64" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.Core_units')}</label>
            <input bind:value={serverConfig.cpu.core_units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.tdp')}</label>
            <input bind:value={serverConfig.cpu.tdp} type="number" min="50" max="350" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.architecture')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={architems} on:select={archi_select} value="skylake"/>
            </div>
        </div>
    </div>


    <p class="text-xl  my-1">RAM</p>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 md:gap-1">
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.quantity')}</label>
            <input bind:value={serverConfig.ram[0].units} type="number" min="1" max="999" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.capacity')}</label>
            <input bind:value={serverConfig.ram[0].capacity} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">Manufacturer</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={rammanufitems} on:select={ram_manuf_select} value="Samsung"/>
            </div>
        </div>
    </div>

    <p class="text-xl  my-1">SSD</p>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 md:gap-1">
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.quantity')}</label>
            <input bind:value={serverConfig.disk[0].units} type="number" min="10" max="9999" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.capacity')}</label>
            <input bind:value={serverConfig.disk[0].capacity} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.manufacturer')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={ssdmanufitems} on:select={ssd_manuf_select} value="Micron"/>
            </div>
        </div>
    </div>

    <p class="text-xl  my-1">HDD</p>
    <div class="grid md:grid-cols-2 md:gap-1">
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.quantity')}</label>
            <input bind:value={serverConfig.disk[1].units} type="number" min="1" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative min-w-[100px] w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.capacity')}</label>
            <input bind:value={serverConfig.disk[1].capacity} type="number" min="10" max="9999" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
    </div>
    <p class="text-xl  my-1">USAGE</p>
    <div class="grid md:grid-cols-2 md:gap-1">
        <div class="relative w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.localisation')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={locaitems} on:select={region_select} value="0-Global"/>
            </div>
        </div>

        <div class="relative w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.lifespan')}</label>
            <input bind:value={usage.years_use_time} type="number" min="1" max="64" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative z-0 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.method')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select items={methods} on:select={change_method} value="Electricity"/>
            </div>
        </div>
        <div class="relative z-0 w-full mb-2 group" id="conso">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.avrg_elec')}</label>
            <input bind:value={usage.hours_electrical_consumption} type="number" min="10" max="999" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative z-0 w-full mb-2 group" id="model" style="display: none">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.load')}</label>
            <input bind:value={usage.time_workload} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
    </div>
</form>
