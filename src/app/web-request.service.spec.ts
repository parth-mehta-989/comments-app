import { TestBed } from '@angular/core/testing';

import { WebrequestService } from './web-request.service';

describe('WebrequestServiceService', () => {
  let service: WebrequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebrequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
