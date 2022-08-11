import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
