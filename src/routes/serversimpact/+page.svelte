<script lang="ts">
    import type {VerboseImpacts} from "$lib/customType";
    import ResultGrid from "$lib/impact/ResultGrid.svelte";
    import ServerConfig from "$lib/ServerConfig.svelte";
    import type { Server } from "$lib/types/hardware";
    import type { ServerImpact } from "$lib/types/impact";
    import { _ } from "svelte-i18n";
    import ServerUsage from "$lib/usage/ServerUsage.svelte";
    import { getServerImpact } from "$lib/api";

    let server: Server = {
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
        }, usage : {
            hours_electrical_consumption : 150,
            years_use_time: 4
        } 
    };

    let serverImpact: ServerImpact;
    let verboseImpacts:VerboseImpacts = {
       "adp": {
            "hdd": 1,
            "motherboard":1,
            "power_supply":1,
            "cpu":1,
            "ram":1,
            "ssd":1,
            "use":1,
            "unit":1
        },
        "pe": {
            "hdd": 1,
            "motherboard":1,
            "power_supply":1,
            "cpu":1,
            "ram":1,
            "ssd":1,
            "use":1,
            "unit":1
        },
        "gwp": {
            "hdd": 1,
            "motherboard":1,
            "power_supply":1,
            "cpu":1,
            "ram":1,
            "ssd":1,
            "use":1,
            "unit":1
        },
    };

    $: server, updateImpact();

    async function updateImpact() {
        serverImpact = await getServerImpact(server);
        verboseImpacts.adp.cpu = serverImpact['verbose']['CPU-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.adp.ram = serverImpact['verbose']['RAM-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['RAM-1']['units']
        verboseImpacts.adp.ssd = serverImpact['verbose']['SSD-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['SSD-1']['units']
        verboseImpacts.adp.hdd = serverImpact['verbose']['HDD-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['HDD-1']['units']
        verboseImpacts.adp.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['MOTHERBOARD-1']['units']
        verboseImpacts.adp.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['manufacture_impacts']['adp']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.adp.assembly= serverImpact['verbose']['ASSEMBLY-1']['manufacture_impacts']['adp']['value']
        verboseImpacts.adp.unit = serverImpact['verbose']['CPU-1']['manufacture_impacts']['adp']['unit']
        verboseImpacts.adp.use= serverImpact['verbose']['USAGE']['usage_impacts']['adp']['value']

        verboseImpacts.gwp.cpu = serverImpact['verbose']['CPU-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.gwp.ram = serverImpact['verbose']['RAM-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['RAM-1']['units']
        verboseImpacts.gwp.ssd = serverImpact['verbose']['SSD-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['SSD-1']['units']
        verboseImpacts.gwp.hdd = serverImpact['verbose']['HDD-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['HDD-1']['units']
        verboseImpacts.gwp.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['MOTHERBOARD-1']['units']
        verboseImpacts.gwp.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['manufacture_impacts']['gwp']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.gwp.assembly= serverImpact['verbose']['ASSEMBLY-1']['manufacture_impacts']['gwp']['value']
        verboseImpacts.gwp.unit = serverImpact['verbose']['CPU-1']['manufacture_impacts']['gwp']['unit']
        verboseImpacts.gwp.use= serverImpact['verbose']['USAGE']['usage_impacts']['gwp']['value']

        verboseImpacts.pe.cpu = serverImpact['verbose']['CPU-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.pe.ram = serverImpact['verbose']['RAM-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['RAM-1']['units']
        verboseImpacts.pe.ssd = serverImpact['verbose']['SSD-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['SSD-1']['units']
        verboseImpacts.pe.hdd = serverImpact['verbose']['HDD-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['HDD-1']['units']
        verboseImpacts.pe.motherboard = serverImpact['verbose']['MOTHERBOARD-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['MOTHERBOARD-1']['units']
        verboseImpacts.pe.power_supply= serverImpact['verbose']['POWER_SUPPLY-1']['manufacture_impacts']['pe']['value']*serverImpact['verbose']['CPU-1']['units']
        verboseImpacts.pe.assembly= serverImpact['verbose']['ASSEMBLY-1']['manufacture_impacts']['pe']['value']
        verboseImpacts.pe.unit = serverImpact['verbose']['CPU-1']['manufacture_impacts']['pe']['unit']
        verboseImpacts.pe.use= serverImpact['verbose']['USAGE']['usage_impacts']['pe']['value']
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">{$_('server-impact.title')}</h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full ">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-impact.Configuration')}</h2>
            <div class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <ServerConfig bind:serverConfig={server.config} bind:usage={server.usage} />
            </div>
        </div>
        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-impact.Results')}</h2>
                <ResultGrid {verboseImpacts}/>
            <div class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
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
    </div>

</div>
