<script>
        import { _} from "svelte-i18n";
        import DataExplorer from "$lib/DataExplorer.svelte";
</script>
<div id="content" class="px-4">
    <h2 class="title-second mt-2">{$_('manufdata.title')}</h2>
    <div class="text-sm mb-2">
        {$_('manufdata.explanation.6')}
    </div>
    <p class="text-sm mb-2">
        {$_('manufdata.explanation.10')} <a class="link" href={$_('manufdata.explanation.12')} target="_blank">{$_('manufdata.explanation.11')}</a> {$_('manufdata.explanation.13')}
    </p>
    <DataExplorer/>
</div>
