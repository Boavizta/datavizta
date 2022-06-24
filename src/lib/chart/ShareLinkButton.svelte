<script lang="ts">
    import type { FlatFilterModel, RegionPickerItem } from '$lib/customType';

    import {_} from 'svelte-i18n';
	import { onMount } from 'svelte'

    export let lifetime:number;
    export let selectedRegion:RegionPickerItem;
    export let yearly:boolean;
    export let filterModels:FlatFilterModel; 
    import * as paramParser from '../paramParser';

    let shareLink;



    function toUrl():void {
        shareLink = window.location.origin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels)
        //console.log(shareLink)
    }
    
  
    //onfocus copy the link into clipboard
    function onFocus(evt){
        evt.target.select();
        document.execCommand('copy');
    }
</script>


<button on:click={toUrl} class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">
    {$_('pie.share')}
</button>
{#if shareLink}
    <input id="shareLinkInput" class="" value={shareLink} on:focus={onFocus}/>
{/if}