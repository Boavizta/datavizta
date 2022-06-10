/*define custom types*/

export type RegionPickerItem = {
    label: string, //label to show on the region picker 
    value: number, //value of the elect impact of the region
    id: number //id of the region
}

export type ScopeResult = {
    result: number, //sum of all scope
    lines: number, //number of lines in the scope result
    median: number // pre-calculated mean of scope per line
}

export type ChartResult = {
    scope2: ScopeResult,
    scope3: ScopeResult,
    total:number
}

export type Row = {
    manufacturer,
    name,
    category,
    subcategory,
    report_date,
    gwp_total,
    gwp_use_ratio,
    gwp_manufacturing_ratio,
    yearly_tec,
    use_location,
    lifetime,
    added_date,
    sources,
    gwp_error_ratio,
    weight,
    assembly_location,
    screen_size,
    server_type,
    hard_drive,
    memory,
    number_cpu,
    gwp_eol_ratio
}

export type CalculatedScope = {
    scope3?: string;
    scope2?: string;
    lifetimeoverride?: string;
    regionlabel? : string;
    electricalImpactFactor?:string;
}

export type RowWithScope = Row & CalculatedScope;

