import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCountComponent } from './interview-count.component';

describe('InterviewCountComponent', () => {
  let component: InterviewCountComponent;
  let fixture: ComponentFixture<InterviewCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
