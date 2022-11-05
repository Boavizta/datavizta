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
                    capacity: 512,
                    type: "ssd",
                },
            ],
        }, usage : {
            years_use_time : 3
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
        <div class="min-h-[200px] shadow-md p-4 w-full md:w-6/12">
            <div>
                <h2 class="mb-2 text-3xl font-bold dark:text-white">{$_('server-impact.Configuration')}</h2>
                <ServerConfig bind:serverConfig={server.config} />
            </div>
            <div class="mt-8">
                <h2 class="mb-2  text-3xl font-bold dark:text-white">{$_('server-impact.Utilisation')}</h2>
                <ServerUsage bind:usage={server.usage}/>
            </div>
        </div>

        <!-- <div class="min-h-[200px] shadow-md p-4  w-full md:w-1/3  mb-4">
        </div> -->
        <div class="shadow-md p-4 w-full md:w-6/12">

            <h2 class="mb-2 text-3xl font-bold dark:text-white">{$_('server-impact.Impacts')}</h2>

            <ResultGrid {serverImpact}/>

        </div>
    </div>

</div>
