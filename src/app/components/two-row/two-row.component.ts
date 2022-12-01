import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-two-row',
  templateUrl: './two-row.component.html',
  styleUrls: ['./two-row.component.css']
})
export class TwoRowComponent implements OnInit {
  @Input() label;
  @Input() data;
  @Input() isPrimary = false;

  constructor() { }

  ngOnInit(): void {
  }

}
