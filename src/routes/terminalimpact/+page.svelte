<script lang="ts">
    import ResultGrid from "$lib/impact/terminal/ResultGrid.svelte";
    import UserDeviceConfig from "$lib/impact/terminal/TerminalConfig.svelte";
    import type { Usage, UserDevice } from "$lib/types/hardware";
    import UsageConfig from "$lib/impact/usageconfig/UsageConfig.svelte";
    import { _ } from "svelte-i18n";
    import DetailedUsageConfig from "$lib/impact/usageconfig/DetailedUsageConfig.svelte";
    import * as Utils from "$lib/utils";
    import type { Impacts } from "$lib/types/impact";
    import { getUserDeviceImpact } from "$lib/api";

    let impacts: Impacts;
    let usageConfig: Usage = {
        avg_power: {
            default: 150,
            value: 150,
            min: 50,
            max: 250,
        },
        use_time_ratio: {
            value: 0.2,
        },
        usage_location: {
            value: "WOR",
            label: "World",
        },
        extendLifetime: {
            value: 0,
        },
        years_life_time: {
            value: 5,
        },
        time_workload: [
            {
                time_percentage: 100,
                load_percentage: 50,
            },
        ],
    };
    export let userDevice: UserDevice = {
        category: "terminal",
        subcategory: "laptop",
        archetype: "laptop-pro",
        usage: {
            usage_location: "WOR",
        },
    };
    let yearly: boolean = false;

    $: userDevice, usageConfig, updateImpact();

    function getExtendLifetimeAvoid(
        lifetime: Number,
        extendlifetime: Number,
        impact: Impacts,
        yearly
    ) {
        let output = {};
        if (extendlifetime == 0) {
            Object.keys(impact.impacts).forEach(function (key) {
                output[key] = { value: 0, unit: impact.impacts[key].unit };
            });
        } else {
            Object.keys(impact.impacts).forEach(function (key) {
                let embedded = impact.impacts[key].embedded.value;
                if (yearly == true) {
                    embedded = lifetime * embedded;
                }
                let avoided = (embedded * extendlifetime) / lifetime;
                if (yearly == true) {
                    avoided = avoided / extendlifetime;
                }
                output[key] = {
                    value: avoided,
                    unit: impact.impacts[key].unit,
                };
            });
        }
        return output;
    }
    async function updateImpact() {
        impacts = await getUserDeviceImpact(userDevice, yearly);
        impacts.avoided = getExtendLifetimeAvoid(
            usageConfig.years_life_time.value,
            usageConfig.extendLifetime.value,
            impacts,
            yearly
        );
    }
</script>

<div id="content" class="px-1">
    <h2 class="title-second mt-2 mb-4 w-full px-4">
        {$_("terminal-impact.title")}
    </h2>
    <div class="grid md:grid-cols-12 gap-1">
        <div class="min-h-[200px] md:col-span-5 px-1 w-full">
            <form>
                <h2 class="mb-2 mx-2 text-2xl font-bold">
                    {$_("terminal-config.configuration")}
                </h2>
                <div
                    id="terminalconfig-usage"
                    class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1"
                >
                    <UserDeviceConfig
                        bind:userDeviceConfig={userDevice}
                        bind:usageConfig
                    />
                </div>
                <h2 class="m-2 text-2xl font-bold">
                    {$_("terminal-config.usage")}
                </h2>
                <div
                    id="terminalconfig-usage"
                    class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 grid gap-1"
                >
                    <UsageConfig
                        bind:usage={userDevice.usage}
                        bind:usageConfig
                        usageType="Terminal"
                    />
                    <p
                        on:click={() =>
                            Utils.toggleElement("usageconfig-detailed")}
                        class="ml-2 block w-full col-span-6"
                    >
                        <a class="text-xs" href="javascript:void(0);"
                            >> {$_("detailed-config.show-usage")}</a
                        >
                    </p>
                    <div id="usageconfig-detailed" class="hidden col-span-6">
                        <DetailedUsageConfig bind:serverImpact={impacts} />
                    </div>
                </div>
            </form>
        </div>

        <div class="px-1 md:col-span-7">
            <h2 class="mb-2 mx-2 text-2xl font-bold">
                {$_("impacts.Results")}
            </h2>
            {$_("pie.total")}
            <label class="mw-1/3 switch">
                <input
                    type="checkbox"
                    id="yearlycheck"
                    bind:checked={yearly}
                    on:change={updateImpact}
                />
                <span class="slider round" />
            </label>
            {$_("pie.yearly")}
            <ResultGrid {impacts} />
        </div>
    </div>
    <div
        class="m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    >
        <h3 class="text-xl font-bold">{$_("terminal-impact-desc.how")}</h3>
        <p class="mb-2">
            {$_("terminal-impact-desc.how_content1")}
            <a
                href={$_("terminal-impact-desc.articlelink")}
                class="no-underline hover:underline blue text-sky-800"
                target="_blank">{$_("terminal-impact-desc.how_content2")}</a
            >.
            {$_("terminal-impact-desc.how_content3")}
            <a
                href="https://doc.api.boavizta.org/"
                class="no-underline hover:underline blue text-sky-800"
                target="_blank">doc.api.boavizta.org</a
            >.
        </p>
        <h3 class="text-xl font-bold">{$_("terminal-impact-desc.further")}</h3>
        <p class="">
            {$_("terminal-impact-desc.further_content1")}
            <a
                href="https://github.com/boavizta/boaviztapi/"
                class="no-underline hover:underline blue text-sky-800"
                target="_blank">BoaviztAPI</a
            >{$_("terminal-impact-desc.further_content2")}
        </p>
    </div>
</div>
