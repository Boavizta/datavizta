<script lang="ts" xmlns="http://www.w3.org/1999/html">
    import { _, locale, getLocaleFromNavigator } from "svelte-i18n";
    import DataExplorer from "$lib/DataExplorer.svelte";
   
    function initLanguage() {
        let language;
        if (getLocaleFromNavigator()=="fr") {
            locale.set("fr")
            language="EN";
        } else {
            locale.set("en")
            language="FR";
        }
        return language;
    };
    let language=initLanguage();

    function updateLanguage(){
        if ( language == "EN") {
            locale.set("en")
            language="FR";
        } else {
            locale.set("fr")
            language="EN";
        }
    };

</script>

<div id="navbar">
    <a href="https://boavizta.org"><img id="logo" style="height: 47px;width: 32px;" src="./boavizta-logo-4.png" alt="Boavizta"></a>
    <h1 class="title-main">Datavizta</h1>
    <!--language switch-->
    <input id="switch-language-button" class="mb-5 ml-auto cursor-pointer" title="Choose language" on:click={updateLanguage} value={language} style="width: 20px;"/>
</div>
<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_('index.title')}</h2>

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
                {$_('explanation.10')} <a class="link" href={$_('explanation.12')} target="_blank">{$_('explanation.11')}</a> {$_('explanation.13')}
            </p>
        </div>

    </div>

    <h2 class="title-second">{$_('index.sub-title')}</h2>
    <div class="text-sm mb-2">
        {$_('explanation.6')}
    </div>
    <DataExplorer/>
</div>
