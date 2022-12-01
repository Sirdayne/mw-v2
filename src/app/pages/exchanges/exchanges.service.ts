import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RepoMarketI } from '../../core/models/repo-market.interface';

@Injectable({
  providedIn: 'root'
})
export class ExchangesService {

  constructor(private httpService: HttpClient) { }

  getExchanges() {
    return this.httpService.get('/currency/permitted-rates-today');
  }
}
