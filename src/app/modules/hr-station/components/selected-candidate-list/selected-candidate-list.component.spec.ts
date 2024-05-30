import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCandidateListComponent } from './selected-candidate-list.component';

describe('SelectedCandidateListComponent', () => {
  let component: SelectedCandidateListComponent;
  let fixture: ComponentFixture<SelectedCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedCandidateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
