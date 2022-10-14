<script lang="ts">
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

            <div class="gwp-line p-5 grid grid-cols-3">
                <div class=""></div>
                <div class="text-2xl bold">Manufacture</div>
                <div class="text-2xl bold">Usage</div>
            </div>

            <div class="gwp-line p-5 grid grid-cols-3">
                <div class="text-md">GWP</div>
                <div class="text-md text-right">111 kgeqCO₂</div>
                <div class="text-md text-right">222 kgeqCO₂</div>
            </div>
            <div class="pe-line p-5 grid grid-cols-3">
                <div class="text-md">PE</div>
                <div class="text-md text-right">111 MJ</div>
                <div class="text-md text-right">222 MJ</div>
            </div>
            <div class="adp-line p-5 grid grid-cols-3">
                <div class="text-md">ADP</div>
                <div class="text-md text-right">111 kgSbeq</div>
                <div class="text-md text-right">222 kgSbeq</div>
            </div>

        </div>
    </div>

</div>