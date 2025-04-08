import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnabledComponent } from './enabled.component';

describe('EnabledComponent', () => {
  let component: EnabledComponent;
  let fixture: ComponentFixture<EnabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
