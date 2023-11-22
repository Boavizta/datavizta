<script lang="ts">
    import { get } from "$lib/api";
    import type { IoT } from "$lib/types/hardware";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select";

    let iot_archetype = [];

    export let IoTConfig: IoT;
    IoTConfig.archetype = "iot_device_default";
    export let expanded;
    export let toggleExpand;
    export let openConfig;
    export let remove;
    
    export let details = false;
    let localisation_route = "utils/country_code";
    let locations = [];
    let selectedRegionLabel = "World";

    const iot_functional_blocks = [
        {
            type: "Actuators",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Casing",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Connectivity",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Memory",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Others",
            hsl_levels: ["HSL-0", "HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "PCB",
            hsl_levels: ["HSL-0", "HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Power supply",
            hsl_levels: ["HSL-0", "HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Processing",
            hsl_levels: ["HSL-0", "HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "Security",
            hsl_levels: ["HSL-1"],
        },
        {
            type: "Sensing",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
        {
            type: "User interface",
            hsl_levels: ["HSL-1", "HSL-2", "HSL-3"],
        },
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
    /*
    function getfirstitem(route) {
        return get(route)
            .then((response) => response.json())
            .then((data) => {
                return data[0];
            });
    }*/

    function transformArchetypeName(archetype) {
        return archetype
            .replace(/[_-]/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    async function fetchArchetypes() {
        locations = await getlocalisation(localisation_route);
        return get("iot/iot_device/archetypes")
            .then((response) => response.json())
            .then((data) => {
                iot_archetype = data;
                
            });
    }

    function getClosestHslLevel(hsl_levels, currentHsl) {
        if (hsl_levels.includes(currentHsl)) {
            return currentHsl;
        }
        const currentHslIndex = parseInt(currentHsl.split("-")[1]);
        let closest = hsl_levels[0];
        let closestIndex = Math.abs(
            parseInt(closest.split("-")[1]) - currentHslIndex
        );

        for (let hsl of hsl_levels) {
            const index = parseInt(hsl.split("-")[1]);
            const diff = Math.abs(index - currentHslIndex);
            if (diff < closestIndex) {
                closest = hsl;
                closestIndex = diff;
            }
        }

        return closest;
    }

    function getHslLevelsForType(type) {
        const block = iot_functional_blocks.find(
            (block) => block.type === type
        );
        return block ? block.hsl_levels : [];
    }

    function updateFunctionalBlock(type, hsl_level, index) {
        const hsl_levels = getHslLevelsForType(type);
        const closestHsl = getClosestHslLevel(hsl_levels, hsl_level);

        const updatedBlock = { type, hsl_level: closestHsl };
        IoTConfig.functional_blocks[index] = updatedBlock;
        IoTConfig.functional_blocks = [...IoTConfig.functional_blocks];
    }

    function functionalBlocksTypeSelect({ detail }, index) {
        const type = detail.value;
        const currentHsl = IoTConfig.functional_blocks[index].hsl_level;
        updateFunctionalBlock(type, currentHsl, index);
    }

    function addFunctionalBlock() {
        updateFunctionalBlock(
            "Actuators",
            "HSL-1",
            IoTConfig.functional_blocks.length
        );
        
    }

    function removeFunctionalBlock(index) {
        IoTConfig.functional_blocks = IoTConfig.functional_blocks.filter(
            (_, i) => i !== index
        );
    }

    function onExpandClick(event) {
        event.stopPropagation();
        toggleExpand(IoTConfig);
    }

    
    function showDetailsClick() {
        details = !details;
    }

    
    function getlocalisation(route) {
        return get(route)
            .then((response) => response.json())
            .then((data) => {
                let elements = [];
                let items = Object.keys(data);
                for (let i = 0; i < items.length; i++) {
                    elements.push({ value: data[items[i]], label: items[i] });
                }
                return elements;
            });
    }
    
    function region_select(event) {
        IoTConfig.usage.usage_location = event.detail.value;
    }

    onMount(()=> {
        fetchArchetypes();
        });
</script>

<div
    class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
    on:click={() => openConfig(IoTConfig)}
>
    <div class="flex justify-center w-full {expanded ? 'mb-4' : ''}">
        <div class="w-full">
            {#if !expanded}
                <h3 class="text-xl my-1">
                    {transformArchetypeName(IoTConfig.archetype)}
                </h3>
            {:else}
                <label class="block text-xl my-1 text-gray-900"
                    >{$_("iot-config.archetype")}</label
                >
                <Select
                    items={iot_archetype.map((obj) =>
                        transformArchetypeName(obj)
                    )}
                    on:select={({ detail }) =>
                        (IoTConfig.archetype = iot_archetype[detail.index])}
                    value={transformArchetypeName(IoTConfig.archetype)}
                />
            {/if}
        </div>
        <img
            on:click={() => remove(IoTConfig)}
            src="./src/routes/iotimpact/delete-icon.svg"
            alt="delete icon"
            class="cursor-pointer hover:opacity-70 ml-4 {expanded
                ? 'mt-8'
                : ''}"
        />
        <img
            on:click={onExpandClick}
            src="./src/routes/iotimpact/expand-icon.svg"
            alt="collapse icon"
            class="cursor-pointer hover:opacity-70 ml-4 {expanded
                ? 'rotate-180 mt-8'
                : ''}"
        />
    </div>

    {#if expanded}
        <div>
            <div class="flex justify-start mb-2">
                <h3 class="text-xl my-1">
                    {$_("iot-config.functional_blocks")}
                </h3>
                <img
                    on:click={addFunctionalBlock}
                    src="./src/routes/iotimpact/plus-icon.svg"
                    alt="Add icon"
                    class="cursor-pointer hover:opacity-70 ml-4"
                />
            </div>
            {#each IoTConfig.functional_blocks as block, index (block)}
                <div class="flex items-center mb-2 pt-2">
                    <div class="w-1/2 mr-2">
                        <label class="block text-sm font-medium text-gray-900">
                            {$_("iot-config.type")}
                        </label>
                        <Select
                            items={iot_functional_blocks.map((obj) => obj.type)}
                            on:select={(e) =>
                                functionalBlocksTypeSelect(e, index)}
                            value={block.type}
                        />
                    </div>
                    <div class="w-1/2 ml-2">
                        <label class="block text-sm font-medium text-gray-900">
                            {$_("iot-config.hsl")}
                        </label>
                        <Select
                            items={getHslLevelsForType(block.type)}
                            on:select={({ detail }) =>
                                updateFunctionalBlock(
                                    block.type,
                                    detail.value,
                                    index
                                )}
                            value={block.hsl_level}
                        />
                    </div>
                    <img
                        on:click={() => removeFunctionalBlock(index)}
                        src="./src/routes/iotimpact/delete-icon.svg"
                        alt="delete icon"
                        class="cursor-pointer hover:opacity-70 ml-4 mt-5"
                    />
                </div>
            {/each}
            <div class="mb-2">
                <div class="flex">
                    <h3 class="text-xl my-1">{$_("usage-config.usage")} </h3>
                    
                    <img on:click={showDetailsClick}
                        src="./src/routes/iotimpact/expand-icon.svg"
                        alt="collapse icon"
                        class="cursor-pointer hover:opacity-70 ml-2 mt-2 {details
                            ? 'rotate-180'
                            : ''}"
                    />
                </div>

                {#if details}
                    <div class="mt-3 grid grid-cols-2 grid-rows-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-900">
                                {$_("iot-usage.avg-power")}
                            </label>
                            <input
                                bind:value={IoTConfig.usage.avg_power}
                                type="number"
                                min="1"
                                class="border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-900">
                                {$_("iot-usage.usage-location")}
                            </label>
                            <Select
                                id="select-region"
                                items={locations}
                                on:select={region_select}
                                value={selectedRegionLabel}
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-900">
                                {$_("iot-usage.life-time")}
                            </label>
                            <input
                                bind:value={IoTConfig.usage.hours_life_time}
                                type="number"
                                min="1"
                                class="border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
