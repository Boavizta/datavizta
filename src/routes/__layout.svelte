<script>
	import '$/global.css';
	import '$/i18n';
	import { isLoading } from 'svelte-i18n';
	import "../app.css";
</script>

{#if !$isLoading}
	<slot />
{/if}
