import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateActionsComponent } from './candidate-actions.component';

describe('CandidateActionsComponent', () => {
  let component: CandidateActionsComponent;
  let fixture: ComponentFixture<CandidateActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
