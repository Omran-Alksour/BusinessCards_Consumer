import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BussineesCardComponent } from './business-card.component';

describe('BussineesCardComponent', () => {
  let component: BussineesCardComponent;
  let fixture: ComponentFixture<BussineesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BussineesCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BussineesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
