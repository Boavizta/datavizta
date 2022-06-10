import Papa from "papaparse";

export const loadDataGridAsync = async () => {
    try {
        const res = await fetch("/boavizta-data-us.csv");
        const text = await res.text();
        const csvParsed = Papa.parse(text, {
            header: true,
            dynamicTyping: true,
        });
        const rowData = csvParsed.data;
        rowData.shift();
        //filteredRows=rowData;
        return rowData;
    } catch (error) {
        console.error(error);
        return [];
    }
};
 
//Source https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
export  function convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

//Source https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
export  function exportCSVToDownload(csvContent,name) {       
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name);
    document.body.appendChild(link); // Required for FF

    link.click(); 
}