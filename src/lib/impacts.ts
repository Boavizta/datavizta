import type { RegionPickerItem, ScopeResult, Row,RowWithScope } from "./customType";
import * as Utils from "./utils";

export function calculateImpacts(selectedRows:Row[], yearly:boolean, lifetime:number, electricalImpactFactor:number) {
    console.log("calculateImpacts", selectedRows.length, yearly, lifetime, electricalImpactFactor)
    const scope2 = impactScope2(selectedRows, yearly, lifetime, electricalImpactFactor);
    const scope3 = impactScope3(selectedRows, yearly, lifetime);
    const total = scope2.median + scope3.median;
    return {scope2: scope2, scope3: scope3, total: total} 
}

/* calculate total */
export function impactTotal(rows_selection:Row[]) {
    let total = 0;
    rows_selection.forEach(row => {
        if (row["gwp_total"] != undefined) {
                total += row["gwp_total"];
        }
    });
    return total
}

/* calculate median lifetime */
export function medianlifetime(rows_selection:Row[]) {
    let manuflifetime = 0;
    let lineswithlifetime = 0;
    rows_selection.forEach(row => {
        if (row["lifetime"] != undefined) {
                manuflifetime += row["lifetime"];
                lineswithlifetime += 1;
        }
    });
    const medianlife = Math.round(manuflifetime * 100 / lineswithlifetime) / 100;
    return medianlife
}

/* calculate scope 3 impacts */
export function impactScope3(rows_selection:Row[], yearly:boolean, lifetime:number): ScopeResult {
    let scope3 = 0;
    let processedLines = 0;
    rows_selection.forEach(row => {
        let result = impactScope3byRow(row);
        if (yearly == true) {
            if (lifetime != undefined){
                scope3 += result.scope3 / lifetime;
                processedLines +=result.inc;
            } else if (row["lifetime"] != undefined) {
                scope3 += result.scope3 / row["lifetime"];
                processedLines +=result.inc;
            }
        } else {
            scope3 += result.scope3;
            processedLines +=result.inc;
        }
    });
    const median = Math.round(scope3 / processedLines);
    return {result: scope3, lines: processedLines, median: median}
}

export function impactScope3byRow(row:Row) {
    let inc= 0;
    let scope3= 0;
    if (row["gwp_total"] != undefined) {
        if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
            scope3 = row["gwp_total"] * (1 - row["gwp_use_ratio"]);
            inc = 1;
        }
    }
    return {
        "scope3":scope3,
        "inc": inc
    }
}

/* calculate scope 2 impacts */
export function impactScope2(rows_selection:Row[], yearly:boolean, lifetime:number, electricalImpactFactor:number): ScopeResult {
    let scope2 = 0;
    let processedLines = 0
    lifetime = lifetime > 0 ? lifetime : undefined
    rows_selection.forEach(row => {
        let rowlifetime = row["lifetime"] > 0 ? row["lifetime"] : undefined
        if (yearly == true ) {
            if (lifetime == undefined && electricalImpactFactor == -1 && rowlifetime != undefined) {
                if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                    scope2 += row["gwp_total"] * row["gwp_use_ratio"] / rowlifetime;
                    processedLines++;
                }
            } else if (lifetime != undefined  && electricalImpactFactor == -1) {
                if (row["gwp_total"] != undefined
                    && row["gwp_use_ratio"] != undefined
                    && rowlifetime != undefined ) {
                    scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / rowlifetime)
                    processedLines++;
                }
            } else if (electricalImpactFactor !== -1) {
                if (row["yearly_tec"] != undefined) {
                    scope2 += row["yearly_tec"] * electricalImpactFactor
                    processedLines++;
                }
            }
        } else {
            if (lifetime == undefined && electricalImpactFactor == -1) {
                    if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                        scope2 += row["gwp_total"] * row["gwp_use_ratio"];
                        processedLines++;
                    }
            } else if (lifetime != undefined  && electricalImpactFactor == -1) {
                    if (row["gwp_total"] != undefined
                        && row["gwp_use_ratio"] != undefined
                        && row["lifetime"] != undefined
                        && row["lifetime"] != 0) {
                        scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / rowlifetime) * lifetime
                        processedLines++;
                    }
            } else if (lifetime == undefined  && electricalImpactFactor !== -1) {
                    if (row["yearly_tec"] != undefined) {
                        scope2 += row["yearly_tec"] * row["lifetime"] * electricalImpactFactor
                        processedLines++;
                    }
            } else if (lifetime != undefined  && electricalImpactFactor !== -1) {
                    if (row["yearly_tec"] != undefined) {
                        scope2 += row["yearly_tec"] * lifetime * electricalImpactFactor;
                        processedLines++;
                    }
            }
        }
    });
    const median = Math.round(scope2 / processedLines);
    return {result: scope2, lines: processedLines, median: median}
}


/* calculate scope 2 impacts */
export function impactScope2byRow(row:Row, lifetime:number, electricalImpactFactor:number) {
    let scope2 = 0;
    lifetime = lifetime > 0 ? lifetime : undefined

    if (lifetime == undefined && electricalImpactFactor == -1) {
            if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                scope2 += row["gwp_total"] * row["gwp_use_ratio"];
            }
    } else if (lifetime != undefined  && electricalImpactFactor == -1) {
            if (row["gwp_total"] != undefined
                && row["gwp_use_ratio"] != undefined
                && row["lifetime"] != undefined
                && row["lifetime"] != 0) {
                scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / row["lifetime"]) * lifetime
            }
    } else if (lifetime == undefined  && electricalImpactFactor !== -1) {
            if (row["yearly_tec"] != undefined) {
                scope2 += row["yearly_tec"] * row["lifetime"] * electricalImpactFactor
            }
    } else if (lifetime != undefined  && electricalImpactFactor !== -1) {
            if (row["yearly_tec"] != undefined) {
                scope2 += row["yearly_tec"] * lifetime * electricalImpactFactor;
            }
    }
   
    return scope2;
}

export function lifetimebyRow(row:Row) {
    if (row["lifetime"] != undefined) {
        return row["lifetime"];
    } else {
        return '';
    }
}
/*build csv content from rows and custom values*/
export function buildCsvFromFilterRows(filteredRows:Row[], lifetime:number, hascustomlifetime:boolean, selectedRegion:RegionPickerItem):String {
    let csvContent = "data:text/csv;charset=utf-8,";
    let rowsWithScope:RowWithScope[]=new Array();
    filteredRows.forEach(row => {
        const rowWithScope:RowWithScope = row;
        let totalscope3 = impactScope3byRow(row).scope3;
        let totalscope2=impactScope2byRow(row,lifetime,selectedRegion.value);
        if ( hascustomlifetime == false ) {
            lifetime=lifetimebyRow(row)
        }
        rowWithScope.lifetimeoverride=lifetime.toString()
        if (totalscope2 != 0) {
            rowWithScope.total_scope2=totalscope2.toString();
            rowWithScope.yearly_scope2=(totalscope2 / lifetime).toString()
        } else {
            rowWithScope.total_scope2='';
            rowWithScope.yearly_scope2='';
        }
        if (totalscope3 != 0) {
            rowWithScope.total_scope3=totalscope3.toString();
            rowWithScope.yearly_scope3=(totalscope3 / lifetime).toString()
        } else {
            rowWithScope.total_scope3='';
            rowWithScope.yearly_scope3='';
        }
        
        if (selectedRegion.value !== -1) {
            rowWithScope.regionlabel=selectedRegion.label;
            rowWithScope.electricalImpactFactor=selectedRegion.value.toString();
        } else {
            rowWithScope.regionlabel='';
            rowWithScope.electricalImpactFactor='';
        }
        rowsWithScope.push(rowWithScope)
    });

    const headers = Object.keys(rowsWithScope[0]);
    csvContent += headers.join(',')+"\r\n";
    csvContent += Utils.convertToCSV(rowsWithScope);
    return csvContent;
}