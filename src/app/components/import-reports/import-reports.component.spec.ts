import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportReportsComponent } from './import-reports.component';

describe('ImportReportsComponent', () => {
  let component: ImportReportsComponent;
  let fixture: ComponentFixture<ImportReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
