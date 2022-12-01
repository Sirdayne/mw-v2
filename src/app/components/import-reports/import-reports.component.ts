import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-import-reports',
  templateUrl: './import-reports.component.html',
  styleUrls: ['./import-reports.component.css']
})
export class ImportReportsComponent implements OnInit {
  @Output() downloadReport = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  emitDownloadReport(type) {
    this.downloadReport.emit(type);
  }

}
