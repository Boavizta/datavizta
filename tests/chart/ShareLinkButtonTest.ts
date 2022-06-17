//la flemme d'installer jest dans svelte


import * as paramParser from "../../src/lib/paramParser";



const lifetime=0;
const selectedRegion=0;
const isYearly = true;
const filterModels = {
    manufacturer: {
      filterType: "text",
      operator: "OR",
      condition1: {
        filterType: "text",
        type: "contains",
        filter: "Lenovo",
      },
      condition2: {
        filterType: "text",
        type: "contains",
        filter: "Seagate",
      },
    },
    category: {
      filterType: "text",
      type: "contains",
      filter: "Datacenter",
    },
  }
const param = paramParser.buildLink(lifetime, selectedRegion, isYearly, filterModels)
console.log(param);