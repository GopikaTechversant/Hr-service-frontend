import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsFormModalComponent } from './requirements-form-modal.component';

describe('RequirementsFormModalComponent', () => {
  let component: RequirementsFormModalComponent;
  let fixture: ComponentFixture<RequirementsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementsFormModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
