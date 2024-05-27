import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementCandidateListComponent } from './management-candidate-list.component';

describe('ManagementCandidateListComponent', () => {
  let component: ManagementCandidateListComponent;
  let fixture: ComponentFixture<ManagementCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementCandidateListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
