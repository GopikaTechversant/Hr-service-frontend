import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalHomeComponent } from './technical-home.component';

describe('TechnicalHomeComponent', () => {
  let component: TechnicalHomeComponent;
  let fixture: ComponentFixture<TechnicalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnicalHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
