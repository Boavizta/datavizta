export interface ServerImpact {
  verbose: Verbose;
  impacts: Impact;
}

export interface Verbose {
  "ASSEMBLY-1": VerboseImpact;
  "CPU-1": VerboseImpact;
  "RAM-1": VerboseImpact;
  "POWER_SUPPLY-1": VerboseImpact;
  "CASE-1": VerboseImpact;
  "MOTHERBOARD-1": VerboseImpact;
  USAGE: VerboseImpact;
}

export interface VerboseImpact {
  value?: number;
  manufacture?: number;
  use?: number;
  unit: string;
}

export interface Impact {
  adp: VerboseImpact;
  gwp: VerboseImpact;
  pe: VerboseImpact;
}

export interface ImpactManufactureUse {
  manufacture: number;
  unit: string;
  use: number;
}
