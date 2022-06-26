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

<div class="flex">
{#if shareLink}
    <div class="flex">
            
        <span class="py-2 px-1">{$_('pie.share')}</span>
            <input id="shareLinkInput" class="px-1 w-auto" value={shareLink}/>
            <CopyButton class="bg-gray-100 border-teal-600" text={shareLink} iconDescription={$_('pie.copy')} feedback={$_('pie.copied')}/>
    </div>
  {/if}
  </div>