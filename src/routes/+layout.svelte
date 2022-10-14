<script>
    import "../global.css";
    import "../i18n";
    import { isLoading } from "svelte-i18n";
    import { _, locale, getLocaleFromNavigator } from "svelte-i18n";
    import "../app.css";
    import "../ext/github-ribbon.css";
   
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


<div id="navbar" class="flex flex-wrapflex-col md:flex-row">
    <div class="flex title-font font-medium items-center mb-4 md:mb-0">
        <a href="https://boavizta.org"><img id="logo" style="height: 47px;width: 32px;" src="./boavizta-logo-4.png" alt="Boavizta"></a>
        <h1 class="title-main">Datavizta</h1>
    </div>
    <nav class="md:mr-auto md:ml-4 md:py-1 md:pl-4 border-solid md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
        <a class="mr-5 hover:text-boavizta_green text-boavizta_blue" href="/">{$_('nav.manufacturer')}</a>
        <a class="mr-5 hover:text-boavizta_green text-boavizta_blue" href="/serversimpact">{$_('nav.server-impact')}</a>
    </nav>
    <!--language switch-->
    <input id="switch-language-button" class="mb-5 ml-auto cursor-pointer" title="Choose language" on:click={updateLanguage} value={language} style="width: 20px;"/>
</div>

{#if !$isLoading}
    <slot />
{/if}

