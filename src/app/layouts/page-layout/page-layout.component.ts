import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

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
    }
  ]

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  get activeLink() {
    const url = this.router.url;
    if (url === '/historical') {
      return 'Historical Data'
    }
    return 'Market Data'
  }
}
