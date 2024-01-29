import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalDetailComponent } from './technical-detail.component';

describe('TechnicalDetailComponent', () => {
  let component: TechnicalDetailComponent;
  let fixture: ComponentFixture<TechnicalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
