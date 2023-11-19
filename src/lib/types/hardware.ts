export interface Server {
  model: ModelServer
  config: ConfigurationServer
  usage: UsageRequest
}
export interface ConfigurationServer {
  cpu: Cpu
  ram: Array<Ram>
  disk: Array<Disk>
  power_supply?: PowerSupply
}
export interface Cloud {
  provider: string
  instance_type: string
  usage: UsageRequest
}
export interface UserDevice {
  category: string
  subcategory: string
  archetype: string
  usage: UsageRequest
}
export interface IoT {
  archetype: string
  functional_blocks: Array<Archetype>
  usage: UsageRequest
}

export interface UsageRequest {
  hash?: string
  TYPE?: string
  use_time?: number
  avg_power?: number
  hours_life_time?: number
  use_time_ratio?: number
  usage_location?: string
  gwp_factor?: number
  pe_factor?: number
  adp_factor?: number
  time_workload?: Array<TimeWorkload>
}
export interface Usage {
  hash?: string
  TYPE?: string
  use_time?: {
    default?: number
    value?: number
  }
  years_life_time?: {
    default?: number
    value?: number
  }
  use_time_ratio?: {
    value: number
    status?: string
    unit?: string
    min?: number
    max?: number
    hours_per_day?: number
  }
  avg_power?: {
    default?: number
    value?: number
    min?: number
    max?: number
  }
  extendLifetime?: {
    value: number
  }
  usage_location?: {
    value: string
    label: string
  }
  gwp_factor?: number
  pe_factor?: number
  adp_factor?: number
  time_workload?: Array<TimeWorkload>
}

export interface TimeWorkload {
  time_percentage?: number
  load_percentage?: number
}

export interface Case {
  units?: number
  case_type?: string
}

export interface Cpu {
  units: number
  core_units: number
  die_size?: number
  die_size_per_core?: number
  tdp: number
  process?: number
  manufacturer?: string
  manufacture_date?: string
  model?: string
  family: string
}

export interface Disk {
  units: number
  type: string
  capacity: number
  density?: number
  manufacturer?: string
  manufacture_date?: string
  model?: string
}

export interface ModelServer {
  manufacturer?: string
  name?: string
  type?: string
  year?: string
  archetype?: string
}

export interface MotherBoard {
  units?: number
}

export interface PowerSupply {
  units?: number
  unit_weight?: number
}

export interface Ram {
  units: number
  capacity: number
  density?: number
  process?: number
  manufacturer?: string
  manufacture_date?: string
  model?: string
  integrator?: string
}

export interface Archetype {
  type: string
  hsl_level: string
}
