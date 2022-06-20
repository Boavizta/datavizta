import type { RegionPickerItem } from "./customType"


export const PARAM_LIFETIME = "lifetime";
export const PARAM_REGION_ID = "region";
export const PARAM_YEARLY = "yearly";
const separator = ","

export function buildLink(lifetime, selectedRegion:RegionPickerItem, isYearly:boolean, filterModels){
    let query = ""
    if(lifetime){
        query += PARAM_LIFETIME + "=" + lifetime + "&"
    }
    if(selectedRegion && selectedRegion.value != -1){
        query += PARAM_REGION_ID + "=" + selectedRegion.id + "&"
    }
    if(isYearly){
        query += PARAM_YEARLY+ "=" + isYearly + "&"
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
                    
                }else{
                    //if only 1 condition
                    query += filterKey + "=" + filterModel['condition1']['filter'] + "&";
                }
            }

        }
    }

    query = query.slice(0, -1)
    //return link + "?" + query;
    return query;
}

export function parseLifetime(params:URLSearchParams):number{
    return params.get(PARAM_LIFETIME)? Number(params.get(PARAM_LIFETIME)):undefined;
}

export function parseYearly(params:URLSearchParams):boolean{
    return Boolean(params.get(PARAM_YEARLY)) || undefined;
}

export function parseRegion(params:URLSearchParams, regions:RegionPickerItem[]):RegionPickerItem{
    const regionId = params.get(PARAM_REGION_ID);
    return regions && regions.find(o => o.id === regionId) || undefined;
}

export function parseFilter(params:URLSearchParams):any{
    const output = {}
    params.forEach((value, key)=>{
        if(![PARAM_LIFETIME, PARAM_REGION_ID, PARAM_YEARLY].includes(key)){
            if(value.includes(separator)){
                //multi value
                const values:string[] = value.split(separator);
                output[key]= {
                    filterType: "text",
                    operator: "OR",
                    condition1: {
                      filterType: "text",
                      type: "contains",
                      filter: values[0],
                    },
                    condition2: {
                      filterType: "text",
                      type: "contains",
                      filter: values[1],
                    },
                  }
            }else{
                //mono value
                output[key]= {
                    filterType: "text",
                    type: "contains",
                    filter: value,
                }
            }
            
        }
    })
    
    return output;
}
