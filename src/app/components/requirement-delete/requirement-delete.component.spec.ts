import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementDeleteComponent } from './requirement-delete.component';

describe('RequirementDeleteComponent', () => {
  let component: RequirementDeleteComponent;
  let fixture: ComponentFixture<RequirementDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementDeleteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
