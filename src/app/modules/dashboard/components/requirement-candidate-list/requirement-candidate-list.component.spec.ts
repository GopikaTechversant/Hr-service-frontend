import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementCandidateListComponent } from './requirement-candidate-list.component';

describe('RequirementCandidateListComponent', () => {
  let component: RequirementCandidateListComponent;
  let fixture: ComponentFixture<RequirementCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequirementCandidateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
