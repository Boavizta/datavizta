<script lang="ts" xmlns="http://www.w3.org/1999/html">
    import { _, init } from "svelte-i18n";
    import DataExplorer from "$lib/DataExplorer.svelte";
    let language="EN";
    let updateDataExplorerChild;
    function updateLanguage(){
        if ( language == "EN") {
            init({
                fallbackLocale: 'fr',
                initialLocale: 'en'
            })
            language="FR";
        } else {
            init({
                fallbackLocale: 'fr',
                initialLocale: 'fr'
            })
            language="EN";
        }
        updateDataExplorer();
    };

    function updateDataExplorer() {
        updateDataExplorerChild();
    };

</script>

<div id="navbar">
    <a href="https://boavizta.org"><img id="logo" style="height: 47px;width: 32px;" src="./boavizta-logo-4.png" alt="Boavizta"></a>
    <h1 class="title-main">Boavizta Dataviz</h1>
    <!--language switch-->
    <a class="text-right flex-auto mb-5" title="Choose language"  href on:click={updateLanguage} >{language}</a>
</div>
<div id="content" class="px-4">
    <h2 class="title-second">{$_('index.title')}</h2>

    <div class="">
        <div class="mb-3">
            <p class="text-sm mb-2">
                {$_('explanation.1')}
            </p>

            <ul class="text-sm pl-4">
                <li>{$_('explanation.2')} <a class="link" href="https://github.com/Boavizta/environmental-footprint-data" target="_blank">{$_('explanation.3')}</a></li>
                <li>{$_('explanation.4')}</li>
                <li>{$_('explanation.5')}</li>
            </ul>
            <p class="text-sm mb-2">
                {$_('explanation.10')} <a class="link" href={$_('explanation.12')} target="_blank">{$_('explanation.11')}</a>
            </p>
        </div>

    </div>

    <h3 class="title-second">{$_('index.sub-title')}</h3>
    <div class="text-sm mb-2">
        {$_('explanation.6')}
    </div>

    <h3 class="title-second">{$_("index.sub-title")}</h3>
    <div class="text-sm mb-2">
        {$_("explanation.6")}
    </div>
    <DataExplorer bind:dataExplorerUpdate={updateDataExplorerChild}/>
</div>
