<script lang="ts">
    import {_} from 'svelte-i18n';

    export let lifetime;
    export let selectedRegion;
    export let yearly;
    export let filterModels; 
    import * as paramParser from '../paramParser';

    let shareLink;
        

    function toUrl():void {
        shareLink = window.location.origin +"?"+paramParser.buildLink(lifetime, selectedRegion, yearly, filterModels)
        console.log(shareLink)
    }

     function fromQueryParam(queryParam:string){

    }
    
    function selectShareLinkInput(){
        //does not work
        let input = document.getElementById('shareLinkInput');
        input.focus();
        input.select();
    }

</script>


<button on:click={toUrl} class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border border-teal-600 rounded">
    {$_('pie.share')}
</button>
{#if shareLink}
    <input id="shareLinkInput" class="" value={shareLink} on:change={selectShareLinkInput}/>
{/if}