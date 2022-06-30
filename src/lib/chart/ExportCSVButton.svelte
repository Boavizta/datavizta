<script lang="ts">
    import {_} from 'svelte-i18n';
    import * as Utils from "../utils";
    import * as Scope from "../impacts"

    export let selectedRows;
    export let lifetime;
    export let hascustomlifetime;
    export let selectedRegion;

    function exportCurrentView() {
        const csvContent:String =  Scope.buildCsvFromFilterRows(selectedRows, lifetime, hascustomlifetime, selectedRegion);
        Utils.exportCSVToDownload(csvContent,"boavizta_exported_view_"+(new Date()).toLocaleString().replaceAll(', ','T').replaceAll('/','-').replaceAll(':','')+".csv")
    }

</script>


<button class="my-2 inline-block blue-button hover:bg-teal-800 disabled:opacity-20 text-white font-bold py-2 px-4 border rounded" on:click={exportCurrentView}>{$_('datagrid.export_filtered')}</button>