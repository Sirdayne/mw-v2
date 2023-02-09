import { Component, OnInit } from '@angular/core';
import { MarketDetailsService } from '../market-details.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { MarketProfile } from '../../../core/models/market-profile.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-market-details-profile',
  templateUrl: './market-details-profile.component.html',
  styleUrls: ['./market-details-profile.component.css']
})
export class MarketDetailsProfileComponent implements OnInit {
  symbol = '';
  profile: MarketProfile;
  loading = true;

  constructor(private marketDetailsService: MarketDetailsService,
              private route: ActivatedRoute,
              public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.route?.parent?.params.subscribe( params => {
      this.symbol = params['symbol'];
      if (this.symbol) {
        this.getMarketProfile();
      }
    })
  }

  getMarketProfile() {
    this.loading = true;
    this.marketDetailsService.getMarketProfile(this.symbol)
      .pipe(finalize(() => this.loading = false))
      .subscribe((res: MarketProfile) => {
      this.profile = res ? res : {} as MarketProfile;
    });
  }

  get isNotEQTYorINDEX() {
    return this.profile.instrument !== 'Equity' && this.profile.instrument !== 'Index';
  }

}
