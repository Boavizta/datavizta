export interface Server {
  config: ConfigurationServer;
  usage: UsageServer;
}
export interface ConfigurationServer {
  cpu: Cpu;
  ram: Array<Ram>;
  disk: Array<Disk>;
  power_supply?: PowerSupply;
}

export interface UsageServer {
  hash?: string;
  TYPE?: string;
  years_use_time?: number;
  days_use_time?: number;
  hours_use_time?: number;
  hours_electrical_consumption?: number;
  usage_location?: string;
  gwp_factor?: number;
  pe_factor?: number;
  adp_factor?: number;
  time_workload?: number;
}

export interface Case {
  units?: number;
  case_type?: string;
}

export interface Cpu {
  units: number;
  core_units: number;
  die_size?: number;
  die_size_per_core?: number;
  tdp: number;
  process?: number;
  manufacturer?: string;
  manufacture_date?: string;
  model?: string;
  family: string;
}

export interface Disk {
  units: number;
  type: string;
  capacity: number;
  density?: number;
  manufacturer?: string;
  manufacture_date?: string;
  model?: string;
}

export interface ModelServer {
  manufacturer?: string;
  name?: string;
  type?: string;
  year?: string;
  archetype?: string;
}

export interface MotherBoard {
  units?: number;
}

export interface PowerSupply {
  units?: number;
  unit_weight?: number;
}

export interface Ram {
  units: number;
  capacity: number;
  density?: number;
  process?: number;
  manufacturer?: string;
  manufacture_date?: string;
  model?: string;
  integrator?: string;
}
