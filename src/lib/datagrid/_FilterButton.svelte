<script lang="ts">
    export let filterText:String;
    export let active:boolean;
    export let onButtonClick;
</script>
<span on:click={onButtonClick} 
    class="px-2 py-1 rounded-full text-gray-800 {active?"button-active":"bg-gray-100"} font-semibold text-sm 
      align-center w-max cursor-pointer active:bg-gray-400 transition duration-300 ease">
    {filterText}
</span>

<style>
 .button-active {
        background-color: #003864;
        color: white;
    }
</style>
