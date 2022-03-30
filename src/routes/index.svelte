<script lang="ts" xmlns="http://www.w3.org/1999/html">
	import { _ } from 'svelte-i18n';
	import DataExplorer from "$lib/DataExplorer.svelte";
</script>

<div id="navbar">
	<img id="logo" src="./boavizta-logo-4.png" alt="Boavizta">
	<h1 class="title-main">BOAVIZTA</h1>

</div>
<div id="content" class="px-4">
	<h1 class="title-main">{$_('index.title')}</h1>
	
	<div class="">
		<div class="mb-3">
			<p class="mb-2">
				{$_('explanation.1')}
			</p>
			
			<ul class="pl-4">
				<li>{$_('explanation.2')} <a class="link" href="https://github.com/Boavizta/environmental-footprint-data">{$_('explanation.3')}</a></li>
				<li>{$_('explanation.4')}</li>
				<li>{$_('explanation.5')}</li>
			</ul>
		</div>
		
	</div>
	
	<h3 class="title-second">{$_('index.sub-title')}</h3>
    <div class="text-sm my-2">
        {$_('explanation.6')}
    </div>
	<DataExplorer />

	
</div>

