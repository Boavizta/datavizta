<script>
    import "../global.css";
    import "../i18n";
    import { isLoading } from "svelte-i18n";
    import { _, locale, getLocaleFromNavigator } from "svelte-i18n";
    import "../app.css";
    import "../ext/github-ribbon.css";



    import DataExplorer from "$lib/DataExplorer.svelte";
   
    //renamed file https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3294867

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
    <a class="mr-5 hover:text-gray-900">Manufacturing Data</a>
    <a class="mr-5 hover:text-gray-900">Impacts of servers</a>
    <!--language switch-->
    <input id="switch-language-button" class="mb-5 ml-auto cursor-pointer" title="Choose language" on:click={updateLanguage} value={language} style="width: 20px;"/>
</div>

{#if !$isLoading}
    <slot />
{/if}

