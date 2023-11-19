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
            iot_archetypes[0].type;
        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].hsl_level =
            iot_archetypes[0].hsl_levels[0];
        iot_hsl = iot_archetypes[0].hsl_levels;
    });

    async function archetype_type_select(event) {
        if (event.detail.index === undefined) return;

        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].type =
            iot_archetypes[event.detail.index].type;
        IoTConfig.functional_blocks[selectedFunctionalBlockIndex].hsl_level =
            iot_archetypes[event.detail.index].hsl_levels[0];

        iot_hsl = iot_archetypes[event.detail.index].hsl_levels;
    }

    function archetype_hsl_select(event) {
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

    const iot_archetypes = [
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
</script>

<div class="relative min-w-[100px] w-full mb-2 group">
    <label class="block text-sm font-medium text-gray-900"
        >{$_("iot-config.archetype")}</label
    >
    <div style="--borderRadius: 0.5em;">
        <Select
            items={iot_archetype}
            on:select={archetype_select}
            value={iot_archetype[0]}
        />
    </div>
</div>

<div class="relative min-w-[100px] w-full mb-2 group">
    <label class="block text-sm font-medium text-gray-900"
        >{$_("iot-config.type")}</label
    >
    <div style="--borderRadius: 0.5em;">
        <Select
            items={iot_archetypes.map((obj) => obj.type)}
            on:select={archetype_type_select}
            value={IoTConfig.functional_blocks[selectedFunctionalBlockIndex]
                .type}
        />
    </div>
</div>
<div class="relative min-w-[100px] w-full mb-2 group">
    <label class="block text-sm font-medium text-gray-900"
        >{$_("iot-config.hsl")}</label
    >
    <div style="--borderRadius: 0.5em;">
        <Select
            items={iot_hsl}
            on:select={archetype_hsl_select}
            value={IoTConfig.functional_blocks[selectedFunctionalBlockIndex]
                .hsl_level}
        />
    </div>
</div>
