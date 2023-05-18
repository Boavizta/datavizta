<script lang="ts">
    import type { ConfigurationTerminal, Usage} from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import type { Impacts } from "$lib/types/impact";

    /*Bound var*/
    export let terminalConfig: ConfigurationTerminal
    export let usageConfig: Usage

    let terminal_categories_route = "user_terminal/all_categories";
    let terminal_archetypes_route = "user_terminal/archetypes";
    let terminal_UsageDefaultValues_route = "user_terminal/archetype_config";

    let terminal_categories = []
    let terminal_archetypes = []

    function getitems(route) {
        return get(route).then((response) => response.json())
            .then((data) => {
                let elements = [];
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }

    function getfirstitem(route) {
        return get(route).then((response) => response.json())
            .then((data) => {
                return data[0]
            });
    }

    async function updateDefaultUsageValues() {
        let temp = await getUsageDefaultValues(terminalConfig.archetype)
        terminalConfig.usage.hours_electrical_consumption = temp["USAGE"]["hours_electrical_consumption"]["default"]
        terminalConfig.usage.hours_use_time = temp["USAGE"]["use_time"]["default"]
        terminalConfig.category = temp["device_type"]["default"]
        usageConfig.hours_electrical_consumption.default = temp["USAGE"]["hours_electrical_consumption"]["default"]
        usageConfig.hours_electrical_consumption.value = temp["USAGE"]["hours_electrical_consumption"]["default"]
        usageConfig.hours_electrical_consumption.min = temp["USAGE"]["hours_electrical_consumption"]["min"]
        usageConfig.hours_electrical_consumption.max = temp["USAGE"]["hours_electrical_consumption"]["max"]
        usageConfig.life_time.value = temp["USAGE"]["life_time"]["default"] / 365 / 24
        usageConfig.use_time.value = temp["USAGE"]["use_time"]["default"]
        usageConfig.use_time.life_time_ratio =  temp["USAGE"]["use_time"]["default"] / temp["USAGE"]["life_time"]["default"]
        usageConfig.use_time.hours_per_day = 24 * usageConfig.use_time.life_time_ratio
    } 

    onMount(async () => { 
        terminal_categories = await getitems(terminal_categories_route);
        terminal_archetypes = await getArchetypes("laptop");
        terminalConfig.category = "laptop";
        terminalConfig.archetype = terminal_archetypes[0].value
        updateDefaultUsageValues()
    })

    async function category_select(event){
        terminalConfig.category = event.detail.value
        terminal_archetypes = await getArchetypes(event.detail.value)
        terminalConfig.archetype = terminal_archetypes[0].value
        let temp = await getUsageDefaultValues(terminalConfig.archetype)
        updateDefaultUsageValues()
    }

    function archetype_select(event){
        terminalConfig.archetype = event.detail.value
    }

    function getArchetypes(category) {
        return get(terminal_archetypes_route+"?name="+category).then((response) => response.json())
            .then((data) => {
                let elements = [];
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }

    function getUsageDefaultValues(archetype) {
        return get(terminal_UsageDefaultValues_route+"?archetype="+archetype).then((response) => response.json())
    }
   $: usageConfig

</script>

  <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-config.category')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={terminal_categories} on:select={category_select} value="{terminalConfig.category}"/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-config.subcategory')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={terminal_archetypes} on:select={archetype_select} value="{terminalConfig.archetype}"/>
        </div>
    </div>
