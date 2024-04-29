import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadS3Component } from './file-upload-s3.component';

describe('FileUploadS3Component', () => {
  let component: FileUploadS3Component;
  let fixture: ComponentFixture<FileUploadS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadS3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUploadS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
