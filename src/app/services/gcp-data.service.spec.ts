import { TestBed } from '@angular/core/testing';

import { GcpDataService } from './gcp-data.service';

describe('GcpDataService', () => {
  let service: GcpDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GcpDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
