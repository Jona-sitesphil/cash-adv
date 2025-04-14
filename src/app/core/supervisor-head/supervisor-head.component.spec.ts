import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorHeadComponent } from './supervisor-head.component';

describe('SupervisorHeadComponent', () => {
  let component: SupervisorHeadComponent;
  let fixture: ComponentFixture<SupervisorHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupervisorHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupervisorHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
