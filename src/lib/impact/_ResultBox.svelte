<script lang="ts">
    import type { Impact } from "$lib/customType";

    export let result:Impact ={
            "manufacture":13000.0,
            "use":39700.0,
            "unit":"MJ"
        }
        export let title;
        export let description;
</script>

<div >


    <h2 class="text-lg">{title}</h2>
    <span class="font-light text-xs">{description}</span>

    <table class="table-fixed">
        <tbody>
          <tr>
            <td>Manufacture</td>
            <td class="pl-2"><span class="font-semibold">
                {result.use} </span><span>{result.unit}</span></td>
          </tr>
          <tr>
              <td>Usage</td>
              <td class="pl-2"><span class="font-semibold">{result.manufacture} </span><span>{result.unit}</span></td>
          </tr>
        </tbody>
      </table>
    <div >
    
</div>
<div >
     
    
</div>
</div>