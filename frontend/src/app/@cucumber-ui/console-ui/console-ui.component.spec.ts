import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleUiComponent } from './console-ui.component';

describe('ConsoleComponent', () => {
  let component: ConsoleUiComponent;
  let fixture: ComponentFixture<ConsoleUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsoleUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
