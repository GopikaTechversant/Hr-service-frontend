import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDetailComponent } from './management-detail.component';

describe('ManagementDetailComponent', () => {
  let component: ManagementDetailComponent;
  let fixture: ComponentFixture<ManagementDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
