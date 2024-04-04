import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubmissionModalComponent } from './resubmission-modal.component';

describe('ResubmissionModalComponent', () => {
  let component: ResubmissionModalComponent;
  let fixture: ComponentFixture<ResubmissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResubmissionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
