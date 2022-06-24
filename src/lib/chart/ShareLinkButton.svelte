<script lang="ts">
    import type { FlatFilterModel, RegionPickerItem } from '$lib/customType';

    import {_} from 'svelte-i18n';
    import { CopyButton } from "carbon-components-svelte";

    export let lifetime:number;
    export let selectedRegion:RegionPickerItem;
    export let yearly:boolean;
    export let filterModels:FlatFilterModel; 
    import * as paramParser from '../paramParser';
    let shareLink;

    $: shareLink = window.location.origin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels);



    function toUrl():void {
        //shareLink = 
        //console.log(shareLink)
    }
    
    //onfocus copy the link into clipboard
    function onFocus(evt){
        evt.target.select();
        document.execCommand('copy');
    }

    const handleSuccessfullyCopied = (e) => {
      alert(`successfully copied to clipboard!`);
  }

  const handleFailedCopy = () => {
      alert('failed to copy :(');
  }
</script>

<div class="flex">

    <!-- <button on:click={toUrl} class=" inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded"> -->
    <!-- <button on:click={toUrl} class=" inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">

    {$_('pie.share')}
</button> -->
{#if shareLink}
    <div class="flex">
            
        <span class="py-2 px-1">Partager</span>
            <input id="shareLinkInput" class="px-1 w-auto" value={shareLink} on:focus={onFocus}/>
            <!-- <CopyToClipboard text={shareLink} on:copy={handleSuccessfullyCopied} on:fail={handleFailedCopy} let:copy>
                <button on:click={copy} class="my-2 inline-block bg-teal-600 hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">    
                    {$_('pie.copy')}
                </button>
                
        </CopyToClipboard> -->
        <CopyButton class="bg-gray-100 border-teal-600" text={shareLink} iconDescription={$_('pie.copy')} feedback={$_('pie.copied')}/>
    </div>
  {/if}
  </div>