import { TestBed } from '@angular/core/testing';

import { HttpCounterService } from './http-counter.service';

describe('HttpCounterService', () => {
  let service: HttpCounterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpCounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
