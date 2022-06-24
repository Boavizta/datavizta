<script lang="ts">
    import html2canvas from 'html2canvas';
    import {_} from 'svelte-i18n';

    let imageUrlData = null;

    async function downloadImage() {
        const canvas = await html2canvas(document.getElementById('viz-container'));
        imageUrlData = canvas.toDataURL("image/png");
    }

</script>

{#if imageUrlData}
    <a id="viz-download" download="boavizta-gwp-by-equipment.png" href={imageUrlData} class="my-2 inline-block bg-teal-600 hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-7 border border-teal-600 rounded">
        {$_('pie.download')}
    </a>
{:else}
    <button on:click={downloadImage} class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border  rounded">
        {$_('pie.exportPNG')}
    </button>
{/if}