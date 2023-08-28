import fetch from 'node-fetch';
import countries from './countryArray.js';
import fs from 'fs';

const fetchGridIntensity = async () => {
    const response = await fetch('https://raw.githubusercontent.com/thegreenwebfoundation/co2.js/main/data/output/average-intensities.json');
    const data = await response.json();

    // Loop through the countries array and find the corresponding object from the data object.
    // Add the intensity value and the year to the object.
    let countriesWithIntensity = [];
    for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        let countryCode;
        if (country.code === 'EU-27') {
            countryCode = 'EU';
        } else if (country.code === 'EU27+1') {
            countryCode = 'Europe';
        } else if (country.code === 'CN') {
            countryCode = 'CHN';
        } else {
            countryCode = country.code;
        }

        const intensity = data[countryCode].emissions_intensity_gco2_per_kwh
        // Convert intensity from gCO2/kWh to kgCO2/kWh
        const intensityKgs = (intensity / 1000).toFixed(3)
        const year = data[countryCode].year
        const countryName = country.name
        const countryObject = { code: country.code, name: countryName, gwp_emission_factor: intensityKgs, year: year }

        countriesWithIntensity.push(countryObject);
    }

    // Create the CSV file which is used in the frontend.
      const csvHeader = 'country,code,year,gwp_emission_factor,pe_emission_factor,adp_emission_factor,source';
      const csvRows = countriesWithIntensity.map(country => `\n${country.name},${country.code},${country.year},${country.gwp_emission_factor},0,0,'Ember Climate, CO2.js'`);
      const csvData = csvHeader + csvRows.join('');
      
    fs.writeFile('./static/electrical_foot_print.csv', csvData, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File created successfully!');
    });
    }

export default fetchGridIntensity();
