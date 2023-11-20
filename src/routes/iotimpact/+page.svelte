<script lang="ts">
    import { getIotImpact } from "$lib/api";
    import IoTConfig from "$lib/impact/iot/IoTConfig.svelte";
    import ResultGrid from "$lib/impact/iot/ResultGrid.svelte";
    import type { IoT, Usage } from "$lib/types/hardware";
    import type { Impacts, VerboseIotImpacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";

    let usageConfig: Usage = {
        avg_power: {
            default: 150,
            value: 150,
            min: 50,
            max: 250,
        },
        use_time_ratio: {
            value: 1,
            hours_per_day: 24,
        },
        years_life_time: {
            value: 5,
        },
        usage_location: {
            value: "WOR",
            label: "World",
        },
        time_workload: [
            {
                time_percentage: 30,
                load_percentage: 50,
            },
            {
                time_percentage: 30,
                load_percentage: 30,
            },
            {
                time_percentage: 40,
                load_percentage: 10,
            },
        ],
    };

    function createIoT(): IoT {
        return {
            archetype: "occupancy_sensor",
            functional_blocks: [],
            usage: {
                avg_power: 150,
                use_time_ratio: 1,
                hours_life_time: 5 * 365 * 24,
                usage_location: "WOR",
            },
        };
    }

    let all_iot: IoT[] = [createIoT()];

    let IotImpact: Impacts;
    let verboseImpacts: VerboseIotImpacts;

    $: all_iot, updateImpact();

    let block_number = 1;

    function add_block() {
        const newIoT = createIoT();
        all_iot.push(newIoT);
        block_number++;
    }

    function remove(iot: IoT) {
        all_iot = all_iot.filter((item) => item !== iot);
        block_number--;
    }

    async function updateImpact() {
        verboseImpacts = {
            adpe: { embedded: {}, use: { total: 0 }, unit: "" },
            gwp: { embedded: {}, use: { total: 0 }, unit: "" },
        };

        const componentsSet = new Set([
            "ACTUATORS-1",
            "CASING-1",
            "CONNECTIVITY-1",
            "MEMORY-1",
            "OTHERS-1",
            "PCB-1",
            "POWER_SUPPLY-1",
            "PROCESSING-1",
            "SECURITY-1",
            "SENSING-1",
            "USER_INTERFACE-1",
        ]);

        function extractImpactValues(impactType, component, verboseData) {
            return (
                verboseData[component]["impacts"][impactType]?.embedded
                    ?.value ?? 0
            );
        }

        function accumulateImpacts(impactType, component, value) {
            if (!verboseImpacts[impactType].embedded[component]) {
                verboseImpacts[impactType].embedded[component] = 0;
            }
            verboseImpacts[impactType].embedded[component] += value;
        }

        try {
            let isFirstInstance = true;
            for (const iot of all_iot) {
                IotImpact = await getIotImpact(iot);
                if (!IotImpact || !IotImpact["verbose"]) continue;

                Object.keys(IotImpact["verbose"]).forEach((component) => {
                    if (componentsSet.has(component)) {
                        accumulateImpacts(
                            "adpe",
                            component.toLowerCase(),
                            extractImpactValues(
                                "adpe",
                                component,
                                IotImpact["verbose"]
                            )
                        );
                        accumulateImpacts(
                            "gwp",
                            component.toLowerCase(),
                            extractImpactValues(
                                "gwp",
                                component,
                                IotImpact["verbose"]
                            )
                        );
                    }
                });

                verboseImpacts.adpe.use.total +=
                    IotImpact["impacts"]["adpe"].use.value;
                verboseImpacts.gwp.use.total +=
                    IotImpact["impacts"]["gwp"].use.value;
                if (isFirstInstance) {
                    verboseImpacts.adpe.unit =
                        IotImpact["impacts"]["adpe"].unit;
                    verboseImpacts.gwp.unit = IotImpact["impacts"]["gwp"].unit;
                    isFirstInstance = false;
                }
            }
        } catch (error) {
            console.error("Error in updateImpact:", error);
        }
    }

    let expandedConfig = null;

    function openConfig(config) {
        if (expandedConfig !== config) {
            expandedConfig = config;
        }
    }

    function toggleExpand(config) {
        if (expandedConfig === config) {
            expandedConfig = null;
        } else {
            expandedConfig = config;
        }
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_("iot-impact.title")}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full">
            <form>
                <div class="flex items-center mb-2">
                    <h2 class="mb-2 mx-2 text-2xl font-bold">
                        {$_("iot-config.configuration")}
                    </h2>
                    <img
                        on:click={add_block}
                        src="./src/routes/iotimpact/plus-icon.svg"
                        alt="delete icon"
                        class="cursor-pointer hover:opacity-70"
                    />
                </div>
                <div id="serverconfig-usage" class="flex flex-col gap-2 mb-4">
                    {#each { length: block_number } as _, i}
                        <div class="flex gap-2">
                            <IoTConfig
                                bind:IoTConfig={all_iot[i]}
                                expanded={expandedConfig === all_iot[i]}
                                {toggleExpand}
                                {openConfig}
                                {remove}
                            />
                        </div>
                    {/each}
                </div>
            </form>
        </div>
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">
                {$_("impacts.Results")}
            </h2>
            <ResultGrid {verboseImpacts} />
        </div>
    </div>
</div>
