<script lang="ts">
    import type ConfigurationTerminal from "$lib/types/hardware";
    import { _ } from "svelte-i18n";
    import Select from "svelte-select"
    import {onMount} from "svelte";
    import {get} from "$lib/api";

    /*Bound var*/
    export let terminalConfig: ConfigurationTerminal

    let terminal_categories_route = "user_terminal/all_categories";
    let terminal_subcategories_route = "user_terminal/all_subcategories"

    let locaitems = []
    let terminal_categories = []
    let terminal_subcategories = []

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
        terminal_categories = await getitems(terminal_categories_route);
        terminal_subcategories = await getAllInstances("laptop");
        terminalConfig.category = "laptop";
        terminalConfig.subcategory = await getfirstitem(terminal_subcategories_route+"?device_type="+terminalConfig.category);
    })

    async function category_select(event){
        terminalConfig.category = event.detail.value
        terminal_subcategories = await getAllInstances(event.detail.value)
        terminalConfig.subcategory = await getfirstitem(terminal_subcategories_route+"?device_type="+terminalConfig.category);
    }

    function subcategory_select(event){
        terminalConfig.subcategory = event.detail.value
    }

    function getAllInstances(category) {
        return get(terminal_subcategories_route+"?device_type="+category).then((response) => response.json())
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
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-impact.category')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={terminal_categories} on:select={category_select} value="{terminalConfig.category}"/>
        </div>
    </div>
    <div class="relative min-w-[100px] w-full mb-2 group">
        <label class="block text-sm font-medium text-gray-900">{$_('terminal-impact.subcategory')}</label>
        <div style="--borderRadius: 0.5em;">
            <Select items={terminal_subcategories} on:select={subcategory_select} value="{terminalConfig.subcategory}"/>
        </div>
    </div>
