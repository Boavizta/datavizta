<script lang="ts">
    import type { FlatFilterModel, RegionPickerItem } from '$lib/customType';
    import {_} from 'svelte-i18n';
    import {onMount} from "svelte";
    import * as paramParser from '../paramParser';

    export let lifetime:number;
    export let selectedRegion:RegionPickerItem;
    export let yearly:boolean;
    export let filterModels:FlatFilterModel;
    export let singleItemSelected:string;

    let windowOrigin;
    let shareLink;
    let tooltipText=$_('pie.copy');

    onMount(() => {
        windowOrigin=  window.location.origin
    })
    $: shareLink = windowOrigin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels, singleItemSelected);

    function copyToClipboard() {
		navigator.clipboard.writeText(shareLink);
        tooltipText=$_('pie.copied')
	}    

    function handleTooltipClose() {
        tooltipText=$_('pie.copy');
    }

</script>
<style>

    
</style>

<div class="flex">
{#if shareLink}
    <div class="flex"> 
        <span class="font-medium self-center px-1">{$_('pie.share')}</span>
        <input id="shareLinkInput" class="px-1 w-auto" value={shareLink}/>
        <button id="shareLinkButton" on:click={copyToClipboard} class="tooltip p-3 bg-boavizta_blue hover:bg-teal-800 rounded-tr rounded-br shareLinkButton white fill-white" text={shareLink} on:mouseleave={handleTooltipClose} >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" preserveAspectRatio="xMidYMid meet" width="16" height="16" aria-hidden="true" class="bx--snippet__icon"><path d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"></path><path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z"></path></svg>
            <span class="tooltiptext">{tooltipText}</span>
        </button>
    </div>
{/if}
</div>

