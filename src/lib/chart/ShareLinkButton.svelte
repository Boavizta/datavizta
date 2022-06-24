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
    export let notAvailable:boolean;

    let windowOrigin;
    let shareLink;

    onMount(() => {
        windowOrigin=  window.location.origin
    })
    $: shareLink = windowOrigin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels);


</script>

<div class="flex">

    <!-- <button on:click={toUrl} class=" inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded"> -->
    <!-- <button on:click={toUrl} class=" inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">

    {$_('pie.share')}
</button> -->
{#if shareLink}
    <div class="flex">
            
        <span class="py-2 px-1">{$_('pie.share')}</span>
            <!-- <CopyToClipboard text={shareLink} on:copy={handleSuccessfullyCopied} on:fail={handleFailedCopy} let:copy>
                <button on:click={copy} class="my-2 inline-block bg-teal-600 hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">    
                    {$_('pie.copy')}
                </button>
                
        
                                    
        </CopyToClipboard> -->

        {#if notAvailable}
            <span class="font-extralight text-xs">
                {$_('pie.share-not-available')}
            </span>
        {:else}
            <input id="shareLinkInput" class="px-1 w-auto" value={shareLink}/>
            <CopyButton class="bg-gray-100 border-teal-600" text={shareLink} iconDescription={$_('pie.copy')} feedback={$_('pie.copied')}/>
        {/if}
    </div>
  {/if}
  </div>