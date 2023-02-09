import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss']
})
export class PageLayoutComponent implements OnInit {
  date = new Date().toLocaleDateString();

  navLinks = [
    {
      url: '',
      name: 'Market Data'
    },
    {
      url: 'historical',
      name: 'Historical Data'
    },
    {
      url: 'etf',
      name: 'ETF/ETN'
    },
    {
      url: 'repo',
      name: 'Repo Market'
    },
    {
      url: 'repo-historical',
      name: 'Repo Historical'
    }
  ];

  symbol;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.setMarketSymbolOnLoad();
    this.setMarketSymbol();
  }

  ngOnInit(): void {
  }

  setMarketSymbolOnLoad() {
    this.route?.firstChild?.params.subscribe((params) => {
      const period = params && params['period'] ? params['period'] : '';
      const symbol = params && params['symbol'] ? params['symbol'] : '';
      this.symbol = period && symbol ? symbol + ' ' + period : symbol;
    })
  }

  setMarketSymbol() {
    this.router.events
      .subscribe(
        (event) => {
          if (event && event instanceof NavigationStart && event.url && event.url.includes('details')) {
            this.setMarketSymbolByUrl(event.url);
          }
        });
  }

  setMarketSymbolByUrl(url) {
    let symbol = url.replace('/details/', '/')
                    .replace('/repo-details/', '/');
    symbol = symbol.substring(symbol.indexOf("/") + 1, symbol.lastIndexOf("/"));
    symbol = symbol.replace('/', ' ');
    this.symbol = symbol;
  }

  get activeLink() {
    const url = this.router.url;
    if (url === '/historical') {
      return 'Historical Data'
    }
    if (url.includes('/details')) {
      return this.symbol ? this.symbol : 'Market Details';
    }
    if (url === '/etf') {
      return 'ETF/ETN'
    }
    if (url === '/repo') {
      return 'Repo Market'
    }
    if (url === '/repo-historical') {
      return 'Repo Historical'
    }
    if (url.includes('/repo-details')) {
      return this.symbol ? this.symbol : 'Repo Details';
    }
    return 'Market Data'
  }
}
