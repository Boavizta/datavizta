<script lang="ts">
    import { get } from "$lib/api";
    import type { IoT } from "$lib/types/hardware";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select";

    export let IoTConfig: IoT;

    let iot_archetype = [];
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

    function getfirstitem(route) {
        return get(route)
            .then((response) => response.json())
            .then((data) => {
                return data[0];
            });
    }

    function fetchArchetypes() {
        return get("iot/iot_device/archetypes")
            .then((response) => response.json())
            .then((data) => (iot_archetype = data));
    }

    function getHslLevelsForType(type) {
        console.log("getHslLevelsForType", type);
        const block = iot_functional_blocks.find(
            (block) => block.type === type
        );
        return block ? block.hsl_levels : [];
    }

    function updateFunctionalBlock(type, hsl_level, index) {
        const updatedBlock = {
            type,
            hsl_level: hsl_level || getHslLevelsForType(type)[0],
        };
        IoTConfig.functional_blocks[index] = updatedBlock;
        IoTConfig.functional_blocks = [...IoTConfig.functional_blocks];
    }

    function functionalBlocksTypeSelect({ detail }, index) {
        const type = detail.value;
        const hsl_levels = getHslLevelsForType(type);
        updateFunctionalBlock(type, hsl_levels[0], index);
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

    onMount(fetchArchetypes);
</script>

<div
    class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
>
    <div class="flex justify-center w-full mb-4">
        <div class="w-full">
            <label class="block text-sm font-medium text-gray-900"
                >{$_("iot-config.archetype")}</label
            >
            <Select
                items={iot_archetype}
                on:select={({ detail }) => (IoTConfig.archetype = detail.value)}
                value={iot_archetype[0]}
            />
        </div>
    </div>

    <div class="flex justify-start mb-4">
        <h3 class="text-xl my-1">{$_("iot-config.functional_blocks")}</h3>
        <img
            on:click={addFunctionalBlock}
            src="./src/routes/iotimpact/plus-icon.svg"
            alt="Add icon"
            class="cursor-pointer hover:opacity-70 ml-4"
        />
    </div>

    {#each IoTConfig.functional_blocks as block, index (block)}
        <div class="flex items-center mb-4">
            <div class="w-1/2 mr-2">
                <label class="block text-sm font-medium text-gray-900">
                    {$_("iot-config.type")}
                </label>
                <Select
                    items={iot_functional_blocks.map((obj) => obj.type)}
                    on:select={(e) => functionalBlocksTypeSelect(e, index)}
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
                        updateFunctionalBlock(block.type, detail.value, index)}
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
</div>
