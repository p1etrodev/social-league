import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { postIdResolver } from './post-id.resolver';

describe('postIdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => postIdResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
