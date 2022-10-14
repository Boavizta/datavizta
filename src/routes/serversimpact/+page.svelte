<script>
    import { _} from "svelte-i18n";
</script>
<div>
    <h2>{$_('server-impact.title')}</h2>
</div>


<div class="grid space-x-10 evenly-spaced grid-cols-3">
    <div class="min-h-[200px] shadow-md p-4 m-5">
        <h2 class="text-3xl font-bold dark:text-white">Formulaire serveur</h2>
    </div>

    <div class="min-h-[200px] shadow-md p-4 m-5">
        <h2 class="text-3xl font-bold dark:text-white">Utilisation</h2>
    </div>
    <div class="min-h-[200px] shadow-md p-4 m-5">
        <h2 class="text-3xl font-bold dark:text-white">Résultat</h2>
    </div>
</div>
