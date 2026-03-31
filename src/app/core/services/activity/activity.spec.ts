import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Activity } from './activity';

describe('Activity', () => {
  let service: Activity;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Activity);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
