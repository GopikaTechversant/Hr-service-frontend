import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewFeebackComponent } from './interview-feeback.component';

describe('InterviewFeebackComponent', () => {
  let component: InterviewFeebackComponent;
  let fixture: ComponentFixture<InterviewFeebackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewFeebackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewFeebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
