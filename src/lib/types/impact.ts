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
