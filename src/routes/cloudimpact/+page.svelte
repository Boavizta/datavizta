<script lang="ts">
    import type {VerboseImpacts} from "$lib/types/impact";
    import ResultGrid from "$lib/impact/ResultGrid.svelte";
    import CloudConfig from "$lib/impact/cloud/CloudConfig.svelte";
    import UsageConfig from "$lib/impact/UsageConfig.svelte";
    import DetailedServerConfig from "$lib/impact/DetailedCloudConfig.svelte"
    import DetailedUsageConfig from "$lib/impact/DetailedUsageConfig.svelte"
    import * as Utils from "$lib/utils"
    import type { ConfigurationCloud } from "$lib/types/hardware";
    import type { ServerImpact } from "$lib/types/impact";
    import { _ } from "svelte-i18n";
    import { getCloudImpact } from "$lib/api";
    
    export let cloud_instance: ConfigurationCloud = {
        provider: "aws",
        instance_type: "a1.2xlarge",
        usage : {
            years_use_time: 4,
            usage_location: "WOR",
            time_workload: [
                    {
                        time_percentage: 100,
                        load_percentage: 50
                    }
                    ]
        } 
    };
    let serverImpact: ServerImpact;
    let verboseImpacts:VerboseImpacts = {
       "adp": {
            "hdd": 0,
            "motherboard":0,
            "power_supply":0,
            "cpu":0,
            "ram":0,
            "ssd":0,
            "use":0,
            "unit":0,
            "case":0
        },
        "pe": {
            "hdd": 0,
            "motherboard":0,
            "power_supply":0,
            "cpu":0,
            "ram":0,
            "ssd":0,
            "use":0,
            "unit":0,
            "case":0
        },
        "gwp": {
            "hdd": 0,
            "motherboard":0,
            "power_supply":0,
            "cpu":0,
            "ram":0,
            "ssd":0,
            "use":0,
            "unit":0,
            "case":0
        },
    };

    $: cloud_instance, updateImpact();
    
    async function updateImpact() {
        serverImpact = await getCloudImpact(cloud_instance);
        verboseImpacts.adp.cpu = serverImpact['verbose']['CPU-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.ram = serverImpact['verbose']['RAM-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.unit = serverImpact['verbose']['CPU-1']['impacts']['adp']['embedded']['unit']
        verboseImpacts.adp.case= serverImpact['verbose']['CASE-1']['impacts']['adp']['embedded']['value']
        verboseImpacts.adp.use  = serverImpact['impacts']['adp']['use']['value']
        

        verboseImpacts.gwp.cpu = serverImpact['verbose']['CPU-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.ram = serverImpact['verbose']['RAM-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.unit = serverImpact['verbose']['CPU-1']['impacts']['gwp']['embedded']['unit']
        verboseImpacts.gwp.case= serverImpact['verbose']['CASE-1']['impacts']['gwp']['embedded']['value']
        verboseImpacts.gwp.use  = serverImpact['impacts']['gwp']['use']['value']

        verboseImpacts.pe.cpu = serverImpact['verbose']['CPU-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.ram = serverImpact['verbose']['RAM-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.assembly= serverImpact['verbose']['ASSEMBLY-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.unit = serverImpact['verbose']['CPU-1']['impacts']['pe']['embedded']['unit']
        verboseImpacts.pe.case= serverImpact['verbose']['CASE-1']['impacts']['pe']['embedded']['value']
        verboseImpacts.pe.use  = serverImpact['impacts']['pe']['use']['value']
        if ( serverImpact['verbose']['SSD-1'] !== undefined ) {
            verboseImpacts.adp.ssd = serverImpact['verbose']['SSD-1']['impacts']['adp']['embedded']['value']
            verboseImpacts.gwp.ssd = serverImpact['verbose']['SSD-1']['impacts']['gwp']['embedded']['value']
            verboseImpacts.pe.ssd = serverImpact['verbose']['SSD-1']['impacts']['pe']['embedded']['value']
        }
        if ( serverImpact['verbose']['HDD-1'] !== undefined ) {
            verboseImpacts.adp.hdd = serverImpact['verbose']['HDD-1']['impacts']['adp']['embedded']['value']
            verboseImpacts.gwp.hdd = serverImpact['verbose']['HDD-1']['impacts']['gwp']['embedded']['value']
            verboseImpacts.pe.hdd = serverImpact['verbose']['HDD-1']['impacts']['pe']['embedded']['value']
        }
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('cloud-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <form> 
                <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('cloud-impact.configuration')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid grid-cols-2 gap-1">
                    <CloudConfig bind:cloudConfig={cloud_instance}/>
                    <p on:click={() => Utils.toggleElement("serverconfig-detailed")} class="ml-2 block w-full col-span-2"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-server')}</a></p>
                    <div id="serverconfig-detailed" class="hidden col-span-2">
                        <DetailedServerConfig {serverImpact}/>
                    </div>
                </div>
                <h2 class="m-2 text-2xl font-bold">{$_('cloud-impact.usage')}</h2>
                <div id="serverconfig-usage" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid grid-cols-6 gap-1">
                    <UsageConfig bind:serverUsage={cloud_instance.usage} usageType="Cloud" />
                    <p on:click={() => Utils.toggleElement("usageconfig-detailed")} class="ml-2 block w-full col-span-6"><a class="text-xs" href="javascript:void(0);" >> {$_('detailed-config.show-usage')}</a></p>
                    <div id="usageconfig-detailed" class="hidden col-span-6">
                    <DetailedUsageConfig {serverImpact}/>
                    </div>
                </div>
            </form>
            
        </div>
        
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-impact.Results')}</h2>
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
