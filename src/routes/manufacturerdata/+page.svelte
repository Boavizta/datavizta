<script>
        import { _} from "svelte-i18n";
        import DataExplorer from "$lib/DataExplorer.svelte";
</script>
<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_('manufdata.title')}</h2>

    <div class="">
        <div class="mb-3">
            <p class="text-sm mb-2">
                {$_('manufdata.explanation.1')}
            </p>

            <ul class="text-sm pl-4">
                <li>{$_('manufdata.explanation.2')} <a class="link" href="https://github.com/Boavizta/environmental-footprint-data" target="_blank">{$_('manufdata.explanation.3')}</a></li>
                <li>{$_('manufdata.explanation.4')}</li>
                <li>{$_('manufdata.explanation.5')}</li>
            </ul>
        </div>
    </div>
    <h2 class="title-second mt-2">{$_('manufdata.subtitle')}</h2>
    <div class="text-sm mb-2">
        {$_('manufdata.explanation.6')}
    </div>
    <p class="text-sm mb-2">
        {$_('manufdata.explanation.10')} <a class="link" href={$_('manufdata.explanation.12')} target="_blank">{$_('manufdata.explanation.11')}</a> {$_('manufdata.explanation.13')}
    </p>
    <DataExplorer/>
</div>
