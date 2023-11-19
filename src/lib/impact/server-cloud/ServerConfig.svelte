<script lang="ts">
    import type { Server, Usage } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select";
    import { onMount } from "svelte";
    import { get } from "$lib/api";
    import * as Utils from "$lib/utils";

    /*Bound var*/
    export let serverConfig: Server;
    export let usageConfig: Usage;

    let families_route = "utils/cpu_family";
    let ssd_manuf_route = "utils/ssd_manufacturer";
    let ram_manuf_route = "utils/ram_manufacturer";

    let architems = [];
    let rammanufitems = [];
    let ssdmanufitems = [];
    let casetypes = [
        { value: "rack", label: "Rack" },
        { value: "blade", label: "Blade" },
    ];

    function getitems(route) {
        return get(route)
            .then((response) => response.json())
            .then((data) => {
                let elements = [];
                for (let i = 0; i < data.length; i++) {
                    elements.push({ value: data[i], label: data[i] });
                }
                return elements;
            });
    }

    onMount(async () => {
        architems = await getitems(families_route);
        rammanufitems = await getitems(ram_manuf_route);
        ssdmanufitems = await getitems(ssd_manuf_route);
        serverConfig.config.cpu.family = "skylake";
        serverConfig.config.ram[0].manufacturer = "Samsung";
        serverConfig.config.disk[0].manufacturer = "Micron";
    });

    function archi_select(event) {
        serverConfig.config.cpu.family = event.detail.value;
    }

    function ram_manuf_select(event) {
        serverConfig.config.ram[0].manufacturer = event.detail.value;
    }

    function ssd_manuf_select(event) {
        serverConfig.config.disk[0].manufacturer = event.detail.value;
    }

    function casetype_select(event) {
        serverConfig.model.type = event.detail.value;
    }
</script>

<p
    on:click={() => Utils.toggleElement("server-config.cpu")}
    class="sm:block md:hidden"
>
    <a class="text-xl" href="javascript:void(0);">> </a><span
        class="text-xl my-1"
        >CPU
    </span><span class="text-md">
        ({serverConfig.config.cpu.units} x {serverConfig.config.cpu.core_units} cores
        - Architecture "{serverConfig.config.cpu.family}" - TDP:{serverConfig
            .config.cpu.tdp}W)</span
    >
</p>
<p class="hidden md:block"><span class="text-xl my-1">CPU </span></p>
<div
    id="server-config.cpu"
    class="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-1"
>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.quantity")}</label
        >
        <input
            bind:value={serverConfig.config.cpu.units}
            type="number"
            min="1"
            max="64"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.Core_units")}</label
        >
        <input
            bind:value={serverConfig.config.cpu.core_units}
            type="number"
            min="1"
            max="100"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.tdp")}</label
        >
        <input
            bind:value={serverConfig.config.cpu.tdp}
            type="number"
            min="50"
            max="350"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.architecture")}</label
        >
        <div style="--borderRadius: 0.5em;">
            <Select
                items={architems}
                on:select={archi_select}
                value="skylake"
            />
        </div>
    </div>
</div>

<p
    on:click={() => Utils.toggleElement("server-config.ram")}
    class="sm:block md:hidden"
>
    <a class="text-xl" href="javascript:void(0);">> </a><span
        class="text-xl my-1"
        >RAM
    </span><span class="text-md">
        ({serverConfig.config.ram[0].units} x {serverConfig.config.ram[0]
            .capacity}GB - {$_("manufacturer")} : {serverConfig.config.ram[0]
            .manufacturer})</span
    >
</p>
<p class="hidden md:block"><span class="text-xl my-1">RAM </span></p>
<div
    id="server-config.ram"
    class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1"
>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.quantity")}</label
        >
        <input
            bind:value={serverConfig.config.ram[0].units}
            type="number"
            min="1"
            max="999"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.capacity")}</label
        >
        <input
            bind:value={serverConfig.config.ram[0].capacity}
            type="number"
            min="1"
            max="100"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >Manufacturer</label
        >
        <div style="--borderRadius: 0.5em;">
            <Select
                items={rammanufitems}
                on:select={ram_manuf_select}
                value="Samsung"
            />
        </div>
    </div>
</div>

<p
    on:click={() => Utils.toggleElement("server-config.ssd")}
    class="sm:block md:hidden"
>
    <a class="text-xl" href="javascript:void(0);">> </a><span
        class="text-xl my-1"
        >SSD
    </span><span class="text-md">
        ({serverConfig.config.disk[0].units} x {serverConfig.config.disk[0]
            .capacity}GB - {$_("manufacturer")} : {serverConfig.config.disk[0]
            .manufacturer})</span
    >
</p>
<p class="hidden md:block"><span class="text-xl my-1">SSD </span></p>
<div
    id="server-config.ssd"
    class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1"
>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.quantity")}</label
        >
        <input
            bind:value={serverConfig.config.disk[0].units}
            type="number"
            min="10"
            max="9999"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.capacity")}</label
        >
        <input
            bind:value={serverConfig.config.disk[0].capacity}
            type="number"
            min="1"
            max="100"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.manufacturer")}</label
        >
        <div style="--borderRadius: 0.5em;">
            <Select
                items={ssdmanufitems}
                on:select={ssd_manuf_select}
                value="Micron"
            />
        </div>
    </div>
</div>
<p
    on:click={() => Utils.toggleElement("server-config.others")}
    class="sm:block md:hidden"
>
    <a class="text-xl" href="javascript:void(0);">> </a><span
        class="text-xl my-1"
        >{$_("server-config.others")}
    </span><span class="text-md">
        ({serverConfig.config.disk[1].units} HDD - {serverConfig.model.type} - {serverConfig
            .config.power_supply.units}
        {$_("server-config.psu")})</span
    >
</p>
<p class="hidden md:block">
    <span class="text-xl my-1">{$_("server-config.others")}</span>
</p>
<div
    id="server-config.others"
    class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1"
>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.hdd-quantity")}</label
        >
        <input
            bind:value={serverConfig.config.disk[1].units}
            type="number"
            min="1"
            max="100"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.case_type")}</label
        >
        <div style="--borderRadius: 0.5em;">
            <Select
                items={casetypes}
                on:select={casetype_select}
                value="Rack"
            />
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900"
            >{$_("server-config.psu_number")}</label
        >
        <input
            bind:value={serverConfig.config.power_supply.units}
            type="number"
            min="1"
            max="4"
            class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        />
    </div>
</div>
