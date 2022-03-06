import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunnerSettingsComponent } from './runner-settings.component';

describe('RunnerSettingsComponent', () => {
  let component: RunnerSettingsComponent;
  let fixture: ComponentFixture<RunnerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunnerSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
