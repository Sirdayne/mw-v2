import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor() { }

  saveFile(filename, blob, format = 'csv', currentDate = null) {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const today = new Date();
    const date = currentDate ? currentDate : today;
    link.download = `${filename}-${date.toLocaleDateString()}.${format}`;
    link.click();
  }
}
