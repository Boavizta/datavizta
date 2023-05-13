<script lang="ts">
    import type { Impact } from "$lib/customType";
    import { _ } from "svelte-i18n";

    export let result:Impact ={
            "manufacture":13000.0,
            "use":39700.0,
            "unit":"MJ"
        }
        export let title;
        export let description;
</script>

<div >


    <span >{title}</span>
    <br/>
    <span class="font-light text-xs italic">{description}</span>

    <table class="table-fixed">
        <tbody>
          <tr>
            <td>{$_('server-impact.Manufacture')}</td>
            <td class="pl-4 text-right" width="100px"><span class="font-semibold">
                {result.manufacture} </span></td>
            <td class="pl-1"><span>{result.unit}</span></td>
          </tr>
          <tr>
              <td>{$_('server-impact.Usage')}</td>
              <td class="pl-4 text-right"><span class="font-semibold">{result.use} </span></td>
              <td class="pl-1"><span>{result.unit}</span></td>
          </tr>
        </tbody>
      </table>
    <div >
    
</div>
<div >
     
    
</div>
</div>