import { Component, Input, OnInit } from '@angular/core';
import { TableColumn } from '../../core/models/table-column.interface';

@Component({
  selector: 'app-filter-columns',
  templateUrl: './filter-columns.component.html',
  styleUrls: ['./filter-columns.component.css']
})
export class FilterColumnsComponent implements OnInit {
  @Input() columns: TableColumn[];
  showMenu = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

}
