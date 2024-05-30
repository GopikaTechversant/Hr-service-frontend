import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRequirementComponent } from './edit-requirement.component';

describe('EditRequirementComponent', () => {
  let component: EditRequirementComponent;
  let fixture: ComponentFixture<EditRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRequirementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
