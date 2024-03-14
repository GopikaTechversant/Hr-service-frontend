import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCandidateDetailComponent } from './hr-candidate-detail.component';

describe('HrCandidateDetailComponent', () => {
  let component: HrCandidateDetailComponent;
  let fixture: ComponentFixture<HrCandidateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrCandidateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrCandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
