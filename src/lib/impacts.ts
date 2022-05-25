export type ScopeResult = {
    result: number,
    lines: number,
    median: number
}

export function calculateImpacts(selectedRows, yearly, lifetime, regionValue) {
    const scope2 = impactScope2(selectedRows, yearly, lifetime, regionValue);
    const scope3 = impactScope3(selectedRows, yearly, lifetime);
    const total = scope2.median + scope3.median;
    //console.log("lifetime:", lifetime, " selectedRowsNumber:", selectedRows.length," total:", total,"scope2:", scope2,"scope3:", scope3)
    return {scope2: scope2, scope3: scope3, total: total}
    
}

/* calculate scope 3 impacts */
export function impactScope3(rows_selection, yearly, lifetime): ScopeResult {
    let scope3 = 0;
    let processedLines = 0;
    rows_selection.forEach(row => {
        //gérer le fait que le lifetime doit etre récupéré depuis le tableau (comme sur scope 2)
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

export function impactScope3byRow(row) {
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
export function impactScope2(rows_selection, yearly, lifetime, electricalImpactFactor): ScopeResult {
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
                    scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / lifetime)
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
export function impactScope2ByRow(row, lifetime, electricalImpactFactor) {
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