<script lang="ts">
    import type { Usage, UserDevice} from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import type { Impacts } from "$lib/types/impact";

    /*Bound var*/
    export let userDeviceConfig: UserDevice
    export let usageConfig: Usage

    let device_types = []
    let archetypes = []
    let items = [{value:'terminal', label:$_('terminal-config.terminals')},{value:'peripheral', label:$_('terminal-config.peripherals')}]
    let category = {value:"terminal", label:$_('terminal-config.terminals')}

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

    async function updateDefaultUsageValues(category, subcategory, archetype) {
        let temp = await getUsageDefaultValues(category, subcategory, archetype)
        usageConfig.avg_power.default = temp["USAGE"]["avg_power"]["default"]
        usageConfig.avg_power.value = temp["USAGE"]["avg_power"]["default"]
        usageConfig.avg_power.min = temp["USAGE"]["avg_power"]["min"]
        usageConfig.avg_power.max = temp["USAGE"]["avg_power"]["max"]
        usageConfig.life_time.value = Math.round(temp["USAGE"]["life_time"]["default"] / 365 / 24)
        usageConfig.use_time_ratio.value = temp["USAGE"]["use_time_ratio"]["default"]
        usageConfig.use_time_ratio.hours_per_day = 24 * usageConfig.use_time_ratio.value
        userDeviceConfig = {
            category: userDeviceConfig.category,
            subcategory: temp["device_type"]["default"],
            archetype: userDeviceConfig.archetype,
            usage: { 
                avg_power : temp["USAGE"]["avg_power"]["default"],
                life_time : temp["USAGE"]["life_time"]["default"],
                use_time_ratio : temp["USAGE"]["use_time_ratio"]["default"],
                usage_location : userDeviceConfig.usage.usage_location,
                time_workload : userDeviceConfig.usage.time_workload
            },

        }
    } 

    onMount(async () => { 
        userDeviceConfig.category = "terminal"
        device_types = Object.keys(await getDeviceTypes(userDeviceConfig.category))
        userDeviceConfig.subcategory = device_types[0]
        archetypes = await getArchetypes(userDeviceConfig.category, userDeviceConfig.subcategory);
        userDeviceConfig.archetype = archetypes[0].value
        updateDefaultUsageValues(userDeviceConfig.category, userDeviceConfig.subcategory, userDeviceConfig.archetype)
    })

    async function category_select(event){
        //userDeviceConfig.category=event.detail.value
        category.value=event.detail.value
        const cat=event.detail.value
        device_types = Object.keys(await getDeviceTypes(cat))
        const subcat = device_types[0]
        //userDeviceConfig.subcategory = device_types[0]
        archetypes = await getArchetypes(cat, subcat)
        const arch = archetypes[0].value
        //userDeviceConfig.archetype = archetypes[0].value
        const use = userDeviceConfig.usage
        userDeviceConfig = { category: cat, subcategory: subcat, archetype: arch, usage: use }
        updateDefaultUsageValues(cat, subcat, arch)
    }

    async function device_type_select(event) {
        userDeviceConfig.subcategory = event.detail.value
        archetypes = await getArchetypes(userDeviceConfig.category, userDeviceConfig.subcategory)
        userDeviceConfig.archetype = archetypes[0].value
        updateDefaultUsageValues(userDeviceConfig.category, userDeviceConfig.subcategory, userDeviceConfig.archetype)
    }

    function archetype_select(event){
        userDeviceConfig.archetype = event.detail.value
    }

    function getArchetypes(category, subcategory) {
        return get(category + "/" + subcategory + "/archetypes").then((response) => response.json())
            .then((data) => {
                let elements = [];
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }

    function getUsageDefaultValues(category, subcategory, archetype) {
        return get(category + "/" + subcategory + "/archetype_config?archetype=" + archetype).then((response) => response.json())
    }
    function getDeviceTypes(category) {
        return get(category+"/all").then((response) => response.json())
    }
   $: usageConfig

</script>

  <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-config.category')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={items} on:select={category_select} value={category.value}/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-config.subcategory')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={device_types} on:select={device_type_select} value={userDeviceConfig.subcategory}/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-config.archetype')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={archetypes} on:select={archetype_select} value="{userDeviceConfig.archetype}"/>
        </div>
    </div>
