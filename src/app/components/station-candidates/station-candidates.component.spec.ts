import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationCandidatesComponent } from './station-candidates.component';

describe('StationCandidatesComponent', () => {
  let component: StationCandidatesComponent;
  let fixture: ComponentFixture<StationCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationCandidatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
