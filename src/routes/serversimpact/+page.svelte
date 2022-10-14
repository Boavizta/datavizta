<script lang="ts">
    import ResultGrid from "$lib/impact/ResultGrid.svelte";
    import ServerConfig from "$lib/ServerConfig.svelte";
    import type { Server } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";

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
            power_supply: undefined,
        },
    };
</script>
<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_('server-impact.title')}</h2>

    <div class="grid space-x-10 evenly-spaced grid-cols-3">
        <div class="min-h-[200px] shadow-md p-4">
            <h2 class="text-3xl font-bold dark:text-white">Formulaire serveur</h2>
            <ServerConfig bind:serverConfig={server.config} />
        </div>

        <div class="min-h-[200px] shadow-md p-4">
            <h2 class="text-3xl font-bold dark:text-white">Utilisation</h2>
        </div>
        <div class="shadow-md p-4">

            <h2 class="text-3xl font-bold dark:text-white">Impacts</h2>

            <ResultGrid />

        </div>
    </div>

</div>