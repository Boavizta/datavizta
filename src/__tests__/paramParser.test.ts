/**
 * @jest-environment jsdom
 */

 import "@testing-library/jest-dom";
 import  * as ParamParser from "../lib/paramParser"
 import type {RegionPickerItem } from '../lib/customType';


const regionItem:RegionPickerItem = {
    label:"regionLabel",
    value:1,
    id:"regionId"
} 

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


 describe("Parse parameters", () => {

    test("should parse lifetime", () => {
      expect(ParamParser.parseLifetime(new URLSearchParams("lifetime=1"))).toEqual(1);
    });

    test("should parse undefined lifetime", () => {
      expect(ParamParser.parseLifetime(new URLSearchParams(""))).toEqual(undefined);
    });

    test("should parse yearly", () => {
      expect(ParamParser.parseYearly(new URLSearchParams("yearly=true"))).toEqual(true);
    });

    test("should parse undefined yearly", () => {
      expect(ParamParser.parseYearly(new URLSearchParams(""))).toEqual(undefined);
    });

    test("should parse undefined region", () => {
      expect(ParamParser.parseRegion(new URLSearchParams(""),[])).toEqual(undefined);
    });

    test("should parse region", () => {
      expect(ParamParser.parseRegion(new URLSearchParams("region=regionId"),[regionItem])).toEqual(regionItem);
    });

    test("should parse unknown region", () => {
      expect(ParamParser.parseRegion(new URLSearchParams("region=wrongRegion"),[regionItem])).toEqual(undefined);
    });

    test("should parse mono filter", () => {
      expect(ParamParser.parseFilter(new URLSearchParams("category=Datacenter"))).toEqual({
        category: {
          filterType: "text",
          type: "contains",
          filter: "Datacenter",
      },
      });
    });
    test("should parse multi filter", () => {
      expect(ParamParser.parseFilter(new URLSearchParams("manufacturer=Lenovo,Seagate"))).toEqual(
        {
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
          }
        }
      });
    });

    test("should parse multi filters", () => {
      expect(ParamParser.parseFilter(new URLSearchParams("category=Datacenter&manufacturer=Lenovo,Seagate"))).toEqual(
        {
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
        });
    });




    test("should build url with two filters", () => {
        expect(ParamParser.buildLink(undefined, undefined, undefined, filterModels)).toEqual(
            "manufacturer=Lenovo,Seagate&category=Datacenter"
        );
    })

    test("should build url with region", () => {
        expect(ParamParser.buildLink(undefined, regionItem, undefined, null)).toEqual(
            "region=regionId"
        );
    })

    test("should build url with lifetime", () => {
        expect(ParamParser.buildLink(1, undefined, undefined, null)).toEqual(
            "lifetime=1"
        );
    })

    test("should build url with yearly", () => {
        expect(ParamParser.buildLink(undefined, undefined, true, null)).toEqual(
            "yearly=true"
        );
    })

    test("should build url with no parameter", () => {
        expect(ParamParser.buildLink(undefined, undefined, undefined, undefined)).toEqual(
            ""
        );
    })
  });