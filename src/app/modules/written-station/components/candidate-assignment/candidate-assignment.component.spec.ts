import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAssignmentComponent } from './candidate-assignment.component';

describe('CandidateAssignmentComponent', () => {
  let component: CandidateAssignmentComponent;
  let fixture: ComponentFixture<CandidateAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateAssignmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
