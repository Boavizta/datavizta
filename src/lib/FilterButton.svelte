<script lang="ts">
    export let filterText:String;
    export let active:boolean;
    export let onButtonClick;
</script>
<span on:click={onButtonClick} 
    class="px-4 py-2 rounded-full text-gray-500 {active?"button-active":"bg-gray-100"} font-semibold text-sm 
  
    align-center w-max cursor-pointer active:bg-gray-400 transition duration-300 ease">
    {filterText}
</span>
<style>
 .button-active {
		background-color: #008a8c;
		color: white;
	}
</style>