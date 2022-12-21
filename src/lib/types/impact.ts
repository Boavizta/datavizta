export interface ServerImpact {
  impacts:{
    gwp: {
      manufacture: number;
      use: number;
      unit: string;
    };
    pe: {
      manufacture: number;
      use: number;
      unit: string;
    };
    adp: {
      manufacture: number;
      use: number;
      unit: string;
    };
  }
}

export type GlobalImpact = {
  gwp: Impact,
  pe: Impact,
  adp: Impact
}

export type Impact = {
  assembly: number, unit: number, power_supply: number, ssd: number, use: number, motherboard: number, hdd: number, cpu: number, ram: number}

export type VerboseImpacts = { gwp: { unit: number, power_supply: number, ssd: number, use: number, motherboard: number, hdd: number, cpu: number, ram: number, assembly: number, case: number }, pe: { unit: number, power_supply: number, ssd: number, use: number, motherboard: number, hdd: number, cpu: number, ram: number, assembly: number, case: number }, adp: { unit: number, power_supply: number, ssd: number, use: number, motherboard: number, hdd: number, cpu: number, ram: number, assembly: number, case: number } }


