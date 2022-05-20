<script>
    import "$/global.css";
    import "$/i18n";
    import { isLoading } from "svelte-i18n";
    import "../app.css";
    import "../ext/github-ribbon.css";
</script>

{#if !$isLoading}
    <slot />
{/if}
