import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementStackChartComponent } from './requirement-stack-chart.component';

describe('RequirementStackChartComponent', () => {
  let component: RequirementStackChartComponent;
  let fixture: ComponentFixture<RequirementStackChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementStackChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementStackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
