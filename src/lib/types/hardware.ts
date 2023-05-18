import type { List } from "postcss/lib/list";
import { number } from "svelte-i18n";

export interface Server {
  model: ModelServer;
  config: ConfigurationServer;
  usage: UsageRequest;
}
export interface ConfigurationServer {
  cpu: Cpu;
  ram: Array<Ram>;
  disk: Array<Disk>;
  power_supply?: PowerSupply;
}
export interface Cloud {
  provider: string;
  instance_type: string;
  usage: UsageRequest;
}
export interface Terminal {
  category: string;
  archetype: string;
  usage: UsageRequest;
}

export interface UsageRequest {
  hash?: string;
  TYPE?: string;
  years_use_time?: number;
  days_use_time?: number;
  hours_use_time?: number;
  hours_electrical_consumption?: number;
  life_time?: number;
  usage_location?: string;
  time_workload?: List;
}
export interface Usage {
  hash?: string;
  TYPE?: string;
  use_time?: {
    default?: number;
    value?: number;
    life_time_ratio?: number;
    hours_per_day?: number;
  }
  hours_electrical_consumption?: {
    default?: number;
    value?: number;
    min?: number;
    max?: number;
  }
  life_time?: {
    default?: number;
    value?: number;
  }
  usage_location?: string;
  gwp_factor?: number;
  pe_factor?: number;
  adp_factor?: number;
  time_workload?: {
    time_percentage?: Array;
    load_percentage?: Array;
  }
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
