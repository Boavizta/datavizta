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

export function toggleElement(element) {
    var menu = document.getElementById(element);
    if (!(menu.style.display === "block")) {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}
