import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRenameComponent } from './dialog-rename.component';

describe('DialogRenameComponent', () => {
  let component: DialogRenameComponent;
  let fixture: ComponentFixture<DialogRenameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRenameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
