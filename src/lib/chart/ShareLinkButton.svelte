<script lang="ts">
    import type { FlatFilterModel, RegionPickerItem } from '$lib/customType';
    import {_} from 'svelte-i18n';
    import {onMount} from "svelte";
    import { CopyButton } from "carbon-components-svelte";
    import * as paramParser from '../paramParser';

    export let lifetime:number;
    export let selectedRegion:RegionPickerItem;
    export let yearly:boolean;
    export let filterModels:FlatFilterModel;
    export let singleItemSelected:string;

    let windowOrigin;
    let shareLink;

    onMount(() => {
        windowOrigin=  window.location.origin
    })
    $: shareLink = windowOrigin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels, singleItemSelected);


</script>
<style>

    
</style>

<div class="flex">
{#if shareLink}
    <div class="flex">
            
        <span class="font-medium self-center px-1">{$_('pie.share')}</span>
            <input id="shareLinkInput" class="px-1 w-auto" value={shareLink}/>
            <CopyButton id="shareLinkButton" class="bg-boavizta_blue hover:bg-teal-800 rounded-tr rounded-br shareLinkButton white fill-white" text={shareLink} iconDescription={$_('pie.copy')} feedback={$_('pie.copied')}/>
    </div>
  {/if}
  </div>

