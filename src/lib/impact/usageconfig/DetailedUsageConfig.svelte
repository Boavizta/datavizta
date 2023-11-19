<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { Impacts } from "$lib/types/impact";
    export let serverImpact: Impacts;
    $: serverImpact;
</script>

{#await serverImpact}
    <div class="spinner-border" role="status" />
{:then loadedImpact}
    {#if loadedImpact != undefined}
        <div class="ml-4 px-1 w-full">
            <p>
                <a class="text-xs"
                    >{$_("detailed-config.usage-conso")}{loadedImpact[
                        "verbose"
                    ]["avg_power"]["value"]}{loadedImpact["verbose"][
                        "avg_power"
                    ]["unit"]}</a
                >
            </p>
            <p><a class="text-xs">{$_("detailed-config.usage-title")}</a></p>
            {#if "adpe_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["adpe_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >ADPE:{loadedImpact["verbose"]["adpe_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["adpe_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "adp_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["adp_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >ADP:{loadedImpact["verbose"]["adp_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["adp_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "gwp_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["gwp_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >GWP:{loadedImpact["verbose"]["gwp_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["gwp_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "pe_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["pe_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >PE:{loadedImpact["verbose"]["pe_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["pe_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "ir_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["ir_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >IR:{loadedImpact["verbose"]["ir_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["ir_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "odp_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["odp_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >ODP:{loadedImpact["verbose"]["odp_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["odp_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "ap_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["ap_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >AP:{loadedImpact["verbose"]["ap_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["ap_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
            {#if "ept_factor" in loadedImpact["verbose"]}
                {#if loadedImpact["verbose"]["ept_factor"]["value"] != undefined}
                    <p>
                        <span class="ml-5 text-xs"
                            >IR:{loadedImpact["verbose"]["ept_factor"][
                                "value"
                            ]}{loadedImpact["verbose"]["ept_factor"][
                                "unit"
                            ]}</span
                        >
                    </p>
                {/if}
            {/if}
        </div>
    {/if}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}
