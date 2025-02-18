import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectionFeedbackComponent } from './rejection-feedback.component';

describe('RejectionFeedbackComponent', () => {
  let component: RejectionFeedbackComponent;
  let fixture: ComponentFixture<RejectionFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectionFeedbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
