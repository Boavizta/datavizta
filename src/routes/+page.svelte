<script>
        import { _} from "svelte-i18n";
        import DataExplorer from "$lib/DataExplorer.svelte";
</script>
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
