import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsempComponent } from './detailsemp.component';

describe('DetailsempComponent', () => {
  let component: DetailsempComponent;
  let fixture: ComponentFixture<DetailsempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsempComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
