import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRecruitmentComponent } from './detailed-recruitment.component';

describe('DetailedRecruitmentComponent', () => {
  let component: DetailedRecruitmentComponent;
  let fixture: ComponentFixture<DetailedRecruitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedRecruitmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
