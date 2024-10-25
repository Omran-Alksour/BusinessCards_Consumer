import { TestBed } from '@angular/core/testing';

import { BusinessCardservice } from './business-card.service';

describe('BusinessCardservice', () => {
  let service: BusinessCardservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCardservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
