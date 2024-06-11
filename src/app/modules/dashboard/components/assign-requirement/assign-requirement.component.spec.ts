import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRequirementComponent } from './assign-requirement.component';

describe('AssignRequirementComponent', () => {
  let component: AssignRequirementComponent;
  let fixture: ComponentFixture<AssignRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
