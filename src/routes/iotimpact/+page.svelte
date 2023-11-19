<script lang="ts">
    import { getIotImpact } from "$lib/api";
    import IoTConfig from "$lib/impact/iot/IoTConfig.svelte";
    import type { IoT, Usage } from "$lib/types/hardware";
    import type { Impacts, VerboseIotImpacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";

    let usageConfig: Usage = {
        avg_power: {
            default: 150,
            value: 150,
            min: 50,
            max: 250
        },
        use_time_ratio: {
            value: 1,
            hours_per_day: 24
        },
        years_life_time: {
            value: 5
        },
        usage_location: {
            value: "WOR",
            label: "World"
        },
        time_workload : [ {
            time_percentage : 30,
            load_percentage : 50
        },
        {
            time_percentage : 30,
            load_percentage : 30
        },
        {
            time_percentage : 40,
            load_percentage : 10
        }]
    }
    
    function createIoT(): IoT {
        return {
            archetype: {
                type: '',
                hsl_level: '',
            },
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

    $: Iot_instance, updateImpact();
    

    let block_number = 1;

    function add_block() {
        const newIoT = createIoT();
        all_iot.push(newIoT);
        block_number++;
    }

    function remove(iot: IoT) {
        console.log(all_iot);
        
        all_iot = all_iot.filter((item) => item !== iot);
        block_number--;
    }

    async function updateImpact() {
        try {
            IotImpact = await getIotImpact(Iot_instance);
            if (!IotImpact || !IotImpact['verbose']) {
                console.error('Invalid IotImpact data');
                return;
            }

            const componentsSet = new Set([
                "ACTUATORS-1", "CASING-1", "CONNECTIVITY-1", "MEMORY-1", "OTHERS-1", "PCB-1",
                "POWER_SUPPLY-1", "PROCESSING-1", "SECURITY-1", "SENSING-1", "USER_INTERFACE-1"
            ]);

            function extractImpactValues(impactType, component, verboseData) {
                return verboseData[component]['impacts'][impactType]?.embedded?.value ?? 0;
            }

            verboseImpacts = {
                adpe: { embedded: {}, use: { total: 0 }, unit: "" },
                gwp: { embedded: {}, use: { total: 0 }, unit: "" }
            };

            Object.keys(IotImpact['verbose']).forEach(component => {
                if (componentsSet.has(component)) {
                    verboseImpacts.adpe.embedded[component.toLowerCase()] = extractImpactValues('adpe', component, IotImpact['verbose']);
                    verboseImpacts.gwp.embedded[component.toLowerCase()] = extractImpactValues('gwp', component, IotImpact['verbose']);
                }
            });

            const { unit: adpeUnit, use: { value: adpeUseTotal } } = IotImpact['impacts']['adpe'];
            const { unit: gwpUnit, use: { value: gwpUseTotal } } = IotImpact['impacts']['gwp'];

            verboseImpacts.adpe.unit = adpeUnit;
            verboseImpacts.adpe.use.total = adpeUseTotal;
            verboseImpacts.gwp.unit = gwpUnit;
            verboseImpacts.gwp.use.total = gwpUseTotal;

        } catch (error) {
            console.error('Error in updateImpact:', error);
        }
        console.log('verboseImpacts:', verboseImpacts);
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('iot-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <div class="flex items-center mb-2">
                    <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('iot-config.configuration')}</h2>
                    <img on:click={add_block} src="./src/routes/iotimpact/plus-icon.svg" alt="delete icon" class="cursor-pointer hover:opacity-70">
                </div>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 flex flex-col">
                    {#each { length: block_number } as _, i}
                        <div class="flex gap-2">
                            <IoTConfig bind:IoTConfig={all_iot[i]} />
                            <img on:click={() => remove(all_iot[i])} src="./src/routes/iotimpact/trash-icon.svg" alt="delete icon" class="mt-2 cursor-pointer hover:opacity-70" >
                        </div>
                    {/each}
                </div>
            </form>
            
        </div>
    </div>
</div>
