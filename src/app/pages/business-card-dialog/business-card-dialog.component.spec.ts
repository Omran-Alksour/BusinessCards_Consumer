import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardDialogComponent } from './business-card-dialog.component';

describe('BusinessCardDialogComponent', () => {
  let component: BusinessCardDialogComponent;
  let fixture: ComponentFixture<BusinessCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCardDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
