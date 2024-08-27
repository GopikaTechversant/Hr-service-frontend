import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCandidateDetailComponent } from './station-candidate-detail.component';

describe('StationCandidateDetailComponent', () => {
  let component: StationCandidateDetailComponent;
  let fixture: ComponentFixture<StationCandidateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationCandidateDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationCandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
