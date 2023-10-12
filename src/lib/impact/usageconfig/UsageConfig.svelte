<script lang="ts">
    import type {Usage, UsageRequest} from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";

    /*Bound var*/
    export let usage: UsageRequest
    export let usageType: string
    export let usageConfig: Usage

    let localisation_route = "utils/country_code";
    let locaitems = []
    let selectedRegionLabel = "World"

    onMount(async () => { 
        locaitems = await getlocalisation(localisation_route);
        usage.use_time_ratio = usageConfig.use_time_ratio.hours_per_day / 24
        usage.avg_power = null
        usageConfig.time_workload = [ {
            time_percentage : 30,
            load_percentage : 50
        },
        {
            time_percentage : 30,
            load_percentage : 30
        },
        {
            time_percentage : 40,
            load_percentage : 10
        }]
    })

    function getlocalisation(route) {
        return get(route).then((response) => response.json())
            .then((data) => {
                let elements = [];
                let items = Object.keys(data)
                for (let i = 0; i < items.length; i++) {
                    elements.push({value: data[items[i]], label: items[i]});
                }
                return elements
            });
    }

    function change_method(event){
        if(event.detail.value == "Load"){
            updateTimeWorkLoad()
            document.getElementById('load').style.display = 'block';
            document.getElementById('extload').style.display = 'none';
            usage.avg_power = null
            if ( usageType != "Cloud"){
                document.getElementById('elec').style.display = 'none';
            }
        } else if(event.detail.value == "ExtLoad"){
            updateExtTimeWorkLoad()
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'grid';
            usage.avg_power = null
            if ( usageType != "Cloud"){
                document.getElementById('elec').style.display = 'none';
            }
        } else {
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'none';
            if ( usageType != "Cloud"){
                usage.avg_power = usageConfig.avg_power.value
                usage.time_workload = []
                document.getElementById('elec').style.display = 'grid';
            }
        }
    }
    function updateTimeWorkLoad(){
        usage.time_workload = [
                    {
                        time_percentage: 100,
                        load_percentage: usageConfig.time_workload[0].load_percentage
                    }
                    ]
    }
    function updateExtTimeWorkLoad(){
        usage.time_workload = usageConfig.time_workload
    }
    
    function changeExtUsageTime(event,i:Integer){
        let b = 0   
        if (i == 0) {
            b = 1
        }
        if ( parseInt(usageConfig.time_workload[b].time_percentage) + parseInt(event.target.value) <= 100 ) {
            usageConfig.time_workload[i].time_percentage = event.target.value
            usageConfig.time_workload[2].time_percentage = 100 - usageConfig.time_workload[0].time_percentage - usageConfig.time_workload[1].time_percentage
            updateExtTimeWorkLoad()
        } else {
            alert("Total time could not exceed 100%")
            usageConfig.time_workload[i].time_percentage = 0
            usageConfig.time_workload[2].time_percentage = 100 - usageConfig.time_workload[0].time_percentage - usageConfig.time_workload[1].time_percentage
        }
    }
    function changeElecCons() {
        usage.avg_power = usageConfig.avg_power.value
    }

    function changeLifeTime() {
        usage.hours_life_time = usageConfig.years_life_time.value * 365 * 24
    }
    function changeTimeRatio() {
        usage.use_time_ratio = usageConfig.use_time_ratio.hours_per_day / 24
    }

    function changeUsageLoad(event,i:Integer,ext:Boolean){
            if (event.target.value > 100){
                usageConfig.time_workload[i].load_percentage = 100
            } else {
                usageConfig.time_workload[i].load_percentage = event.target.value
            }
            if (ext == true) {
                updateExtTimeWorkLoad()
            } else {
                updateTimeWorkLoad()
            }
    }
    
    function region_select(event){
        usageConfig.usage_location.value = event.detail.value
        usageConfig.usage_location.label = event.detail.label
        usage.usage_location = usageConfig.usage_location.value
    }

</script>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.localisation')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select id="select-region" items={locaitems} on:select={region_select} value={selectedRegionLabel}/>
            </div>
        </div>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.lifespan')}</label>
            <input bind:value={usageConfig.years_life_time.value} on:change={changeLifeTime} type="number" min="1" max="15" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative col-span-3 w-full mb-2 group">
                {#if (usageType != "Cloud")}
                    {#if (usageType != "Terminal")}
                    <label class="block text-sm font-medium text-gray-900">{$_('usage-config.method')}</label>
                     <div style="--borderRadius: 0.5em;">
                        <Select items={[{value: 'Electricity', label: $_('usage-methods.elec')},{value: 'Load', label: $_('usage-methods.load')},{value: 'ExtLoad', label: $_('usage-methods.extload')}]} on:select={change_method} value="{$_('usage-methods.elec')}"/>
                    </div>
                    {:else}
                    <label class="block text-sm font-medium text-gray-900">{$_('usage-config.hoursperday')}</label>
                    <div style="--borderRadius: 0.5em;">
                        <input bind:value={usageConfig.use_time_ratio.hours_per_day} on:change={changeTimeRatio} type="number" min="0" max="24" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                    </div>
                    {/if}
                {:else}
                <label class="block text-sm font-medium text-gray-900">{$_('usage-config.method')}</label>
                <div style="--borderRadius: 0.5em;">
                    <Select items={[{value: 'Load', label: $_('usage-methods.load')},{value: 'ExtLoad', label: $_('usage-methods.extload')}]} on:select={change_method} value="{$_('usage-methods.load')}"/>
                </div>
                {/if}
        </div>
        {#if (usageType != "Cloud")}
        <div class="relative w-full mb-2 group" id="elec">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.avrg_elec')}</label>
            <input bind:value={usageConfig.avg_power.value} on:change={changeElecCons} type="number" min={usageConfig.avg_power.min} max={usageConfig.avg_power.max} class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {#if (usageType != "Terminal")}
            <div class="hidden relative col-span-3 w-full mb-2 group" id="load">
                <label class="block text-sm font-medium text-gray-900">{$_('usage-config.load')}</label>
                <input bind:value={usageConfig.time_workload[0].load_percentage} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
            </div>
        {/if}
        {:else}
        <div class="block relative col-span-3 w-full mb-2 group" id="load">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.load')}</label>
            <input bind:value={usageConfig.time_workload[0].load_percentage} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {/if}
        {#if (usageType != "Terminal")}
            <div id="extload" class="hidden col-span-6 grid grid-cols-6 gap-2">
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 1/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                    <input bind:value={usageConfig.time_workload[0].time_percentage} on:change={(event)=>{changeExtUsageTime(event,0)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload[0].load_percentage} on:change={(event)=>{changeUsageLoad(event,0,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 2/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                    <input bind:value={usageConfig.time_workload[1].time_percentage} on:change={(event)=>{changeExtUsageTime(event,1)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload[1].load_percentage} on:change={(event)=>{changeUsageLoad(event,1,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 3/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900" >{$_('usage-methods.time')} (%)</label>
                    <input disabled bind:value={usageConfig.time_workload[2].time_percentage} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload[2].load_percentage} on:change={(event)=>{changeUsageLoad(event,2,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
            </div>
            {/if}
