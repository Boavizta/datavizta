<script lang="ts">
    import type {UsageServer} from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";
    import * as Utils from "$lib/utils"

    /*Bound var*/
    export let serverUsage: UsageServer
    export let usageType: string

    let localisation_route = "utils/country_code";
    let locaitems = []
    let extUsageTime = [30,30,40]
    let extUsageLoad = [50,30,10]
    let selectedlocation ="0-Global"
    let elecCons = 150

    onMount(async () => { 
        locaitems = await getlocalisation(localisation_route);
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
            if ( usageType == "server"){
                serverUsage.hours_electrical_consumption = null
                document.getElementById('elec').style.display = 'none';
            }
        } else if(event.detail.value == "ExtLoad"){
            
            updateExtTimeWorkLoad()
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'grid';
            if ( usageType == "server"){
                serverUsage.hours_electrical_consumption = null
                document.getElementById('elec').style.display = 'none';
            }
        } else {
            document.getElementById('load').style.display = 'none';
            document.getElementById('extload').style.display = 'none';
            if ( usageType == "server"){
                serverUsage.hours_electrical_consumption = elecCons
                serverUsage.time_workload=[]
                document.getElementById('elec').style.display = 'grid';
            }
        }
    }
    function updateTimeWorkLoad(){
        serverUsage.time_workload = [
                    {
                        time_percentage: 100,
                        load_percentage: extUsageLoad[0]
                    }
                    ]
    }
    function updateExtTimeWorkLoad(){
        serverUsage.time_workload = [
                    {
                        time_percentage: extUsageTime[0],
                        load_percentage: extUsageLoad[0]
                    },
                    {
                        time_percentage: extUsageTime[1],
                        load_percentage: extUsageLoad[1]
                    },
                    {
                        time_percentage: extUsageTime[2],
                        load_percentage: extUsageLoad[2]
                    }
                    ]
    }
    
    function changeExtUsageTime(event,i:Integer){
        if ( (parseInt(extUsageTime[i]) + parseInt(event.target.value)) <= 100 ) {
            extUsageTime[i] = event.target.value
            extUsageTime[2] = 100 - extUsageTime[0] - extUsageTime[1]
            updateExtTimeWorkLoad()
        } else {
            alert("Total time could not exceed 100%")
            extUsageTime[i] = event.target.oldvalue
        }
    }
    function changeElecCons() {
        serverUsage.hours_electrical_consumption = elecCons
    }
    
    function changeUsageLoad(event,i:Integer,ext:Boolean){
            if (event.target.value > 100){
                extUsageLoad[i] = 100
            } else {
                extUsageLoad[i] = event.target.value
            }
            if (ext == true) {
                updateExtTimeWorkLoad()
            } else {
                updateTimeWorkLoad()
            }
    }
    
    function region_select(event){
        serverUsage.usage_location = event.detail.value
        selectedlocation = event.detail.label
    }

</script>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.localisation')}</label>
            <div style="--borderRadius: 0.5em;">
                <Select id="select-region" items={locaitems} on:select={region_select} value="0-Global"/>
            </div>
        </div>

        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.lifespan')}</label>
            <input bind:value={serverUsage.years_use_time} type="number" min="1" max="64" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="relative col-span-3 w-full mb-2 group">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.method')}</label>
            <div style="--borderRadius: 0.5em;">
                {#if (usageType == "server")}
                <Select items={[{value: 'Electricity', label: $_('usage-methods.elec')},{value: 'Load', label: $_('usage-methods.load')},{value: 'ExtLoad', label: $_('usage-methods.extload')}]} on:select={change_method} value="{$_('usage-methods.elec')}"/>
                {:else}
                <Select items={[{value: 'Load', label: $_('usage-methods.load')},{value: 'ExtLoad', label: $_('usage-methods.extload')}]} on:select={change_method} value="{$_('usage-methods.load')}"/>
                {/if}
            </div>
        </div>
        {#if (usageType == "server")}
        <div class="relative w-full mb-2 group" id="elec">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.avrg_elec')}</label>
            <input bind:value={elecCons} on:change={changeElecCons} type="number" min="10" max="999" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        <div class="hidden relative col-span-3 w-full mb-2 group" id="load">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.load')}</label>
            <input bind:value={extUsageLoad[0]} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {:else}
        <div class="block relative col-span-3 w-full mb-2 group" id="load">
            <label class="block text-sm font-medium text-gray-900">{$_('server-impact.load')}</label>
            <input bind:value={extUsageLoad[0]} on:change={(event)=>{changeUsageLoad(event,0,false)}} type="number" min="0" max="100" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
        </div>
        {/if}
        <div id="extload" class="hidden col-span-6 grid grid-cols-6 gap-2">
            <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 group">
                <p class="text-center">{$_('usage-methods.timeslot')} 1/3</p>
                <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                <input bind:value={extUsageTime[0]} on:change={(event)=>{changeExtUsageTime(event,0)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                <input bind:value={extUsageLoad[0]} on:change={(event)=>{changeUsageLoad(event,0,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
            </div>
            <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                <p class="text-center">{$_('usage-methods.timeslot')} 2/3</p>
                <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.time')} (%)</label>
                <input bind:value={extUsageTime[1]} on:change={(event)=>{changeExtUsageTime(event,1)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                <input bind:value={extUsageLoad[1]} on:change={(event)=>{changeUsageLoad(event,1,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
            </div>
            <div class="p-1 border border-gray-300 rounded-lg relative col-span-2 mb-2 group">
                <p class="text-center">{$_('usage-methods.timeslot')} 3/3</p>
                <label class="mx-2 block text-xs font-medium text-gray-900" >{$_('usage-methods.time')} (%)</label>
                <input disabled bind:value={extUsageTime[2]} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
                <label class="mx-2 block text-xs font-medium text-gray-900">{$_('usage-methods.load')} (%)</label>
                <input bind:value={extUsageLoad[2]} on:change={(event)=>{changeUsageLoad(event,2,true)}} type="number" min="0" max="100" class="mx-1 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-11/12 p-2"/>
            </div>
        </div>
