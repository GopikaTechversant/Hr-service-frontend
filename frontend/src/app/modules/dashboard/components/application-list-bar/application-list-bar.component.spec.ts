import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationListBarComponent } from './application-list-bar.component';

describe('ApplicationListBarComponent', () => {
  let component: ApplicationListBarComponent;
  let fixture: ComponentFixture<ApplicationListBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationListBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationListBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
