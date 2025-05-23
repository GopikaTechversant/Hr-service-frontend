import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationListPieComponent } from './application-list-pie.component';

describe('ApplicationListPieComponent', () => {
  let component: ApplicationListPieComponent;
  let fixture: ComponentFixture<ApplicationListPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationListPieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationListPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
