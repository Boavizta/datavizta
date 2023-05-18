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
    let selectedlocation ="World"

    onMount(async () => { 
        locaitems = await getlocalisation(localisation_route);
        usageConfig.usage_location = "World"
        usageConfig.time_workload.time_percentage = [30,30,40]
        usageConfig.time_workload.load_percentage = [50,30,10]
        console.log(usageConfig.time_workload.load_percentage[0])
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
            if ( usageType != "Cloud"){
                usage.hours_electrical_consumption = null
                document.getElementById('elec').style.display = 'none';
            }
        } else if(event.detail.value == "ExtLoad"){
            
            updateExtTimeWorkLoad()
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'grid';
            if ( usageType != "Cloud"){
                usage.hours_electrical_consumption = null
                document.getElementById('elec').style.display = 'none';
            }
        } else {
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'none';
            if ( usageType != "Cloud"){
                usage.hours_electrical_consumption = usageConfig.hours_electrical_consumption.value
                usage.time_workload = []
                document.getElementById('elec').style.display = 'grid';
            }
        }
    }
    function updateTimeWorkLoad(){
        usage.time_workload = [
                    {
                        time_percentage: 100,
                        load_percentage: usageConfig.time_workload.load_percentage[0]
                    }
                    ]
    }
    function updateExtTimeWorkLoad(){
        usage.time_workload = [
                    {
                        time_percentage: usageConfig.time_workload.time_percentage[0],
                        load_percentage: usageConfig.time_workload.load_percentage[0]
                    },
                    {
                        time_percentage: usageConfig.time_workload.time_percentage[1],
                        load_percentage: usageConfig.time_workload.load_percentage[1]
                    },
                    {
                        time_percentage: usageConfig.time_workload.time_percentage[2],
                        load_percentage: usageConfig.time_workload.load_percentage[2]
                    }
                    ]
    }
    
    function changeExtUsageTime(event,i:Integer){
        let b = 0   
        if (i == 0) {
            b = 1
        }
        if ( (parseInt(usageConfig.time_workload.time_percentage[b]) + parseInt(event.target.value)) <= 100 ) {
            usageConfig.time_workload.time_percentage[i] = event.target.value
            usageConfig.time_workload.time_percentage[2] = 100 - usageConfig.time_workload.time_percentage[0] - usageConfig.time_workload.time_percentage[1]
            updateExtTimeWorkLoad()
        } else {
            alert("Total time could not exceed 100%")
            usageConfig.time_workload.time_percentage[i] = event.target.oldvalue
        }
    }
    function changeElecCons() {
        usage.hours_electrical_consumption = usageConfig.hours_electrical_consumption.value
    }

    function changeUsageTime() {
        usage.hours_use_time = usageConfig.use_time.hours_per_day * usageConfig.life_time.value * 365
    }

    function changeUsageLoad(event,i:Integer,ext:Boolean){
            if (event.target.value > 100){
                usageConfig.time_workload.load_percentage[i] = 100
            } else {
                usageConfig.time_workload.load_percentage[i] = event.target.value
            }
            if (ext == true) {
                updateExtTimeWorkLoad()
            } else {
                updateTimeWorkLoad()
            }
    }
    
    function region_select(event){
        usage.usage_location = event.detail.value
        selectedlocation = event.detail.label
    }

</script>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.localisation')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select id="select-region" items={locaitems} on:select={region_select} value={usageConfig.usage_location}/>
            </div>
        </div>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.lifespan')}</label>
            <input bind:value={usageConfig.life_time.value} on:change={changeUsageTime} type="number" min="1" max="15" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
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
                        <input bind:value={usageConfig.use_time.hours_per_day} on:change={changeUsageTime} type="number" min="0" max="24" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
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
            <input bind:value={usageConfig.hours_electrical_consumption.value} on:change={changeElecCons} type="number" min={usageConfig.hours_electrical_consumption.min} max={usageConfig.hours_electrical_consumption.max} class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {#if (usageType != "Terminal")}
            <div class="hidden relative col-span-3 w-full mb-2 group" id="load">
                <label class="block text-sm font-medium text-gray-900">{$_('usage-config.load')}</label>
                <input bind:value={usageConfig.time_workload.load_percentage[0]} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
            </div>
        {/if}
        {:else}
        <div class="block relative col-span-3 w-full mb-2 group" id="load">
            <label class="block text-sm font-medium text-gray-900">{$_('usage-config.load')}</label>
            <input bind:value={usageConfig.time_workload.load_percentage[0]} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {/if}
        {#if (usageType != "Terminal")}
            <div id="extload" class="hidden col-span-6 grid grid-cols-6 gap-2">
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 1/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                    <input bind:value={usageConfig.time_workload.time_percentage[0]} on:change={(event)=>{changeExtUsageTime(event,0)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload.load_percentage[0]} on:change={(event)=>{changeUsageLoad(event,0,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 2/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                    <input bind:value={usageConfig.time_workload.time_percentage[1]} on:change={(event)=>{changeExtUsageTime(event,1)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload.load_percentage[1]} on:change={(event)=>{changeUsageLoad(event,1,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
                <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                    <p class="text-center">{$_('usage-methods.timeslot')} 3/3</p>
                    <label class="mx-2 block text-xs font-medium text-gray-900" >{$_('usage-methods.time')} (%)</label>
                    <input disabled bind:value={usageConfig.time_workload.time_percentage[2]} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                    <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                    <input bind:value={usageConfig.time_workload.load_percentage[2]} on:change={(event)=>{changeUsageLoad(event,2,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                </div>
            </div>
            {/if}
