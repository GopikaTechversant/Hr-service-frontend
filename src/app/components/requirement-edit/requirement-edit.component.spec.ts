import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementEditComponent } from './requirement-edit.component';

describe('RequirementEditComponent', () => {
  let component: RequirementEditComponent;
  let fixture: ComponentFixture<RequirementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
