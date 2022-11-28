<script>
        import { _} from "svelte-i18n";
        import DataExplorer from "$lib/DataExplorer.svelte";
</script>
<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_('index.title1')}</h2>
    <div class="mb-3">
        <p class="text-sm mb-2">
            {$_('index.explanation.1')}<a class="link" href="https://boavizta.org" target="_blank">Boavizta</a>{$_('index.explanation.1bis')}
        </p>
        <p class="text-sm mb-2">
            {$_('index.explanation.2')}
        </p>
        <p class="text-sm mb-2">
            {$_('index.explanation.3')}
        </p>
        <p class="text-sm mb-2">
            {$_('index.explanation.4')}
        </p>
    </div>
    <h2 class="title-second mt-2">{$_('index.title2')}</h2>
    <div class="mb-3">
        <h3 class="title-third mt-2">{$_('manufdata.title')}</h3>
        <p class="text-sm mb-2">
            {$_('index.explanation.5')}
        </p>
        <ul class="text-sm pl-4">
            <li>{$_('index.explanation.6')} <a class="link" href="https://github.com/Boavizta/environmental-footprint-data" target="_blank">{$_('index.explanation.7')}</a></li>
            <li>{$_('index.explanation.8')}</li>
            <li>{$_('index.explanation.9')}</li>
        </ul>
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" onclick="window.location.href='/manufacturerdata'">{$_('index.button.1')}</button>
        <h3 class="title-third mt-2">{$_('server-impact.title')}</h3>
        <p class="text-sm mb-2">
            {$_('index.explanation.10')}
        </p>
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" onclick="window.location.href='/serversimpact'">{$_('index.button.2')}</button>
    </div>
</div>
