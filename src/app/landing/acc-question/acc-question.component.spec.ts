import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccQuestionComponent } from './acc-question.component';

describe('AccQuestionComponent', () => {
  let component: AccQuestionComponent;
  let fixture: ComponentFixture<AccQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccQuestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
