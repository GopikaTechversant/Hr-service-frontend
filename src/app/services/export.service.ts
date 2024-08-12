// src/app/services/export.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  downloadAsExcel(jsonData: any[], fileName: string) {
    if (!jsonData || jsonData.length === 0) {
      return;
    }

    // Convert JSON to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);

    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the workbook to a file
    XLSX.writeFile(wb, fileName);
  }

  downloadBlob(blob: Blob, fileName: string) {
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
  }

  downloadAsJson(jsonResponse: any) {
    if (!jsonResponse || jsonResponse.length === 0) {
      return;
    }
  
    // Assuming jsonResponse is an array of objects
    const csvRows = [];
  
    // Extract headers from the first object in the array
    const headers = Object.keys(jsonResponse[0]);
    csvRows.push(headers.join(',')); // Join with comma
  
    // Loop over the rows
    for (const row of jsonResponse) {
      const values = headers.map(header => {
        const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
        const escaped = ('' + value).replace(/"/g, '\\"'); // Escape double quotes
        return `"${escaped}"`; // Wrap in quotes
      });
      csvRows.push(values.join(','));
    }
  
    // Create Blob and download as CSV
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, 'exported_data.csv');
  }
}
