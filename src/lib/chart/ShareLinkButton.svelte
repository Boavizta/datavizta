<script lang="ts">

    export let lifetime;
    export let selectedSubCategories;
    export let selectedCategories;
    export let selectedManufacturers;
    export let selectedRegion;

    let shareLink;

    

    function buildLink(){
        let link = window.location.origin;
        let query = ""
        if(lifetime){
            query += "lifetime=" + lifetime + "&"
        }
        if(selectedSubCategories.size>0){
            query += "subcategory=" + selectedSubCategories.values().next().value + "&"
        }
        if(selectedCategories.size>0){
            query += "category=" + selectedCategories.values().next().value + "&"
        }
        if(selectedManufacturers.size>0){
            query += "manufacturer=" + selectedManufacturers.values().next().value + "&"
        }
        if(selectedRegion && selectedRegion.value != -1){
            query += "region=" + selectedRegion.id + "&"
        }
        query = query.slice(0, -1)
        shareLink = link + "?" + query;
    }

    function selectShareLinkInput(){
        //does not work
        let input = document.getElementById('shareLinkInput');
        input.focus();
        input.select();
    }

</script>