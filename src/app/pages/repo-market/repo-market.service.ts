import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepoMarketI } from '../../core/models/repo-market.interface';

@Injectable({
  providedIn: 'root'
})
export class RepoMarketService {

  constructor(private httpService: HttpClient) { }

  getRepoMarketSummary() {
    return this.httpService.get('/table/repo-summary');
  }

  getRepoMarketRecords() {
    return this.httpService.get<RepoMarketI[]>('/table/repo-main-records');
  }
}
