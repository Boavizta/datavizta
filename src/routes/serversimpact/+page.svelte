<script lang="ts">
    import type { GlobalImpact } from "$lib/customType";
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
                units: 1,
                core_units: 16,
                tdp: 150
            },
            ram: [
                {
                    units: 2,
                    capacity: 16,
                },
            ],
            disk: [
                {
                    units: 1,
                    capacity: 500,
                    type: "ssd",
                },
                {
                    units: 1,
                    capacity: 1000,
                    type: "hdd",
                },
            ],
        }, usage : {
            hours_electrical_consumption : 250,
            years_use_time: 4
        } 
    };
    let serverImpact: Promise<ServerImpact>;

    $: server, updateImpact();

    function updateImpact() {
        serverImpact = getServerImpact(server);
    }
</script>

<div id="content" class="px-4">
    <h2 class="title-second mt-2 mb-4 w-full">{$_('server-impact.title')}</h2>
    <div class="flex w-full flex-wrap items-stretch justify-between">
        <div class="min-h-[200px] p-4 w-full md:w-5/12">
            <h2 class="mb-2 mx-2 text-2xl font-bold">{$_('server-impact.Configuration')}</h2>
            <div class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <ServerConfig bind:serverConfig={server.config} />
            </div>
            <h2 class="mt-6 mb-2 mx-2 text-2xl font-bold">{$_('server-impact.Utilisation')}</h2>
            <div class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" >
                <ServerUsage bind:usage={server.usage}/>
            </div>
        </div>
        <div class="px-4 md:w-7/12">
                <ResultGrid {serverImpact}/>
        </div>
    </div>

</div>
