export type ScopeResult = {
    result: number,
    lines: number,
    median: number
}

export function calculateImpacts(selectedRows, lifetime, regionValue) {
    const scope2 = impactScope2(selectedRows, lifetime, regionValue);
    const scope3 = impactScope3(selectedRows);
    const total = scope2.median + scope3.median;
    //console.log("lifetime:", lifetime, " selectedRowsNumber:", selectedRows.length," total:", total,"scope2:", scope2,"scope3:", scope3)
    return {scope2: scope2, scope3: scope3, total: total}
    
}

/* calculate scope 3 impacts */
export function impactScope3(rows_selection): ScopeResult {
    let scope3 = 0;
    let processedLines = 0;
    rows_selection.forEach(row => {
        if (row["gwp_total"] != undefined) {
            if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                scope3 += row["gwp_total"] * (1 - row["gwp_use_ratio"]);
                processedLines++
            }
        }
    });
    const median = Math.round(scope3 / processedLines);
    return {result: scope3, lines: processedLines, median: median}
}

/* calculate scope 2 impacts */
export function impactScope2(rows_selection, lifetime, electricalImpactFactor): ScopeResult {
    let scope2 = 0;
    let processedLines = 0
    lifetime = lifetime > 0 ? lifetime : undefined

    if (lifetime == undefined && electricalImpactFactor == -1) {
        rows_selection.forEach(row => {
            if (row["gwp_total"] != undefined && row["gwp_use_ratio"] != undefined) {
                scope2 += row["gwp_total"] * row["gwp_use_ratio"];
                processedLines++;
            }
        })
    } else if (lifetime != undefined  && electricalImpactFactor == -1) {
        rows_selection.forEach(row => {
            if (row["gwp_total"] != undefined
                && row["gwp_use_ratio"] != undefined
                && row["lifetime"] != undefined
                && row["lifetime"] != 0) {
                scope2 += ((row["gwp_total"] * row["gwp_use_ratio"]) / row["lifetime"]) * lifetime
                processedLines++;
            }
        });
    } else if (lifetime == undefined  && electricalImpactFactor !== -1) {
        rows_selection.forEach(row => {
            if (row["yearly_tec"] != undefined) {
                scope2 += row["yearly_tec"] * row["lifetime"] * electricalImpactFactor
                processedLines++;
            }
        });
    } else if (lifetime != undefined  && electricalImpactFactor !== -1) {
        rows_selection.forEach(row => {
            if (row["yearly_tec"] != undefined) {
                scope2 += row["yearly_tec"] * lifetime * electricalImpactFactor;
                processedLines++;
            }
        })
    }
    const median = Math.round(scope2 / processedLines);
    return {result: scope2, lines: processedLines, median: median}
}