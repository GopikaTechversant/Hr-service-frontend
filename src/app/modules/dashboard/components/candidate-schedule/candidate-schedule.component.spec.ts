import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateScheduleComponent } from './candidate-schedule.component';

describe('CandidateScheduleComponent', () => {
  let component: CandidateScheduleComponent;
  let fixture: ComponentFixture<CandidateScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
