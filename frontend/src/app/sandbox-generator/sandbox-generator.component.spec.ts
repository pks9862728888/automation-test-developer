import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandboxGeneratorComponent } from './sandbox-generator.component';

describe('SandboxGeneratorComponent', () => {
  let component: SandboxGeneratorComponent;
  let fixture: ComponentFixture<SandboxGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SandboxGeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SandboxGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
