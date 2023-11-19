<script lang="ts">
    import { get } from "$lib/api";
    import type { IoT } from "$lib/types/hardware";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select";

    export let IoTConfig: IoT;

    let iot_hsl = [];
    let selectedFunctionalBlockIndex = 0;

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

    onMount(async () => {
        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].type =
            iot_fonctional_blocks[0].type;
        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].hsl_level =
            iot_fonctional_blocks[0].hsl_levels[0];
        iot_hsl = iot_fonctional_blocks[0].hsl_levels;
    });

    async function fonctional_blocks_type_select(event) {
        if (event.detail.index === undefined) return;

        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].type =
            iot_fonctional_blocks[event.detail.index].type;
        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].hsl_level =
            iot_fonctional_blocks[event.detail.index].hsl_levels[0];

        iot_hsl = iot_fonctional_blocks[event.detail.index].hsl_levels;
    }

    function fonctional_blocks_hsl_select(event) {
        if (event.detail.value === undefined) return;

        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].hsl_level =
            event.detail.value;
    }

    function archetype_select(event) {
        if (event.detail.value === undefined) return;

        IoTConfig.archetype = event.detail.value;
    }

    const iot_archetype = [
        "occupancy_sensor",
        "home_connected_assistant_mini",
        "drone_mini",
        "smart_watch",
        "iot-device-default",
    ];

    const iot_fonctional_blocks = [
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
    function addFunctionalBlock() {
        const newBlock = {
            hsl_level: "HSL-1",
            type: "security",
        };
        IoTConfig.functional_blocks = [
            ...IoTConfig.functional_blocks,
            newBlock,
        ];
        selectedFunctionalBlockIndex = IoTConfig.functional_blocks.length - 1;
    }

    function removeFunctionalBlock(index) {
        if (IoTConfig.functional_blocks.length > 1) {
            const updatedBlocks = IoTConfig.functional_blocks.filter(
                (_, i) => i !== index
            );
            IoTConfig.functional_blocks = updatedBlocks;
            if (selectedFunctionalBlockIndex >= updatedBlocks.length) {
                selectedFunctionalBlockIndex = updatedBlocks.length - 1;
            }
        }
    }
</script>

<div
    class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
>
    <div class="flex justify-center w-full">
        <div class="w-full max-w-xs">
            <label class="block text-sm font-medium text-gray-900">
                {$_("iot-config.archetype")}
            </label>
            <Select
                items={iot_archetype}
                on:select={archetype_select}
                value={iot_archetype[0]}
            />
        </div>
    </div>

    <div class="flex justify-start mb-4">
        <h3 class="mb-2 mx-2 text-2xl font-bold">
            {$_("iot-config.fonctional_blocks")}
        </h3>
        <img
            on:click={addFunctionalBlock}
            src="./src/routes/iotimpact/plus-icon.svg"
            alt="add icon"
            class="cursor-pointer hover:opacity-70"
        />
    </div>

    {#each IoTConfig.functional_blocks as block, index (block)}
        <div class="mb-4">
            <div class="flex items-center mb-2">
                <div class="w-1/2 mr-2">
                    <label class="block text-sm font-medium text-gray-900">
                        {$_("iot-config.type")}
                    </label>
                    <Select
                        items={iot_fonctional_blocks.map((obj) => obj.type)}
                        on:select={fonctional_blocks_type_select}
                        value={IoTConfig.functional_blocks[index].type}
                    />
                </div>
                <div class="w-1/2 ml-2">
                    <label class="block text-sm font-medium text-gray-900">
                        {$_("iot-config.hsl")}
                    </label>
                    <Select
                        items={iot_hsl}
                        on:select={fonctional_blocks_hsl_select}
                        value={IoTConfig.functional_blocks[index].hsl_level}
                    />
                </div>
                <div class="ml-4">
                    <img
                        on:click={() => removeFunctionalBlock(index)}
                        src="./src/routes/iotimpact/trash-icon.svg"
                        alt="delete icon"
                        class="mt-2 cursor-pointer hover:opacity-70"
                    />
                </div>
            </div>
        </div>
    {/each}
</div>
