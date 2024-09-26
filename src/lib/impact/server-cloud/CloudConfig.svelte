<script lang="ts">
    import type { Cloud } from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";

    /*Bound var*/
    export let cloudConfig: Cloud

    let cloud_providers_route = "cloud/instance/all_providers";
    let cloud_instances_route = "cloud/instance/all_instances"

    let locaitems = []
    let cloud_providers = []
    let cloud_instances = []

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

    onMount(async () => { 
        cloud_providers = await getitems(cloud_providers_route);
        cloud_instances = await getAllInstances("aws");
        cloudConfig.provider = "aws";
        cloudConfig.instance_type = await getfirstitem(cloud_instances_route+"?provider="+cloudConfig.provider);
    })

    async function provider_select(event){
        cloudConfig = {
            "instance_type": await getfirstitem(cloud_instances_route+"?provider="+event.detail.value),
            "provider":event.detail.value
        }
        cloud_instances = await getAllInstances(event.detail.value)
        
    }

    function instance_select(event){
        cloudConfig.instance_type = event.detail.value
    }

    function getAllInstances(cloud_provider) {
        return get(cloud_instances_route+"?provider="+cloud_provider).then((response) => response.json())
            .then((data) => {
                let elements = [];
                for(let i = 0; i < data.length; i++) {
                    elements.push({value: data[i], label: data[i]});
                }
                return elements
            });
    }
   
</script>

  <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('cloud-config.provider')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={cloud_providers} on:select={provider_select} value="{cloudConfig.provider}"/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('cloud-config.instance_type')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={cloud_instances} on:select={instance_select} value="{cloudConfig.instance_type}"/>
        </div>
    </div>
