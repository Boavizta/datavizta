<script lang="ts">
    export let filterText:String;
    export let active:boolean;
    export let onButtonClick;
</script>
<button on:click={onButtonClick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-xs {active? 'selected' : ''}">
    <span>{filterText}</span>
</button>
<style>
.selected {
		background-color: #ff3e00;
		color: white;
	}
</style>