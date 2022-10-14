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
        },
        usage: {},
    };
    let serverImpact: Promise<ServerImpact>;

    $: server, updateImpact();

    function updateImpact() {
        serverImpact = getServerImpact(server);
    }

    let result: GlobalImpact = {
        gwp: {
            manufacture: 970.0,
            use: 1170.0,
            unit: "kgCO2eq",
        },
        pe: {
            manufacture: 13000.0,
            use: 39700.0,
            unit: "MJ",
        },
        adp: {
            manufacture: 0.15,
            use: 0.000198,
            unit: "kgSbeq",
        },
    };
</script>

<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_("server-impact.title")}</h2>

    <div class="grid space-x-10 evenly-spaced grid-cols-3">
        <div class="min-h-[200px] shadow-md p-4">
            <h2 class="text-3xl font-bold dark:text-white">
                Formulaire serveur
            </h2>
            <ServerConfig bind:serverConfig={server.config} />
        </div>

        <div class="min-h-[200px] shadow-md p-4">
            <h2 class="text-3xl font-bold dark:text-white">Utilisation</h2>
            <ServerUsage />
        </div>
        <div class="shadow-md p-4">
            <ResultGrid {serverImpact} />
        </div>
    </div>
</div>
