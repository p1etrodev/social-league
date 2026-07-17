import { SupaService } from './supa.service';
import { TestBed } from '@angular/core/testing';

describe('SupaService', () => {
  let service: SupaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
