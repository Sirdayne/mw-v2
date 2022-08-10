import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MarketDataComponent } from './components/market-data/market-data.component';
import { SharedModule } from './shared/shared.service';
import { HistoricalComponent } from './components/historical/historical.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketDataComponent,
    HistoricalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
