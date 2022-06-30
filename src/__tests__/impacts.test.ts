import  * as Impacts from "../lib/impacts"
import type { Row, ScopeResult, ChartResult } from '../lib/customType';

const row:Row = {
  "manufacturer": "Apple",
  "name": "13-inch MacBook Pro (Four Thunderbolt 3 ports) 1TB - 2020",
  "category": "Workplace",
  "subcategory": "Laptop",
  "gwp_total": 298,
  "gwp_use_ratio": 0.19,
  "yearly_tec": null,
  "lifetime": 3,
  "use_location": "WW",
  "report_date": "November 2020",
  "sources": "https://www.apple.com/environment/pdf/products/notebooks/13-inch_MacBookPro_PER_Nov2020.pdf",
  "gwp_error_ratio": 0,
  "gwp_manufacturing_ratio": 0.73,
  "weight": null,
  "assembly_location": null,
  "screen_size": 13,
  "server_type": null,
  "hard_drive": "SSD 1024GB",
  "memory": null,
  "number_cpu": null,
  "height": null,
  "added_date": "01-11-2020",
  "add_method": "Initial Parsing",
  "gwp_transport_ratio": 0.07,
  "gwp_eol_ratio": null
};

 describe("Impacts calculation", () => {
    test("calculate scope3", () => {
      expect(Impacts.impactScope3byRow(row)).toEqual({"scope3":241.38000000000002, "inc":1});
    });

    test("calculate scope2 without custom value", () => {
      expect(Impacts.impactScope2byRow(row, undefined, -1)).toEqual(56.62);
    });
  });