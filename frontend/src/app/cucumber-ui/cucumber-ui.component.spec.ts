import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CucumberUiComponent } from './cucumber-ui.component';

describe('CucumberUiComponent', () => {
  let component: CucumberUiComponent;
  let fixture: ComponentFixture<CucumberUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CucumberUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CucumberUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
