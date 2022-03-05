import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureEditorComponent } from './feature-editor.component';

describe('FeatureEditorComponent', () => {
  let component: FeatureEditorComponent;
  let fixture: ComponentFixture<FeatureEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
