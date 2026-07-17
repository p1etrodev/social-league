import { ResolveFn } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { championIdResolver } from './champion-id.resolver';

describe('championIdResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      championIdResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
