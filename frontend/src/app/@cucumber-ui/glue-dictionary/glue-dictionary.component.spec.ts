import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlueDictionary } from './glue-dictionary.component';

describe('GlueDictionary', () => {
  let component: GlueDictionary;
  let fixture: ComponentFixture<GlueDictionary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlueDictionary ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlueDictionary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
