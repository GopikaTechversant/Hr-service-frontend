import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCountsBarComponent } from './interview-counts-bar.component';

describe('InterviewCountsBarComponent', () => {
  let component: InterviewCountsBarComponent;
  let fixture: ComponentFixture<InterviewCountsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewCountsBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewCountsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
