import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTradeTestComponent } from './add-trade-test.component';

describe('AddTradeTestComponent', () => {
  let component: AddTradeTestComponent;
  let fixture: ComponentFixture<AddTradeTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTradeTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTradeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
