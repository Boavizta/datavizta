import type { RegionPickerItem } from "./customType"

export function buildLink(lifetime, selectedRegion:RegionPickerItem, isYearly:boolean, filterModels){
    let query = ""
    const separator = ","
    if(lifetime){
        query += "lifetime=" + lifetime + "&"
    }
    if(selectedRegion && selectedRegion.value != -1){
        query += "region=" + selectedRegion.id + "&"
    }
    if(isYearly){
        query += "isYearly=" + isYearly + "&"
    }

    if(filterModels){
        for(const filterKey in filterModels){
            const filterModel = filterModels[filterKey];
            if(filterModel.hasOwnProperty('filter')){
                query += filterKey + "=" + filterModel['filter'] + "&";
            }

            if(filterModel.hasOwnProperty('condition1')){
                if(filterModel.hasOwnProperty('condition2')){
                    //if 2 conditions
                    query += filterKey + "=" + filterModel['condition1']['filter']+ separator + filterModel['condition2']['filter'] + "&";
                }
                //if only 1 condition
                query += filterKey + "=" + filterModel['condition1']['filter'] + "&";
            }

        }
    }


    query = query.slice(0, -1)
    //return link + "?" + query;
    return query;
}


export function parseParam(params:string){
    const output = {
        lifetime:null,
        selectedRegion:null,
        isYearly:null,
        filterModels:null
    }

    return output;
}
