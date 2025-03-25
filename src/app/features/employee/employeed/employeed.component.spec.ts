import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeedComponent } from './employeed.component';

describe('EmployeedComponent', () => {
  let component: EmployeedComponent;
  let fixture: ComponentFixture<EmployeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
