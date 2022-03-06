import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateDirectoryComponent } from './dialog-create-directory.component';

describe('DialogCreateDirectoryComponent', () => {
  let component: DialogCreateDirectoryComponent;
  let fixture: ComponentFixture<DialogCreateDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateDirectoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
