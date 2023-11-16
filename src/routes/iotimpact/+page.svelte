<script lang="ts">
    import type {VerboseServerImpacts} from "$lib/types/impact";
    import ResultGrid from "$lib/impact/server-cloud/ResultGrid.svelte";
    import IoTConfig from "$lib/impact/iot/IoTConfig.svelte";
    import type { IoT, Usage } from "$lib/types/hardware";
    import UsageConfig from "$lib/impact/usageconfig/UsageConfig.svelte";
    import type { Impacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";
    import { getServerImpact } from "$lib/api";
    import DetailedUsageConfig from "$lib/impact/usageconfig/DetailedUsageConfig.svelte"
    import * as Utils from "$lib/utils"

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
    
    let serverImpact: Impacts;
    let verboseImpacts:VerboseServerImpacts = {
        "adp": {
            "embedded": {
                "hdd": 0,
                "motherboard":0,
                "power_supply":0,
                "cpu":0,
                "ram":0,
                "ssd":0,
                "case":0
           },
           "use":  {
               "total": 0
           },
           "unit": "kgSbeq"
        },
        "pe": {
            "embedded": {
                "hdd": 0,
                "motherboard":0,
                "power_supply":0,
                "cpu":0,
                "ram":0,
                "ssd":0,
                "case":0
           },
           "use":  {
               "total": 0
           },
           "unit": "MJ"
        },
        "gwp": {
            "embedded": {
                "hdd": 0,
                "motherboard":0,
                "power_supply":0,
                "cpu":0,
                "ram":0,
                "ssd":0,
                "case":0
           },
           "use":  {
               "total": 0
           },
           "unit": "kgCO2e"
        },
    };
    

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
