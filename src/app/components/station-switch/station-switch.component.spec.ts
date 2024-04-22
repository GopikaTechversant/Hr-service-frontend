import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSwitchComponent } from './station-switch.component';

describe('StationSwitchComponent', () => {
  let component: StationSwitchComponent;
  let fixture: ComponentFixture<StationSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StationSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
