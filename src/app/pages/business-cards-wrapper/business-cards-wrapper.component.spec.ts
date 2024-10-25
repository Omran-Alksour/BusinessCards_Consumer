import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardsWrapperComponent } from './business-cards-wrapper.component';

describe('BusinessCardsWrapperComponent', () => {
  let component: BusinessCardsWrapperComponent;
  let fixture: ComponentFixture<BusinessCardsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCardsWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessCardsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
