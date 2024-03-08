/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GoalsBySellersMonthComponent } from './goals-by-sellers-month.component';

describe('GoalsBySellersMonthComponent', () => {
  let component: GoalsBySellersMonthComponent;
  let fixture: ComponentFixture<GoalsBySellersMonthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsBySellersMonthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsBySellersMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
