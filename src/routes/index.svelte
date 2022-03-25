<script lang="ts">
	import { _ } from 'svelte-i18n';
	import DataExplorer from "../lib/DataExplorer.svelte";
</script>

<div id="navbar">
	<img id="logo" src="./boavizta-logo-4.png" alt="Boavizta">
	<h1 class="title-main">BOAVIZTA</h1>

</div>
<div id="content" class="mx-5">
	<h1 class="title-main">{$_('index.title')}</h1>
	<h3 class="title-second">{$_('index.sub-title')}</h3>
	<h3 class="title-second title-left">{$_('index.search')}</h3>
<DataExplorer />
</div>

