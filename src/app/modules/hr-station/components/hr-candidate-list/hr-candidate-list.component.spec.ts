import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrCandidateListComponent } from './hr-candidate-list.component';

describe('HrCandidateListComponent', () => {
  let component: HrCandidateListComponent;
  let fixture: ComponentFixture<HrCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrCandidateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
