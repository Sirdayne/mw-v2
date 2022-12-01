import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor() { }

  saveFile(filename, blob, format = 'csv') {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const today = new Date();
    link.download = `${filename}-${today.toLocaleDateString()}.${format}`;
    link.click();
  }
}
