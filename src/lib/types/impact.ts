

export type Impacts = {
  impacts:{
    gwp: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    pe: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    adp: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    adpe: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    ir: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    odp: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    ap: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
    ept: {
      description: string;
      embedded: ImpactValue;
      use: ImpactValue;
      unit: string;
    };
  }
}
type ImpactValue = {
  value: number,
  significant_figures: number,
  min: number,
  max: number,
  warnings: [],
}

export type VerboseServerImpact = {
  assembly: number, power_supply: number, ssd: number, total: number, motherboard: number, hdd: number, cpu: number, ram: number, case: number}

export type CriteriaServerImpact = {
  description: string;
  embedded : VerboseServerImpact,
  use: VerboseServerImpact,
  unit: string
};

export type CriteriaTerminalImpact = {
  description: string;
  embedded : ImpactValue,
  use: ImpactValue,
  unit: string
};

export type VerboseServerImpacts = { 
  gwp: CriteriaServerImpact,
  pe: CriteriaServerImpact,
  adpe: CriteriaServerImpact
}
