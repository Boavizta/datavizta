<script lang="ts">
    import type {VerboseServerImpacts} from "$lib/types/impact";
    import ResultGrid from "$lib/impact/server-cloud/ResultGrid.svelte";
    import ServerConfig from "$lib/impact/server-cloud/ServerConfig.svelte";
    import type { Server, Usage } from "$lib/types/hardware";
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
            value: 1
        },
        life_time: {
            value: 5
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
    
    let server: Server = {
        model: {
            type:"rack"
        },
        config: {
            cpu: {
                units: 2,
                core_units: 16,
                tdp: 150
            },
            ram: [
                {
                    units: 4,
                    capacity: 32,
                },
            ],
            disk: [
                {
                    units: 4,
                    capacity: 1000,
                    type: "ssd",
                },
                {
                    units: 2,
                    capacity: 1000,
                    type: "hdd",
                },
            ],
            power_supply: 
                {
                units: 2
                }
        }, usage : {
            avg_power : 150,
            use_time_ratio: 1,
            years_life_time: 5,
            usage_location: "World",
        } 
    };
    
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

    $: server, updateImpact();

    async function updateImpact() {
        serverImpact = await getServerImpact(server);
        verboseImpacts.adp.embedded.cpu = serverImpact['verbose']['CPU-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.embedded.ram = serverImpact['verbose']['RAM-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.embedded.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.embedded.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.embedded.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.unit = serverImpact['impacts']['adp']['unit']
        verboseImpacts.adp.embedded.case= serverImpact['verbose']['CASE-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.use.total  = serverImpact['impacts']['adp']['use']['value']

        verboseImpacts.gwp.embedded.cpu = serverImpact['verbose']['CPU-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.embedded.ram = serverImpact['verbose']['RAM-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.embedded.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.embedded.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.embedded.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.unit = serverImpact['impacts']['gwp']['unit']
        verboseImpacts.gwp.embedded.case= serverImpact['verbose']['CASE-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.use.total  = serverImpact['impacts']['gwp']['use']['value']

        verboseImpacts.pe.embedded.cpu = serverImpact['verbose']['CPU-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.embedded.ram = serverImpact['verbose']['RAM-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.embedded.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.embedded.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.embedded.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.unit = serverImpact['impacts']['pe']['unit']
        verboseImpacts.pe.embedded.case= serverImpact['verbose']['CASE-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.use.total  = serverImpact['impacts']['pe']['use']['value']
        if ( serverImpact['verbose']['SSD-1'] !== undefined ) {
            verboseImpacts.adp.embedded.ssd = serverImpact['verbose']['SSD-1']['impacts']['adp']['embedded']['value']
            verboseImpacts.gwp.embedded.ssd = serverImpact['verbose']['SSD-1']['impacts']['gwp']['embedded']['value']
            verboseImpacts.pe.embedded.ssd = serverImpact['verbose']['SSD-1']['impacts']['pe']['embedded']['value']
        }
        if ( serverImpact['verbose']['HDD-1'] !== undefined ) {
            verboseImpacts.adp.embedded.hdd = serverImpact['verbose']['HDD-1']['impacts']['adp']['embedded']['value']
            verboseImpacts.gwp.embedded.hdd = serverImpact['verbose']['HDD-1']['impacts']['gwp']['embedded']['value']
            verboseImpacts.pe.embedded.hdd = serverImpact['verbose']['HDD-1']['impacts']['pe']['embedded']['value']
        }
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('server-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-config.configuration')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <ServerConfig bind:serverConfig={server} bind:usageConfig={usageConfig}/>
                </div>
                <h2 class="m-2 text-2xl font-bold">{$_('server-config.usage')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1">
                    <UsageConfig bind:usage={server.usage} bind:usageConfig={usageConfig} usageType="server"/>
                    <p on:click={() => Utils.toggleElement("usageconfig-detailed")} class="ml-2 block w-full col-span-6"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-usage')}</a></p>
                    <div id="usageconfig-detailed" class="hidden col-span-6">
                    <DetailedUsageConfig {serverImpact}/>
                    </div>
                </div>
            </form>
            
        </div>
        
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('impacts.Results')}</h2>
                <ResultGrid {verboseImpacts}/>
        </div>
    </div>
    <div class="m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
        <h3 class="text-xl font-bold">{$_('server-impact-desc.how')}</h3>
        <p class="mb-2">
            {$_('server-impact-desc.how_content1')} <a href={$_('server-impact-desc.articlelink')} class='no-underline hover:underline blue text-sky-800' target='_blank'>{$_('server-impact-desc.how_content2')}</a>.
            {$_('server-impact-desc.how_content3')} <a href='https://doc.api.boavizta.org/' class='no-underline hover:underline blue text-sky-800' target='_blank'>doc.api.boavizta.org</a>.

        </p>
        <h3 class="text-xl font-bold">{$_('server-impact-desc.further')}</h3>
        <p class="">
            {$_('server-impact-desc.further_content1')}  <a href='https://github.com/boavizta/boaviztapi/'class='no-underline hover:underline blue text-sky-800' target='_blank'>BoaviztAPI</a>{$_('server-impact-desc.further_content2')}
        </p>
    </div>

</div>
