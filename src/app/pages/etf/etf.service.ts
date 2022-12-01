import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtfInterface } from '../../core/models/etf.interface';

@Injectable({
  providedIn: 'root'
})
export class EtfService {

  constructor(private httpService: HttpClient) { }

  getEtfSummary() {
    return this.httpService.get('/table/etf-summary');
  }

  getEtfRecords() {
    return this.httpService.get<EtfInterface[]>('/table/etf-main-records');
  }

  downloadNavDetails(fileId) {
    const params = { fileId };
    return this.httpService.get('/files/etf-download-file', { params, responseType: 'blob' });
  }
}
