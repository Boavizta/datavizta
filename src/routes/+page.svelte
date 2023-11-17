<script>
        import { _} from "svelte-i18n";
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
        <h3 class="title-third mt-2">{$_('index.explanation.7')}</h3>
        <p class="text-sm mb-2">
            {$_('index.explanation.6')}
        </p>
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" onclick="window.location.href='/serversimpact'">{$_('index.button.2')}</button>
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" onclick="window.location.href='/cloudimpact'">{$_('index.button.3')}</button>
        <button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" onclick="window.location.href='/terminalimpact'">{$_('index.button.4')}</button>
        <h3 class="title-third mt-2">{$_('manufdata.title')}</h3>
        <p class="text-sm mb-2">
            {$_('index.explanation.5')}
        </p>
    </div>
</div>
