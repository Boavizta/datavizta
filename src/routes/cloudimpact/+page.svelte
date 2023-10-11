<script lang="ts">
    import type {VerboseServerImpacts} from "$lib/types/impact";
    import ResultGrid from "$lib/impact/server-cloud/ResultGrid.svelte";
    import CloudConfig from "$lib/impact/server-cloud/CloudConfig.svelte";
    import UsageConfig from "$lib/impact/usageconfig/UsageConfig.svelte";
    import DetailedCloudConfig from "$lib/impact/server-cloud/DetailedCloudConfig.svelte"
    import DetailedUsageConfig from "$lib/impact/usageconfig/DetailedUsageConfig.svelte"
    import * as Utils from "$lib/utils"
    import type { Cloud, Usage } from "$lib/types/hardware";
    import type { Impacts } from "$lib/types/impact";
    import { _ } from "svelte-i18n";
    import { getCloudImpact } from "$lib/api";
    
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

    export let cloud_instance: Cloud = {
        provider: "aws",
        instance_type: "a1.2xlarge",
        usage : {
            avg_power : 150,
            use_time_ratio: 1,
            hours_life_time: 5 * 365 * 24,
            usage_location: "WOR",
            time_workload: [{
                time_percentage: 100,
                load_percentage: 50
            }]
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

    $: cloud_instance, updateImpact();
    
    async function updateImpact() {
        serverImpact = await getCloudImpact(cloud_instance);
        console.log(serverImpact)
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
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('cloud-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('cloud-config.configuration')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid grid-cols-2 gap-1">
                    <CloudConfig bind:cloudConfig={cloud_instance}/>
                    <p on:click={() => Utils.toggleElement("serverconfig-detailed")} class="ml-2 block w-full col-span-2"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-server')}</a></p>
                    <div id="serverconfig-detailed" class="hidden col-span-2">
                        <DetailedCloudConfig {serverImpact}/>
                    </div>
                </div>
                <h2 class="m-2 text-2xl font-bold">{$_('cloud-config.usage')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid grid-cols-6 gap-1">
                    <UsageConfig bind:usage={cloud_instance.usage} bind:usageConfig={usageConfig} usageType="Cloud" />
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
         <p class="">
            {$_('server-impact-desc.further_content3')}  <a href='https://github.com/Boavizta/cloud-scanner'class='no-underline hover:underline blue text-sky-800' target='_blank'>Boavizta cloud-scanner</a>{$_('server-impact-desc.further_content4')}
        </p>
    </div>

</div>
