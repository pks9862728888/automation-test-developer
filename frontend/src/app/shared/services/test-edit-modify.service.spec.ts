import { TestBed } from '@angular/core/testing';
import { TestEditModifyService } from './test-edit-modify.service';


describe('TestEditModifyService', () => {
  let service: TestEditModifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestEditModifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
