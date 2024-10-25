import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussineesCardFormComponent } from './business-card-form.component';

describe('BussineesCardFormComponent', () => {
  let component: BussineesCardFormComponent;
  let fixture: ComponentFixture<BussineesCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BussineesCardFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BussineesCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
